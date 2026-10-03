import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import type { ApiEnvelope, ValidationIssue } from "@/Types/api";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** Prevents the refresh interceptor from firing on auth endpoints. */
    skipSessionRetry?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    skipSessionRetry?: boolean;
    /** Marks a request that has already been replayed after a refresh. */
    _sessionRetried?: boolean;
  }
}

/**
 * Backend auth responses never expose the tokens - they only set httpOnly
 * cookies. So `withCredentials` plus a same-origin proxy (see next.config.ts)
 * is the whole session strategy; there is no bearer token to attach.
 */
const httpClient: AxiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  timeout: 20_000,
});

/** Thrown for any non-2xx response so callers get one predictable shape. */
export class ApiError extends Error {
  readonly status: number;
  readonly issues: ValidationIssue[];

  constructor(message: string, status: number, issues: ValidationIssue[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.issues = issues;
  }

  /** Field-keyed messages, ready to hand to a form. */
  get fieldErrors(): Record<string, string> {
    return this.issues.reduce<Record<string, string>>((acc, issue) => {
      if (issue.path && !acc[issue.path]) acc[issue.path] = issue.message;
      return acc;
    }, {});
  }
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiEnvelope<unknown> & { errors?: ValidationIssue[] }>;
    const status = axiosError.response?.status ?? 0;
    const body = axiosError.response?.data;
    const message =
      body?.message ??
      (status === 429
        ? "Too many requests. Please slow down and try again shortly."
        : status === 0
          ? "Cannot reach the dispatch service. Check your connection."
          : axiosError.message);
    return new ApiError(message, status, body?.errors ?? []);
  }
  return new ApiError("Something went wrong.", 0);
}

/* -------------------------------------------------------------------------- */
/* Session recovery                                                            */
/* -------------------------------------------------------------------------- */

const SESSION_PATHS = ["/auth/login", "/auth/register", "/auth/refresh-token"];

let refreshInFlight: Promise<void> | null = null;

function sendToLogin(): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname === "/login") return;
  const next = encodeURIComponent(window.location.pathname + window.location.search);
  // A full navigation is deliberate. router.push() would keep the stale React Query
  // session cache alive, so AppShell would still consider the user signed in and bounce
  // them straight back. Reloading discards the cache and re-bootstraps from /auth/me.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(`/login?next=${next}`);
}

/**
 * Concurrent 401s share one refresh call rather than each firing their own,
 * then every queued request replays. On failure the user is sent to /login.
 */
function refreshSession(): Promise<void> {
  if (!refreshInFlight) {
    refreshInFlight = httpClient
      .post("/auth/refresh-token", null, { skipSessionRetry: true })
      .then(() => undefined)
      .catch((error) => {
        sendToLogin();
        throw toApiError(error);
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const axiosError = error as AxiosError;
    const config = axiosError.config as InternalAxiosRequestConfig | undefined;
    const status = axiosError.response?.status;

    const isSessionEndpoint = SESSION_PATHS.some((path) => config?.url?.includes(path));

    if (
      status === 401 &&
      config &&
      !config.skipSessionRetry &&
      !config._sessionRetried &&
      !isSessionEndpoint
    ) {
      config._sessionRetried = true;
      try {
        await refreshSession();
        return await httpClient.request(config);
      } catch (refreshError) {
        return Promise.reject(toApiError(refreshError));
      }
    }

    return Promise.reject(toApiError(error));
  },
);

/* -------------------------------------------------------------------------- */
/* Envelope unwrapping                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Strips `{ success, message, data }` so every caller receives the payload
 * directly. Axios needs the second generic to reflect that.
 */
httpClient.interceptors.response.use((response) => response.data.data);

/* -------------------------------------------------------------------------- */
/* Typed verbs                                                                */
/* -------------------------------------------------------------------------- */

async function send<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    // The response interceptor replaces the envelope with `response.data.data`, so the
    // runtime value is already T. Axios' conditional AxiosResponseResult type cannot see
    // through that interceptor, hence the assertion.
    return (await httpClient.request<ApiEnvelope<T>, T>(config)) as T;
  } catch (error) {
    throw toApiError(error);
  }
}

export const api = {
  // `object` rather than Record<string, unknown>: interfaces have no implicit index
  // signature, so the services' typed param objects would not be assignable.
  get: <T>(path: string, params?: object, config?: AxiosRequestConfig) =>
    send<T>({ ...config, method: "GET", url: path, params }),

  post: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
    send<T>({ ...config, method: "POST", url: path, data: body }),

  patch: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
    send<T>({ ...config, method: "PATCH", url: path, data: body }),

  delete: <T>(path: string, config?: AxiosRequestConfig) =>
    send<T>({ ...config, method: "DELETE", url: path }),
};

export { ApiError as default };
