import { api } from "./httpClient";
import type { CallerTicketListParams, DispatcherTicketListParams, Paged } from "@/Types/api";
import type {
  EmergencyRequest,
  EmergencyRequestWithCaller,
  Priority,
  Trip,
  TripWithContext,
} from "@/Types/domain";

export interface NewEmergencyRequest {
  patientName: string;
  contact: string;
  pickupLocation: string;
  priority?: Priority;
  note?: string;
}

/** A request plus the trip it spawned, as returned by the caller's own list. */
export interface CallerTicket extends EmergencyRequest {
  trip: Trip | null;
}

export const emergencyRequestService = {
  create: (body: NewEmergencyRequest) =>
    api.post<EmergencyRequestWithCaller>("/requests", body),

  /** Caller's own requests. The backend applies the ownership filter. */
  listMine: (params: CallerTicketListParams) =>
    api.get<Paged<CallerTicket>>("/requests/my", params),

  /** Dispatcher queue across every caller. */
  search: (params: DispatcherTicketListParams) =>
    api.get<Paged<EmergencyRequestWithCaller & { trip: Trip | null }>>("/requests/search", params),

  detail: (id: string) =>
    api.get<EmergencyRequestWithCaller & { trip: TripWithContext | null }>(`/requests/${id}`),

  cancel: (id: string) => api.patch<EmergencyRequest>(`/requests/${id}/cancel`),
};
