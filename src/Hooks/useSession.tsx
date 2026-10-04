"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";

import { ApiError } from "@/Services/httpClient";
import { authService } from "@/Services/authService";
import type { Role, User } from "@/Types/domain";

interface SessionApi {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** True only for a genuine "not signed in" answer, not a transport failure. */
  isUnauthenticated: boolean;
  refreshUser: () => Promise<void>;
  signOut: () => void;
}

const SessionContext = createContext<SessionApi | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        return await authService.me();
      } catch (error) {
        // A 401 here is the expected "no session" path. Anything else (backend down,
        // network) must not be reported as signed-out, or the guard would bounce the
        // user to /login for an outage.
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }
    },
    retry: false,
    staleTime: 60_000,
  });

  const signOut = useCallback(() => {
    // Run async work in an IIFE so the callback stays synchronous for callers.
    void (async () => {
      // 1. Hit the local Next.js route that sets Set-Cookie: Max-Age=0 on both
      //    httpOnly cookies — this actually deletes them from the browser.
      await authService.logout();
      // 2. Wipe all cached query data.
      queryClient.clear();
      // 3. Hard-navigate to the landing page. A full page load is required so the
      //    new QueryClient starts fresh and /auth/me returns 401 (no cookie).
      window.location.assign("/");
    })();
  }, [queryClient]);

  const refreshUser = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const api = useMemo<SessionApi>(
    () => ({
      user: data ?? null,
      role: data?.role ?? null,
      isLoading,
      isAuthenticated: Boolean(data),
      isUnauthenticated: !isLoading && data === null,
      refreshUser,
      signOut,
    }),
    [data, isLoading, refreshUser, signOut],
  );

  return <SessionContext.Provider value={api}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionApi {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside <SessionProvider>");
  return context;
}

/** Convenience guard for screens that are meaningless without a role. */
export function useRole(...allowed: Role[]): boolean {
  const { role } = useSession();
  return role !== null && allowed.includes(role);
}