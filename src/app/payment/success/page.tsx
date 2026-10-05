"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, CreditCard, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { buttonClass } from "@/Components/Button";
import { LoadingState } from "@/Components/Data";
import { Panel } from "@/Components/Layout";
import { ReturnShell } from "@/Components/ReturnShell";
import { paymentService } from "@/Services/paymentService";
import { formatCurrency, formatDateTime } from "@/Utils/format";

/**
 * Stripe returns here the moment checkout finishes, but the payment only flips
 * to COMPLETED when the webhook lands a moment later. So this page polls until
 * the status settles instead of trusting the URL.
 */
const POLL_INTERVAL_MS = 1_500;
const POLL_DEADLINE_MS = 20_000;

function PaymentResult() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const tripId = searchParams.get("trip_id");

  const [gaveUp, setGaveUp] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setGaveUp(true), POLL_DEADLINE_MS);
    return () => clearTimeout(timer);
  }, []);

  const payments = useQuery({
    queryKey: ["payments"],
    queryFn: () => paymentService.list(),
    // Stop polling as soon as the payment reaches a terminal state.
    refetchInterval: (query) => {
      if (gaveUp) return false;
      const rows = query.state.data;
      const payment = rows?.find((row) => row.tripId === tripId);
      return payment && payment.status !== "PENDING" ? false : POLL_INTERVAL_MS;
    },
  });

  const rows = payments.data;
  const payment =
    rows?.find((row) => row.tripId === tripId) ??
    // Sessions created before trip_id was added can still be matched by session id.
    rows?.find((row) => row.transactionId === sessionId);

  const amount = payment ? formatCurrency(payment.amount) : null;
  const pickup = payment?.trip?.request?.pickupLocation;
  const tripHref = tripId ? `/trips/${tripId}` : "/trips";

  /* ── Could not load the payment at all ────────────────────────────────────── */
  if (payments.isError) {
    return (
      <Panel>
        <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-sunken text-ink-subtle">
            <XCircle className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">We could not load your payment</p>
            <p className="mt-1 text-sm text-ink-muted">
              Your session may have expired. Sign in again to check whether the payment went
              through.
            </p>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <Link href="/login" className={buttonClass("primary")}>
              Sign in
            </Link>
            <Link href="/payments" className={buttonClass("secondary")}>
              Payments
            </Link>
          </div>
        </div>
      </Panel>
    );
  }

  /* ── Still confirming ────────────────────────────────────────────────────── */
  if (!payment && !gaveUp) {
    return (
      <Panel>
        <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand-600" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-ink">Confirming your payment</p>
            <p className="mt-1 text-sm text-ink-muted">
              Hold on while we confirm the transaction with your bank.
            </p>
          </div>
        </div>
      </Panel>
    );
  }

  /* ── Failed or expired ───────────────────────────────────────────────────── */
  if (payment?.status === "FAILED") {
    return (
      <Panel>
        <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-critical-soft text-critical">
            <XCircle className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Payment failed</p>
            <p className="mt-1 text-sm text-ink-muted">
              {amount ? `${amount} was not charged. ` : ""}
              The checkout session expired or the card was declined.
            </p>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <Link href="/payments" className={buttonClass("primary")}>
              <CreditCard className="h-4 w-4" aria-hidden="true" />
              Try again
            </Link>
            <Link href={tripHref} className={buttonClass("secondary")}>
              View trip
            </Link>
          </div>
        </div>
      </Panel>
    );
  }

  /* ── Succeeded ───────────────────────────────────────────────────────────── */
  if (payment?.status === "COMPLETED") {
    return (
      <Panel>
        <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Payment successful</p>
            <p className="mt-1 text-sm text-ink-muted">
              {amount ? `${amount} received` : "Received"}
              {pickup ? ` for your trip from ${pickup}` : ""}.
            </p>
          </div>
          {payment.paidAt ? (
            <p className="text-xs text-ink-subtle">Paid {formatDateTime(payment.paidAt)}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <Link href={tripHref} className={buttonClass("primary")}>
              View trip
            </Link>
            <Link href="/payments" className={buttonClass("secondary")}>
              All payments
            </Link>
          </div>
        </div>
      </Panel>
    );
  }

  /* ── We could not confirm ────────────────────────────────────────────────── */
  return (
    <Panel>
      <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-high-soft text-high">
          <Clock className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">We could not confirm this payment yet</p>
          <p className="mt-1 text-sm text-ink-muted">
            Stripe has not reported back yet. Your card may still be charged — refresh in a
            moment, or check the payment history for the latest status.
          </p>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <Link href="/payments" className={buttonClass("primary")}>
            Check payment status
          </Link>
          {tripId ? <Link href={tripHref} className={buttonClass("secondary")}>View trip</Link> : null}
        </div>
      </div>
    </Panel>
  );
}

export default function PaymentSuccessPage() {
  return (
    <ReturnShell>
      <Suspense fallback={<LoadingState label="Loading…" />}>
        <PaymentResult />
      </Suspense>
    </ReturnShell>
  );
}