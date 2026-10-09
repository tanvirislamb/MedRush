"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import Link from "next/link";

import { Button } from "@/Components/Button";
import { EmptyState, ErrorState, LoadingState, TableShell, Td, Th } from "@/Components/Data";
import { PageHeader, Panel, PanelHeader, StatCard } from "@/Components/Layout";
import { RequireRole } from "@/Components/RequireRole";
import { StatusTag } from "@/Components/StatusTag";
import { useToast } from "@/Hooks/useToast";
import { paymentService } from "@/Services/paymentService";
import { tripService } from "@/Services/tripService";
import { ApiError } from "@/Services/httpClient";
import { formatCurrency, formatDateTime } from "@/Utils/format";
import { PAYMENT_STATUS, TRIP_STATUS } from "@/Utils/presentation";

function PaymentsScreen() {
  const queryClient = useQueryClient();
  const { notify } = useToast();

  const payments = useQuery({ queryKey: ["payments"], queryFn: () => paymentService.list() });

  // Only completed trips are payable, so look for ones without a completed payment.
  const payable = useQuery({
    queryKey: ["trips", "payable"],
    queryFn: () => tripService.listForViewer({ page: 1, limit: 50, status: "COMPLETED" }),
  });

  const checkout = useMutation({
    // Wrapped, not passed by reference: React Query calls this with its mutation
    // context, which would land in initiateCheckout's `method` parameter.
    mutationFn: (tripId: string) => paymentService.initiateCheckout(tripId),
    onSuccess: async (session) => {
      notify({ title: "Redirecting to Stripe…", tone: "info" });
      await queryClient.invalidateQueries({ queryKey: ["payments"] });
      // Stripe Checkout is an external page; a full navigation is required.
      window.location.assign(session.sessionUrl);
    },
    onError: (error) =>
      notify({
        title: "Could not start checkout",
        description: error instanceof ApiError ? error.message : undefined,
        tone: "error",
      }),
  });

  if (payments.isLoading) return <LoadingState label="Loading payments…" />;
  if (payments.isError) {
    return <ErrorState message={(payments.error as Error).message} onRetry={() => payments.refetch()} />;
  }

  const rows = payments.data ?? [];
  const paid = rows.filter((p) => p.status === "COMPLETED");
  const outstanding = rows.filter((p) => p.status !== "COMPLETED");

  const settledTripIds = new Set(paid.map((p) => p.tripId));
  const payableTrips = (payable.data?.data ?? []).filter((trip) => !settledTripIds.has(trip.id));

  return (
    <>
      <PageHeader
        eyebrow="Payments"
        title="Payments"
        description="Trip fares settled through Stripe Checkout."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Collected" value={formatCurrency(paid.reduce((s, p) => s + p.amount, 0))} tone="success" />
        <StatCard
          label="Outstanding"
          value={formatCurrency(outstanding.reduce((s, p) => s + p.amount, 0))}
          tone={outstanding.length ? "critical" : "success"}
          hint={`${outstanding.length} unpaid`}
        />
        <StatCard label="Transactions" value={rows.length} tone="brand" />
      </div>

      {payableTrips.length > 0 ? (
        <Panel className="mb-6">
          <PanelHeader
            title="Trips awaiting payment"
            description="Completed trips that have not been settled yet."
          />
          <ul className="divide-y divide-line">
            {payableTrips.map((trip) => (
              <li key={trip.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <Link
                    href={`/trips/${trip.id}`}
                    className="text-sm font-medium text-ink hover:underline"
                  >
                    {trip.request?.pickupLocation ?? "Trip"}
                  </Link>
                  <p className="mt-0.5 text-xs text-ink-subtle">
                    {trip.ambulance?.vehicleNumber ?? "—"} ·{" "}
                    {formatDateTime(trip.completedAt ?? trip.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold tabular-nums text-ink">
                    {formatCurrency(trip.fare ?? 100)}
                  </span>
                  <Button
                    size="sm"
                    isLoading={checkout.isPending && checkout.variables === trip.id}
                    icon={<CreditCard className="h-3.5 w-3.5" aria-hidden="true" />}
                    disabled={checkout.isPending}
                    onClick={() => checkout.mutate(trip.id)}
                  >
                    Pay
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <Panel>
        <PanelHeader title="Payment history" />
        {rows.length === 0 ? (
          <EmptyState
            title="No payments yet"
            description="Payments appear here once a trip fare has been raised."
            icon={<CreditCard className="h-5 w-5" aria-hidden="true" />}
          />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Trip</Th>
                <Th>Amount</Th>
                <Th>Method</Th>
                <Th>Status</Th>
                <Th>Paid at</Th>
                <Th>Reference</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((payment) => (
                <tr key={payment.id} className="hover:bg-surface-sunken/60">
                  <Td>
                    <Link
                      href={`/trips/${payment.tripId}`}
                      className="font-medium text-brand-700 hover:underline"
                    >
                      {payment.trip?.request?.pickupLocation ?? "Trip"}
                    </Link>
                    {payment.trip ? (
                      <span className="ml-2">
                        <StatusTag presentation={TRIP_STATUS[payment.trip.status]} />
                      </span>
                    ) : null}
                  </Td>
                  <Td className="font-medium tabular-nums">{formatCurrency(payment.amount)}</Td>
                  <Td className="text-ink-muted">{payment.method}</Td>
                  <Td>
                    <StatusTag presentation={PAYMENT_STATUS[payment.status]} />
                  </Td>
                  <Td className="whitespace-nowrap text-xs text-ink-muted">
                    {formatDateTime(payment.paidAt)}
                  </Td>
                  <Td className="max-w-40 truncate text-xs text-ink-subtle">
                    {payment.transactionId ?? "—"}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </Panel>
    </>
  );
}

export default function PaymentsPage() {
  return (
    <RequireRole allow={["PATIENT"]}>
      <PaymentsScreen />
    </RequireRole>
  );
}