"use client";

import { CreditCard, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { buttonClass } from "@/Components/Button";
import { LoadingState } from "@/Components/Data";
import { Panel } from "@/Components/Layout";
import { ReturnShell } from "@/Components/ReturnShell";

/**
 * Stripe sends the customer here when they back out of Checkout. Nothing was
 * charged, and the trip is still payable from the payments screen.
 */
function CancelledNotice() {
  const tripId = useSearchParams().get("trip_id");

  return (
    <Panel>
      <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-sunken text-ink-subtle">
          <XCircle className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Payment cancelled</p>
          <p className="mt-1 text-sm text-ink-muted">
            No charge was made. You can pay this trip fare whenever you are ready.
          </p>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <Link href="/payments" className={buttonClass("primary")}>
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            Go to payments
          </Link>
          {tripId ? (
            <Link href={`/trips/${tripId}`} className={buttonClass("secondary")}>
              View trip
            </Link>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}

export default function PaymentCancelPage() {
  return (
    <ReturnShell>
      <Suspense fallback={<LoadingState label="Loading…" />}>
        <CancelledNotice />
      </Suspense>
    </ReturnShell>
  );
}