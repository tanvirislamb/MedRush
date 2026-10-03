import { api } from "./httpClient";
import type { Role, User } from "@/Types/domain";

interface Credentials {
  email: string;
  password: string;
}

interface Registration extends Credentials {
  name: string;
  phone?: string;
  role?: Extract<Role, "PATIENT" | "DISPATCHER">;
}

export const authService = {
  register: (body: Registration) => api.post<User>("/auth/register", body),
  login: (body: Credentials) => api.post<User>("/auth/login", body),
  refresh: () => api.post<User>("/auth/refresh-token"),
  /**
   * `skipSessionRetry` matters here: /auth/me is the session bootstrap, and a 401 from it
   * is the normal "not signed in" answer. Without the flag the response interceptor would
   * fire a doomed refresh and then hard-redirect to /login, making /register unreachable.
   */
  me: () => api.get<User>("/auth/me", undefined, { skipSessionRetry: true }),
};
