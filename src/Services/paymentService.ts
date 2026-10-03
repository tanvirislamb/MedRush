import { api } from "./httpClient";
import type { Payment, PaymentMethod, TripWithContext } from "@/Types/domain";

interface CheckoutSession {
  payment: Payment;
  sessionId: string;
  sessionUrl: string;
}

export const paymentService = {
  /** NOTE: returned unpaginated by the backend, unlike most list endpoints. */
  list: () => api.get<Array<Payment & { trip: TripWithContext }>>("/payments"),

  detail: (id: string) =>
    api.get<Payment & { trip: TripWithContext }>(`/payments/${id}`),

  /** Stripe only - BKASH is accepted by the schema but rejected at runtime. */
  initiateCheckout: (tripId: string, method: PaymentMethod = "STRIPE") =>
    api.post<CheckoutSession>("/payments/initiate", { tripId, method }),
};
