export type Role = "PATIENT" | "DISPATCHER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RequestStatus = "PENDING" | "DISPATCHED" | "CANCELLED";
export type Availability = "AVAILABLE" | "BUSY" | "OFFLINE";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";
/** BKASH exists in the schema but the backend rejects it at runtime. */
export type PaymentMethod = "STRIPE" | "BKASH";

export type TripStatus =
  | "DISPATCHED"
  | "EN_ROUTE"
  | "AT_PICKUP"
  | "TRANSPORTING"
  | "ARRIVED"
  | "COMPLETED"
  | "CANCELLED";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: Role;
  status: UserStatus;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  type: string;
  capacity: number;
  stationZone: string;
  availability: Availability;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AmbulanceWithUsage extends Ambulance {
  _count: { trips: number };
}

export interface AmbulanceDetail extends Ambulance {
  trips: Trip[];
}

export interface Driver {
  id: string;
  userId: string;
  name: string;
  phone: string;
  licenseNo: string;
  availability: Availability;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DriverWithAccount extends Driver {
  user: User;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  contact: string;
  services: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HospitalWithUsage extends Hospital {
  _count: { trips: number };
}

export interface EmergencyRequest {
  id: string;
  patientId: string;
  priority: Priority;
  patientName: string;
  contact: string;
  pickupLocation: string;
  note: string | null;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyRequestWithCaller extends EmergencyRequest {
  patient: User;
}

export interface Trip {
  id: string;
  requestId: string;
  ambulanceId: string;
  driverId: string;
  hospitalId: string | null;
  patientId: string;
  status: TripStatus;
  distanceKm: number | null;
  fare: number | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  customerId: string;
  tripId: string;
  transactionId: string | null;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: Role;
  action: string;
  entity: string;
  entityId: string | null;
  meta: unknown;
  createdAt: string;
  user: User;
}

/**
 * Trip relations the console depends on. Each endpoint returns a different
 * subset, so the composed views are declared explicitly per screen.
 */
export interface TripWithContext extends Trip {
  request?: EmergencyRequest;
  ambulance?: Ambulance;
  driver?: Driver & { user?: User };
  hospital?: Hospital | null;
  payment?: Payment | null;
}

export interface DashboardStats {
  users: {
    totalUsers: number;
    totalPatients: number;
    totalDispatchers: number;
    totalAdmins: number;
  };
  fleet: {
    totalAmbulances: number;
    availableAmbulances: number;
    totalDrivers: number;
    availableDrivers: number;
    totalHospitals: number;
  };
  operations: {
    totalRequests: number;
    pendingRequests: number;
    totalTrips: number;
    activeTrips: number;
    completedTrips: number;
  };
  revenue: number;
  priorityBreakdown: Array<{
    priority: Priority;
    _count: { _all: number };
  }>;
}
