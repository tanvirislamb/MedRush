import { api } from "./httpClient";
import type { Paged } from "@/Types/api";
import type { Hospital, HospitalWithUsage } from "@/Types/domain";

export interface NewHospital {
  name: string;
  address: string;
  contact: string;
  services?: string;
}

export type HospitalChanges = Partial<NewHospital>;

export interface HospitalListParams {
  page?: number;
  limit?: number;
  /** Matches name, address or services server-side. */
  search?: string;
}

export const hospitalService = {
  list: (params: HospitalListParams = {}) =>
    api.get<Paged<HospitalWithUsage>>("/hospitals", params),

  create: (body: NewHospital) => api.post<Hospital>("/hospitals", body),

  update: (id: string, body: HospitalChanges) =>
    api.patch<Hospital>(`/hospitals/${id}`, body),

  /** Soft delete. Trips already assigned keep their historical reference. */
  retire: (id: string) => api.delete<Hospital>(`/hospitals/${id}`),
};
