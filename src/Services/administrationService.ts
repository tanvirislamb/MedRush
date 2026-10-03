import { api } from "./httpClient";
import type { Paged } from "@/Types/api";
import type {
  AuditLog,
  DashboardStats,
  Role,
  TripStatus,
  TripWithContext,
  User,
  UserStatus,
} from "@/Types/domain";

export interface UserListParams {
  page?: number;
  limit?: number;
  role?: Role;
  status?: UserStatus;
  /** Matches name or email server-side. */
  search?: string;
}

export interface AuditListParams {
  page?: number;
  limit?: number;
  entity?: string;
  action?: string;
}

export const administrationService = {
  listUsers: (params: UserListParams = {}) => api.get<Paged<User>>("/admin/users", params),

  setUserStatus: (id: string, status: UserStatus) =>
    api.patch<User>(`/admin/users/${id}/status`, { status }),

  setUserRole: (id: string, role: Role) => api.patch<User>(`/admin/users/${id}/role`, { role }),

  stats: () => api.get<DashboardStats>("/admin/dashboard-stats"),

  auditLogs: (params: AuditListParams = {}) =>
    api.get<Paged<AuditLog>>("/admin/audit-logs", params),

  listTrips: (params: { page?: number; limit?: number; status?: TripStatus } = {}) =>
    api.get<Paged<TripWithContext>>("/admin/trips", params),
};
