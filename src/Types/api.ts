/** Every backend response is wrapped in this envelope. */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated endpoints nest their payload twice: the envelope's `data` holds
 * `{ meta, data }`. This alias keeps that shape from leaking into components.
 */
export interface Paged<T> {
  meta: PaginationMeta;
  data: T[];
}

export interface ListParams {
  page?: number;
  limit?: number;
}

export interface DispatcherTicketListParams extends ListParams {
  status?: string;
  search?: string;
}

export interface CallerTicketListParams extends ListParams {
  status?: string;
  priority?: string;
}
