import { api } from "./httpClient";
import type { Paged } from "@/Types/api";
import type { Availability, DriverWithAccount, User } from "@/Types/domain";

export interface NewDriverProfile {
  /** A userId must be promoted to a driver profile first. */
  userId: string;
  name: string;
  phone: string;
  licenseNo: string;
  availability?: Availability;
}

export type DriverChanges = Partial<Omit<NewDriverProfile, "userId">>;

export interface CrewListParams {
  page?: number;
  limit?: number;
  availability?: Availability;
  /** Matches name, phone or licenseNo server-side. */
  search?: string;
}

export const crewService = {
  list: (params: CrewListParams = {}) =>
    api.get<Paged<DriverWithAccount>>("/drivers", params),

  create: (body: NewDriverProfile) => api.post<DriverWithAccount>("/drivers", body),

  update: (id: string, body: DriverChanges) =>
    api.patch<DriverWithAccount>(`/drivers/${id}`, body),

  setAvailability: (id: string, availability: Availability) =>
    api.patch<DriverWithAccount>(`/drivers/${id}/availability`, { availability }),

  /**
   * User accounts that can still be linked to a driver profile (no existing
   * driver). Open to dispatchers too, unlike /admin/users.
   */
  eligibleUsers: (params: { page?: number; limit?: number; search?: string } = {}) =>
    api.get<Paged<User>>("/drivers/eligible-users", params),
};
