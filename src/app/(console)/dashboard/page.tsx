"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Ambulance,
  Building2,
  ChevronRight,
  CreditCard,
  Route,
  Siren,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { buttonClass } from "@/Components/Button";
import { EmptyState, ErrorState, LoadingState, Timestamp } from "@/Components/Data";
import {
  KeyValue,
  MetricGrid,
  PageHeader,
  Panel,
  PanelHeader,
  ProgressBar,
  StatCard,
} from "@/Components/Layout";
import { StatusTag } from "@/Components/StatusTag";
import { TripProgress } from "@/Components/TripProgress";
import { useSession } from "@/Hooks/useSession";
import { administrationService } from "@/Services/administrationService";
import { crewService } from "@/Services/crewService";
import { emergencyRequestService } from "@/Services/emergencyRequestService";
import { fleetService } from "@/Services/fleetService";
import { paymentService } from "@/Services/paymentService";
import { tripService } from "@/Services/tripService";
import { formatCurrency } from "@/Utils/format";
import { PRIORITY, PRIORITY_ORDER, REQUEST_STATUS, TRIP_STATUS } from "@/Utils/presentation";
import type { TripStatus } from "@/Types/domain";

/**
 * Anything past "assigned a crew" but not yet finished. Mirrors the backend
 * state machine, so COMPLETED and CANCELLED trips are excluded.
 */
const IN_PROGRESS: TripStatus[] = [
  "DISPATCHED",
  "EN_ROUTE",
  "AT_PICKUP",
  "TRANSPORTING",
  "ARRIVED",
];

/* ── Query keys ───────────────────────────────────────────────────────────────
 * Each key is a child of a root the mutating screens already invalidate
 * (["requests"], ["trips"], ["fleet"], ["crew"], ["payments"]), so a dispatch or
 * status change made elsewhere is reflected here without a manual refetch.
 * The trailing "overview" keeps them distinct from the paged list screens,
 * which pass page/filter values in the key.
 * --------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Role switch                                                                 */
/* -------------------------------------------------------------------------- */

export default function DashboardPage() {
  const { user, role } = useSession();

  if (role === "ADMIN") return <AdminOverview />;
  if (role === "DISPATCHER") return <DispatcherOverview name={user?.name ?? ""} />;
  return <PatientOverview name={user?.name ?? ""} />;
}

