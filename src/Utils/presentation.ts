import type {
  Availability,
  PaymentStatus,
  Priority,
  RequestStatus,
  Role,
  TripStatus,
  UserStatus,
} from "@/Types/domain";

/** Flat tone names consumed by the StatusTag component. */
export type Tone =
  | "critical"
  | "warning"
  | "info"
  | "success"
  | "neutral"
  | "brand";

export interface StatusPresentation {
  label: string;
  tone: Tone;
}

export const ROLE_LABEL: Record<Role, string> = {
  PATIENT: "Patient",
  DISPATCHER: "Dispatcher",
  ADMIN: "Administrator",
};

export const USER_STATUS: Record<UserStatus, StatusPresentation> = {
  ACTIVE: { label: "Active", tone: "success" },
  SUSPENDED: { label: "Suspended", tone: "critical" },
};

export const PRIORITY: Record<Priority, StatusPresentation> = {
  CRITICAL: { label: "Critical", tone: "critical" },
  HIGH: { label: "High", tone: "warning" },
  MEDIUM: { label: "Medium", tone: "info" },
  LOW: { label: "Low", tone: "neutral" },
};

export const PRIORITY_ORDER: Priority[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export const REQUEST_STATUS: Record<RequestStatus, StatusPresentation> = {
  PENDING: { label: "Awaiting crew", tone: "warning" },
  DISPATCHED: { label: "Crew assigned", tone: "info" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

export const AVAILABILITY: Record<Availability, StatusPresentation> = {
  AVAILABLE: { label: "Available", tone: "success" },
  BUSY: { label: "On call", tone: "warning" },
  OFFLINE: { label: "Offline", tone: "neutral" },
};

export const TRIP_STATUS: Record<TripStatus, StatusPresentation> = {
  DISPATCHED: { label: "Dispatched", tone: "info" },
  EN_ROUTE: { label: "En route", tone: "info" },
  AT_PICKUP: { label: "At pickup", tone: "warning" },
  TRANSPORTING: { label: "Transporting", tone: "warning" },
  ARRIVED: { label: "Arrived at hospital", tone: "info" },
  COMPLETED: { label: "Completed", tone: "success" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
};

/** Ordered for progress indicators - matches the backend state machine. */
export const TRIP_SEQUENCE: TripStatus[] = [
  "DISPATCHED",
  "EN_ROUTE",
  "AT_PICKUP",
  "TRANSPORTING",
  "ARRIVED",
  "COMPLETED",
];

export const PAYMENT_STATUS: Record<PaymentStatus, StatusPresentation> = {
  PENDING: { label: "Awaiting payment", tone: "warning" },
  COMPLETED: { label: "Paid", tone: "success" },
  FAILED: { label: "Failed", tone: "critical" },
};

/** Turns TRIP_STATUS_EN_ROUTE into "En route" for the audit trail. */
export function humaniseAuditAction(action: string): string {
  const trimmed = action.replace(/^(TRIP_STATUS|USER_STATUS)_/, "");
  const spaced = trimmed.replace(/_/g, " ").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
