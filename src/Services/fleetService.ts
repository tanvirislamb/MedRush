import { api } from "./httpClient";
import type { Paged } from "@/Types/api";
import type { Ambulance, AmbulanceDetail, AmbulanceWithUsage, Availability } from "@/Types/domain";

export interface NewAmbulance {
  vehicleNumber: string;
  type: string;
  capacity: number;
  stationZone: string;
  availability?: Availability;
}

export type AmbulanceChanges = Partial<Omit<NewAmbulance, "vehicleNumber">>;

export interface FleetListParams {
  page?: number;
  limit?: number;
  availability?: Availability;
  stationZone?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const fleetService = {
  list: (params: FleetListParams = {}) =>
    api.get<Paged<AmbulanceWithUsage>>("/ambulances", params),

  detail: (id: string) => api.get<AmbulanceDetail>(`/ambulances/${id}`),

  create: (body: NewAmbulance) => api.post<Ambulance>("/ambulances", body),

  update: (id: string, body: AmbulanceChanges) =>
    api.patch<Ambulance>(`/ambulances/${id}`, body),

  setAvailability: (id: string, availability: Availability) =>
    api.patch<Ambulance>(`/ambulances/${id}/availability`, { availability }),

  /** Soft delete - the backend also flips availability to OFFLINE. */
  retire: (id: string) => api.delete<Ambulance>(`/ambulances/${id}`),
};