function ViewAll({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-0.5 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
    >
      {children}
      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Patient                                                                    */
/* -------------------------------------------------------------------------- */

function PatientOverview({ name }: { name: string }) {
  const requests = useQuery({
    queryKey: ["requests", "mine", "overview"],
    queryFn: () => emergencyRequestService.listMine({ page: 1, limit: 5 }),
  });
  // Counted server-side rather than filtered from the five rows above, so the
  // figure stays honest once a patient has more requests than one page.
  const pending = useQuery({
    queryKey: ["requests", "mine", "overview", "pending"],
    queryFn: () => emergencyRequestService.listMine({ page: 1, limit: 1, status: "PENDING" }),
  });
  const trips = useQuery({
    queryKey: ["trips", "viewer", "overview"],
    queryFn: () => tripService.listForViewer({ page: 1, limit: 6 }),
  });
  const payments = useQuery({ queryKey: ["payments"], queryFn: () => paymentService.list() });

  const activeTrip = trips.data?.data.find((trip) => IN_PROGRESS.includes(trip.status));
  const openRequests = pending.data?.meta.total ?? 0;
  const outstanding =
    payments.data
      ?.filter((payment) => payment.status !== "COMPLETED")
      .reduce((total, payment) => total + payment.amount, 0) ?? 0;

  return (
    <>
      <PageHeader
        eyebrow="Patient"
        title={`Hello, ${name.split(" ")[0]}`}
        description="Request an ambulance, then follow the crew all the way to the hospital."
        actions={
          <Link href="/requests" className={buttonClass("primary")}>
            <Siren className="h-4 w-4" aria-hidden="true" />
            New request
          </Link>
        }
      />

      {activeTrip ? (
        <Panel className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight text-ink">Trip in progress</h2>
                <StatusTag presentation={TRIP_STATUS[activeTrip.status]} pulse />
              </div>
              <p className="mt-1.5 text-[13px] text-ink-muted">
                {activeTrip.ambulance?.vehicleNumber ?? "Crew assigned"}
                {activeTrip.driver?.name ? ` · ${activeTrip.driver.name}` : ""}
                {activeTrip.hospital?.name ? ` · ${activeTrip.hospital.name}` : ""}
              </p>
            </div>
            <Link href={`/trips/${activeTrip.id}`} className={buttonClass("secondary", "sm")}>
              View details
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="px-5 py-5">
            <TripProgress status={activeTrip.status} />
          </div>
        </Panel>
      ) : null}

      <MetricGrid columns={3} className="mb-6">
        <StatCard
          label="Awaiting crew"
          value={pending.isLoading ? "—" : openRequests}
          tone={openRequests > 0 ? "warning" : "neutral"}
          icon={<Siren className="h-4 w-4" />}
        />
        <StatCard
          label="Trips"
          value={trips.isLoading ? "—" : (trips.data?.meta.total ?? 0)}
          icon={<Route className="h-4 w-4" />}
        />
        <StatCard
          label="Outstanding"
          value={payments.isLoading ? "—" : formatCurrency(outstanding)}
          tone={outstanding > 0 ? "critical" : "neutral"}
          hint="Unpaid trip fares"
          icon={<CreditCard className="h-4 w-4" />}
        />
      </MetricGrid>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            title="Recent requests"
            actions={<ViewAll href="/requests">View all</ViewAll>}
          />
          {requests.isLoading ? (
            <LoadingState />
          ) : requests.isError ? (
            <ErrorState
              message={(requests.error as Error).message}
              onRetry={() => requests.refetch()}
            />
          ) : requests.data?.data.length === 0 ? (
            <EmptyState
              title="No requests yet"
              description="When you need an ambulance, create a request and a dispatcher will assign a crew."
              icon={<Siren className="h-5 w-5" aria-hidden="true" />}
            />
          ) : (
            <ul className="divide-y divide-line">
              {requests.data?.data.map((request) => (
                <li key={request.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{request.pickupLocation}</p>
                    <p className="mt-0.5 text-xs text-ink-subtle">
                      <Timestamp value={request.createdAt} />
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <StatusTag presentation={REQUEST_STATUS[request.status]} />
                    <StatusTag presentation={PRIORITY[request.priority]} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <PanelHeader title="Recent trips" actions={<ViewAll href="/trips">View all</ViewAll>} />
          {trips.isLoading ? (
            <LoadingState />
          ) : trips.isError ? (
            <ErrorState
              message={(trips.error as Error).message}
              onRetry={() => trips.refetch()}
            />
          ) : trips.data?.data.length === 0 ? (
            <EmptyState
              title="No trips yet"
              description="Trips appear here once a crew has been dispatched."
              icon={<Route className="h-5 w-5" aria-hidden="true" />}
            />
          ) : (
            <ul className="divide-y divide-line">
              {trips.data?.data.map((trip) => (
                <li key={trip.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/trips/${trip.id}`}
                      className="truncate text-sm font-medium text-ink transition-colors hover:text-brand-700"
                    >
                      {trip.request?.pickupLocation ?? "Trip"}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-subtle">
                      {trip.ambulance?.vehicleNumber ?? "Crew assigned"} ·{" "}
                      <Timestamp value={trip.createdAt} />
                    </p>
                  </div>
                  <StatusTag presentation={TRIP_STATUS[trip.status]} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Dispatcher                                                                 */
/* -------------------------------------------------------------------------- */

function DispatcherOverview({ name }: { name: string }) {
  const queue = useQuery({
    queryKey: ["requests", "queue", "overview"],
    queryFn: () => emergencyRequestService.search({ page: 1, limit: 6, status: "PENDING" }),
  });
  // limit:1 — only meta.total is read, and the backend counts before it slices.
  const ambulances = useQuery({
    queryKey: ["fleet", "available", "overview"],
    queryFn: () => fleetService.list({ availability: "AVAILABLE", limit: 1 }),
  });
  const drivers = useQuery({
    queryKey: ["crew", "available", "overview"],
    queryFn: () => crewService.list({ availability: "AVAILABLE", limit: 1 }),
  });
  const trips = useQuery({
    queryKey: ["trips", "viewer", "overview"],
    queryFn: () => tripService.listForViewer({ page: 1, limit: 6 }),
  });

  const pending = queue.data?.meta.total ?? 0;
  const activeTrips = trips.data?.data.filter((trip) => IN_PROGRESS.includes(trip.status)) ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Dispatcher"
        title={`On shift, ${name.split(" ")[0]}`}
        description="Work the incoming queue, then assign an ambulance and driver to each request."
        actions={
          <Link href="/dispatch" className={buttonClass("primary")}>
            <Siren className="h-4 w-4" aria-hidden="true" />
            Open queue
            {pending > 0 ? (
              <span className="rounded-full bg-ink-invert/20 px-1.5 text-xs font-semibold tabular-nums">
                {pending}
              </span>
            ) : null}
          </Link>
        }
      />

      <MetricGrid columns={3} className="mb-6">
        <StatCard
          label="Awaiting dispatch"
          value={queue.isLoading ? "—" : pending}
          tone={pending > 0 ? "warning" : "neutral"}
          icon={<Siren className="h-4 w-4" />}
        />
        <StatCard
          label="Ambulances free"
          value={ambulances.isLoading ? "—" : (ambulances.data?.meta.total ?? 0)}
          icon={<Ambulance className="h-4 w-4" />}
        />
        <StatCard
          label="Drivers free"
          value={drivers.isLoading ? "—" : (drivers.data?.meta.total ?? 0)}
          icon={<Users className="h-4 w-4" />}
        />
      </MetricGrid>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel className="lg:col-span-3">
          <PanelHeader
            title="Awaiting dispatch"
            description="Oldest requests first — critical cases are shown by priority."
            actions={<ViewAll href="/dispatch">Open queue</ViewAll>}
          />
          {queue.isLoading ? (
            <LoadingState />
          ) : queue.isError ? (
            <ErrorState
              message={(queue.error as Error).message}
              onRetry={() => queue.refetch()}
            />
          ) : queue.data?.data.length === 0 ? (
            <EmptyState
              title="Queue is clear"
              description="No requests are waiting for a crew right now."
              icon={<Siren className="h-5 w-5" aria-hidden="true" />}
            />
          ) : (
            <ul className="divide-y divide-line">
              {queue.data?.data.map((request) => (
                <li key={request.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-ink">{request.patientName}</p>
                      <StatusTag
                        presentation={PRIORITY[request.priority]}
                        pulse={request.priority === "CRITICAL"}
                      />
                    </div>
                    <p className="mt-1 truncate text-xs text-ink-subtle">
                      {request.pickupLocation} · {request.contact} ·{" "}
                      <Timestamp value={request.createdAt} />
                    </p>
                  </div>
                  <Link
                    href="/dispatch"
                    className={buttonClass("secondary", "sm", "shrink-0")}
                    aria-label={`Dispatch an ambulance for ${request.patientName}`}
                  >
                    Dispatch
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="lg:col-span-2">
          <PanelHeader title="Trips in progress" actions={<ViewAll href="/trips">View all</ViewAll>} />
          {trips.isLoading ? (
            <LoadingState />
          ) : trips.isError ? (
            <ErrorState
              message={(trips.error as Error).message}
              onRetry={() => trips.refetch()}
            />
          ) : activeTrips.length === 0 ? (
            <EmptyState
              title="Nothing on the road"
              description="Dispatch a crew and active trips will appear here."
              icon={<Route className="h-5 w-5" aria-hidden="true" />}
            />
          ) : (
            <ul className="divide-y divide-line">
              {activeTrips.map((trip) => (
                <li key={trip.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/trips/${trip.id}`}
                      className="truncate text-sm font-medium text-ink transition-colors hover:text-brand-700"
                    >
                      {trip.ambulance?.vehicleNumber ?? "Crew assigned"}
                    </Link>
                    <p className="mt-0.5 truncate text-xs text-ink-subtle">
                      {trip.request?.pickupLocation ?? "—"}
                      {trip.driver?.name ? ` · ${trip.driver.name}` : ""}
                    </p>
                  </div>
                  <StatusTag presentation={TRIP_STATUS[trip.status]} pulse />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Admin                                                                      */
/* -------------------------------------------------------------------------- */

function AdminOverview() {
  const stats = useQuery({ queryKey: ["admin", "stats"], queryFn: () => administrationService.stats() });

  if (stats.isLoading) {
    return (
      <>
        <PageHeader eyebrow="Administration" title="System overview" />
        <Panel>
          <LoadingState label="Loading statistics…" />
        </Panel>
      </>
    );
  }

  if (stats.isError) {
    return (
      <>
        <PageHeader eyebrow="Administration" title="System overview" />
        <Panel>
          <ErrorState
            message={(stats.error as Error).message}
            onRetry={() => stats.refetch()}
          />
        </Panel>
      </>
    );
  }

  const data = stats.data;
  if (!data) return null;

  const requestTotal = data.priorityBreakdown.reduce((sum, entry) => sum + entry._count._all, 0);

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="System overview"
        description="Live figures across users, fleet and operations."
      />

      <MetricGrid columns={4} className="mb-6">
        <StatCard
          label="Total users"
          value={data.users.totalUsers}
          hint={`${data.users.totalPatients} patients · ${data.users.totalDispatchers} dispatchers`}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          label="Ambulances available"
          value={`${data.fleet.availableAmbulances}/${data.fleet.totalAmbulances}`}
          hint={`${data.fleet.availableDrivers}/${data.fleet.totalDrivers} drivers free`}
          icon={<Ambulance className="h-4 w-4" />}
        />
        <StatCard
          label="Pending requests"
          value={data.operations.pendingRequests}
          tone={data.operations.pendingRequests > 0 ? "warning" : "neutral"}
          icon={<Siren className="h-4 w-4" />}
        />
        <StatCard
          label="Active trips"
          value={data.operations.activeTrips}
          icon={<Route className="h-4 w-4" />}
        />
      </MetricGrid>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader
            title="Priority breakdown"
            description="Requests by urgency."
            actions={
              <span className="text-xs tabular-nums text-ink-subtle">
                {requestTotal} {requestTotal === 1 ? "request" : "requests"}
              </span>
            }
          />
          {requestTotal === 0 ? (
            <EmptyState
              title="No requests recorded"
              description="Priority mix appears once requests come in."
              icon={<Siren className="h-5 w-5" aria-hidden="true" />}
            />
          ) : (
            <ul className="space-y-4 p-5">
              {PRIORITY_ORDER.map((priority) => {
                const count =
                  data.priorityBreakdown.find((entry) => entry.priority === priority)?._count._all ??
                  0;
                const share = requestTotal === 0 ? 0 : Math.round((count / requestTotal) * 100);

                return (
                  <li key={priority}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <StatusTag presentation={PRIORITY[priority]} />
                      <p className="text-[13px] tabular-nums text-ink-muted">
                        {count}{" "}
                        <span className="text-ink-subtle">
                          · {share}% of requests
                        </span>
                      </p>
                    </div>
                    <ProgressBar value={share} tone={PRIORITY[priority].tone} />
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Revenue" />
            <div className="px-5 py-4">
              <p className="text-2xl font-semibold tracking-tight tabular-nums text-ink">
                {formatCurrency(data.revenue)}
              </p>
              <p className="mt-1 text-xs text-ink-muted">Collected from completed payments</p>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Operations" />
            <dl className="divide-y divide-line">
              <KeyValue
                label="Requests"
                value={data.operations.totalRequests}
                icon={<Siren className="h-4 w-4 text-ink-subtle" aria-hidden="true" />}
              />
              <KeyValue
                label="Trips"
                value={data.operations.totalTrips}
                icon={<Route className="h-4 w-4 text-ink-subtle" aria-hidden="true" />}
              />
              <KeyValue
                label="Completed"
                value={data.operations.completedTrips}
                icon={<Ambulance className="h-4 w-4 text-ink-subtle" aria-hidden="true" />}
              />
              <KeyValue
                label="Hospitals"
                value={data.fleet.totalHospitals}
                icon={<Building2 className="h-4 w-4 text-ink-subtle" aria-hidden="true" />}
              />
            </dl>
          </Panel>
        </div>
      </div>
    </>
  );
}