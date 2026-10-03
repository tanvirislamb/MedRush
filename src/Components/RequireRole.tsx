"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { LoadingState } from "@/Components/Data";
import { Panel } from "@/Components/Layout";
import { useSession } from "@/Hooks/useSession";
import type { Role } from "@/Types/domain";

/**
 * Client-side role gate. The backend enforces the same rules independently -
 * this only avoids showing a screen the user cannot use.
 */
export function RequireRole({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const { role, isLoading } = useSession();

  if (isLoading) return <LoadingState label="Checking your access…" />;

  if (!role) {
    return (
      <Panel className="mx-auto max-w-md p-8 text-center">
        <h1 className="text-display text-xl text-ink">Access denied</h1>
        <p className="mt-2 text-sm text-ink-muted">Your account does not have access to this area.</p>
      </Panel>
    );
  }

  if (!allow.includes(role)) {
    return (
      <Panel className="mx-auto max-w-md p-8 text-center">
        <h1 className="text-display text-xl text-ink">Not available for your role</h1>
        <p className="mt-2 text-sm text-ink-muted">
          This screen is limited to {allow.map((r) => r.toLowerCase()).join(" and ")} accounts.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline"
        >
          Back to overview
        </Link>
      </Panel>
    );
  }

  return <>{children}</>;
}