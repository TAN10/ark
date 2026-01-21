
export enum RentalModel {
  DAILY = 'DAILY',
  COMMISSION = 'COMMISSION'
}

export enum DriverStatus {
  ONBOARDING = 'ONBOARDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  carRegNo: string;
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

export interface AppState {
  drivers: Driver[];
  settlements: SettlementRecord[];
}
