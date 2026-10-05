import { Ambulance } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Chrome-free, centred frame for the pages Stripe redirects back to. These sit
 * outside the (console) group on purpose: a checkout return is a single task,
 * not a place to navigate around in.
 */
export function ReturnShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white">
              <Ambulance className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-ink">MedRush</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Back to console
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}