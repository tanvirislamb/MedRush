"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, CreditCard } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/Components/Button";
import { ErrorState, LoadingState } from "@/Components/Data";
import { Select } from "@/Components/Form";
import { Panel, PanelHeader, StatCard } from "@/Components/Layout";
import { StatusTag } from "@/Components/StatusTag";
import { TripProgress } from "@/Components/TripProgress";
import { useSession } from "@/Hooks/useSession";
import { useToast } from "@/Hooks/useToast";
import { hospitalService } from "@/Services/hospitalService";
import { tripService, nextTripStatuses } from "@/Services/tripService";
import { ApiError } from "@/Services/httpClient";
import { formatCurrency, formatDateTime, formatDistance } from "@/Utils/format";
import { PAYMENT_STATUS, TRIP_STATUS } from "@/Utils/presentation";
import type { TripStatus } from "@/Types/domain";

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { role } = useSession();

  const [hospitalId, setHospitalId] = useState("");

  const trip = useQuery({
    queryKey: ["trips", "detail", id],
    queryFn: () => tripService.detail(id),
    enabled: Boolean(id),
  });

  const hospitals = useQuery({
    queryKey: ["hospitals", "all"],
    queryFn: () => hospitalService.list({ limit: 100 }),
    enabled: role === "DISPATCHER" || role === "ADMIN",
  });

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["trips"] }),
      queryClient.invalidateQueries({ queryKey: ["fleet"] }),
      queryClient.invalidateQueries({ queryKey: ["crew"] }),
    ]);
  };

  const setStatus = useMutation({
    mutationFn: (status: TripStatus) => tripService.setStatus(id, status),
    onSuccess: async () => {
      notify({ title: "Trip updated", tone: "success" });
      await invalidate();
      await queryClient.invalidateQueries({ queryKey: ["trips", "detail", id] });
    },
    onError: (error) =>
      notify({
        title: "Could not update",
        description: error instanceof ApiError ? error.message : undefined,
        tone: "error",
      }),
  });

  const assignHospital = useMutation({
    mutationFn: (target: string) => tripService.assignHospital(id, target),
    onSuccess: async () => {
      notify({ title: "Hospital assigned", tone: "success" });
      setHospitalId("");
      await queryClient.invalidateQueries({ queryKey: ["trips", "detail", id] });
    },
    onError: (error) =>
      notify({
        title: "Could not assign",
        description: error instanceof ApiError ? error.message : undefined,
        tone: "error",
      }),
  });

  if (trip.isLoading) return <LoadingState label="Loading trip…" />;
  if (trip.isError) {
    return <ErrorState message={(trip.error as Error).message} onRetry={() => trip.refetch()} />;
  }

  const data = trip.data;
  if (!data) return null;

  const isOperator = role === "DISPATCHER" || role === "ADMIN";
  const transitions = isOperator ? nextTripStatuses(data.status) : [];
  // The backend only accepts a hospital while the crew is on the move.
  const canAssignHospital = ["EN_ROUTE", "AT_PICKUP", "TRANSPORTING"].includes(data.status);

  return (
    <>
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">Trip</p>
          <h1 className="text-display mt-1 text-2xl text-ink sm:text-3xl">
            {data.request?.pickupLocation ?? "Trip detail"}
          </h1>
        </div>
        <StatusTag
          presentation={TRIP_STATUS[data.status]}
          pulse={!["COMPLETED", "CANCELLED"].includes(data.status)}
        />
      </div>

      <Panel className="mb-6 p-5">
        <TripProgress status={data.status} />
      </Panel>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Ambulance" value={data.ambulance?.vehicleNumber ?? "—"} tone="brand" />
        <StatCard label="Driver" value={data.driver?.name ?? "—"} />
        <StatCard label="Distance" value={formatDistance(data.distanceKm)} />
        <StatCard label="Fare" value={formatCurrency(data.fare)} tone="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Journey" />
          <dl className="divide-y divide-line">
            {[
              ["Pickup", data.request?.pickupLocation ?? "—"],
              ["Caller", data.request?.patientName ?? "—"],
              ["Contact", data.request?.contact ?? "—"],
              ["Hospital", data.hospital?.name ?? "Not assigned"],
              ["Started", formatDateTime(data.startedAt)],
              ["Completed", formatDateTime(data.completedAt)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4 px-5 py-3">
                <dt className="text-sm text-ink-muted">{label}</dt>
                <dd className="text-right text-sm font-medium text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <div className="space-y-6">
          {transitions.length > 0 ? (
            <Panel>
              <PanelHeader
                title="Advance this trip"
                description="Only the transitions allowed by the backend state machine are shown."
              />
              <div className="flex flex-wrap gap-2 p-5">
                {transitions.map((next) => (
                  <Button
                    key={next}
                    variant={next === "CANCELLED" ? "danger" : "primary"}
                    size="sm"
                    isLoading={setStatus.isPending}
                    onClick={() => setStatus.mutate(next)}
                  >
                    Mark {TRIP_STATUS[next].label.toLowerCase()}
                  </Button>
                ))}
              </div>
            </Panel>
          ) : null}

          {isOperator && canAssignHospital ? (
            <Panel>
              <PanelHeader title="Assign receiving hospital" />
              <div className="flex flex-wrap items-end gap-2 p-5">
                <div className="min-w-56 flex-1">
                  <Select
                    label="Hospital"
                    name="hospitalId"
                    value={hospitalId}
                    onChange={(e) => setHospitalId(e.target.value)}
                  >
                    <option value="">Choose a hospital…</option>
                    {hospitals.data?.data
                      .filter((hospital) => !hospital.deletedAt)
                      .map((hospital) => (
                        <option key={hospital.id} value={hospital.id}>
                          {hospital.name} — {hospital.address}
                        </option>
                      ))}
                  </Select>
                </div>
                <Button
                  icon={<Building2 className="h-4 w-4" aria-hidden="true" />}
                  disabled={!hospitalId}
                  isLoading={assignHospital.isPending}
                  onClick={() => assignHospital.mutate(hospitalId)}
                >
                  Assign
                </Button>
              </div>
            </Panel>
          ) : null}

          <Panel>
            <PanelHeader title="Payment" />
            {data.payment ? (
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {formatCurrency(data.payment.amount)}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-subtle">
                    {data.payment.method} · {formatDateTime(data.payment.paidAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusTag presentation={PAYMENT_STATUS[data.payment.status]} />
                  <Link
                    href="/payments"
                    className="text-sm font-semibold text-brand-700 hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ) : (
              <p className="flex items-center gap-2 px-5 py-4 text-sm text-ink-muted">
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                No payment has been raised for this trip yet.
              </p>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}