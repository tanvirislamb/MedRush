import { api } from "./httpClient";
import type { ListParams, Paged } from "@/Types/api";
import type { Trip, TripStatus, TripWithContext } from "@/Types/domain";

export interface DispatchOrder {
  ambulanceId?: string;
  driverId?: string;
  distanceKm?: number;
  fare?: number;
}

/**
 * The backend's trip state machine. Only these transitions are accepted;
 * anything else comes back as `Cannot transition from X to Y`.
 */
export const TRIP_FLOW: Record<TripStatus, TripStatus[]> = {
  DISPATCHED: ["EN_ROUTE"],
  EN_ROUTE: ["AT_PICKUP", "CANCELLED"],
  AT_PICKUP: ["TRANSPORTING"],
  TRANSPORTING: ["ARRIVED"],
  ARRIVED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function nextTripStatuses(current: TripStatus): TripStatus[] {
  return TRIP_FLOW[current] ?? [];
}

export const tripService = {
  /** Send an ambulance. Omit both ids to let the backend auto-assign. */
  dispatch: (requestId: string, body: DispatchOrder = {}) =>
    api.post<Trip & { ambulance: unknown; driver: unknown; request: unknown }>(
      `/trips/${requestId}/dispatch`,
      body,
    ),

  /** Callers see their own trips; dispatchers and admins see all of them. */
  listForViewer: (params: ListParams & { status?: TripStatus }) =>
    api.get<Paged<TripWithContext>>("/trips/my", params),

  detail: (id: string) => api.get<TripWithContext>(`/trips/${id}`),

  setStatus: (id: string, status: TripStatus) =>
    api.patch<Trip>(`/trips/${id}/status`, { status }),

  /** Only valid once the trip is EN_ROUTE, AT_PICKUP or TRANSPORTING. */
  assignHospital: (id: string, hospitalId: string) =>
    api.patch<Trip>(`/trips/${id}/hospital`, { hospitalId }),
};
