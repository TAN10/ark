
export enum RentalModel {
  DAILY = 'DAILY',
  COMMISSION = 'COMMISSION'
}

export enum DriverStatus {
  ONBOARDING = 'ONBOARDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export type UserRole = 'ADMIN' | 'OPERATOR' | 'OWNER';

export interface User {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  emailAddress: string;
  dateOfBirth?: string;
  role: UserRole;
  isAuthenticated: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdOn: string;
  createdBy: string;
}

export interface MaintenanceRecord {
  id: string;
  vehRegNumber: string;
  serviceType: 'Engine Repair' | 'Exterior Maintenance' | 'Tire Change';
  serviceExpense: number;
  serviceDate: string;
  odometerReading: number;
  createdOn: string;
  createdBy: string;
}

export interface Vehicle {
  id: string;
  regNo: string;
  registrationDate: string;
  chasisNumber: string;
  make: string;
  model: string;
  purchaseDate: string;
  insuranceStartDate: string;
  insuranceEndDate: string;
  insuranceCompany: string;
  pucExpiryDate: string;
  fastTagDetails: string;
  status: 'ACTIVE' | 'IDLE' | 'MAINTENANCE';
  odometerReading: number;
  odometerReadingDate: string;
  maintenanceHistory: MaintenanceRecord[];
  maintenanceCost: number;
  rentalExpenses: {
    fastTag: number;
    rtoFines: number;
    accident: number;
  };
}

export interface Driver {
  id: string;
  driverId: string;
  name: string;
  phone: string;
  dob: string;
  licenseNumber: string;
  aadharNumber: string;
  panNumber: string;
  permanentAddress: string;
  state: string;
  city: string;
  villageName: string;
  status: DriverStatus;
  onboardedAt: string;
  assignedVehicleReg?: string;
  paymentModel?: RentalModel;
}

export interface SettlementRecord {
  id: string;
  driverId: string;
  vehRegNumber: string;
  weekEnding: string;
  olaUberEarnings: number;
  commissionDeducted: number;
  fastTagCharge: number;
  rtoFine: number;
  privateTollCharges: number;
  anyOtherCharges: number;
  netPayable: number;
  status: 'PENDING' | 'SETTLED';
}
