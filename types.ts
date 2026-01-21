
export enum RentalModel {
  DAILY = 'DAILY',
  COMMISSION = 'COMMISSION'
}

export enum DriverStatus {
  ONBOARDING = 'ONBOARDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Vehicle {
  id: string;
  regNo: string;
  model: string;
  year: number;
  maintenanceCost: number;
  rentalExpenses: {
    fastTag: number;
    rtoFines: number;
    accident: number;
  };
  assignedDriverId?: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'IDLE';
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  carRegNo: string; // Linked to Vehicle regNo
  vehicleId?: string;
  rentalModel: RentalModel;
  status: DriverStatus;
  bankDetails: string;
  documents: string[];
  onboardedAt: string;
}

export interface SettlementRecord {
  id: string;
  driverId: string;
  weekEnding: string;
  olaUberEarnings: number;
  fastTagCharges: number;
  rtoFines: number;
  tollTax: number;
  commissionDeducted: number;
  netPayable: number;
  status: 'PENDING' | 'SETTLED';
}

export interface User {
  id: string;
  name: string;
  role: string;
  isAuthenticated: boolean;
}
