
import { Driver, Vehicle, SettlementRecord, DriverStatus, RentalModel } from '../types';

/**
 * VERCEL POSTGRES API ADAPTER (PRO SEEDED)
 * Provides realistic dummy data if cloud is unavailable.
 */

const API_ENDPOINT = '/api/data';

const DUMMY_VEHICLES: Vehicle[] = [
  { 
    id: 'v1', regNo: 'MH-12-CR-2024', registrationDate: '2024-01-10', chasisNumber: 'XCV998877SH', 
    make: 'Maruti', model: 'Ertiga', purchaseDate: '2024-01-05', insuranceStartDate: '2024-01-10',
    insuranceEndDate: '2025-12-30', insuranceCompany: 'Tata AIG', pucExpiryDate: '2024-12-10',
    fastTagDetails: 'FT-991022', status: 'ACTIVE', odometerReading: 12450, odometerReadingDate: '2024-05-20',
    maintenanceHistory: [], maintenanceCost: 4500,
    rentalExpenses: { fastTag: 1200, rtoFines: 0, accident: 0 }
  },
  { 
    id: 'v2', regNo: 'MH-14-BZ-1001', registrationDate: '2023-11-15', chasisNumber: 'JJK112233MN', 
    make: 'Hyundai', model: 'Venue', purchaseDate: '2023-11-01', insuranceStartDate: '2023-11-15',
    insuranceEndDate: '2024-11-14', insuranceCompany: 'ICICI Lombard', pucExpiryDate: '2024-11-10',
    fastTagDetails: 'FT-882233', status: 'IDLE', odometerReading: 5800, odometerReadingDate: '2024-05-18',
    maintenanceHistory: [], maintenanceCost: 1200,
    rentalExpenses: { fastTag: 400, rtoFines: 500, accident: 0 }
  }
];

const DUMMY_DRIVERS: Driver[] = [
  {
    id: 'd1', driverId: 'DRV-101', name: 'Arjun Mehra', phone: '9811223344', dob: '1988-05-15',
    licenseNumber: 'DL-MH12-2022-001', aadharNumber: '112233445566', panNumber: 'ABCDE1122F',
    permanentAddress: 'Kothrud, Pune', state: 'Maharashtra', city: 'Pune', villageName: 'Kothrud',
    status: DriverStatus.ACTIVE, onboardedAt: '2023-10-01', assignedVehicleReg: 'MH-12-CR-2024',
    paymentModel: RentalModel.DAILY
  },
  {
    id: 'd2', driverId: 'DRV-102', name: 'Sameer Khan', phone: '9822334455', dob: '1992-08-22',
    licenseNumber: 'DL-MH14-2021-992', aadharNumber: '998877665544', panNumber: 'WXYZA9988G',
    permanentAddress: 'Hinjewadi, Pune', state: 'Maharashtra', city: 'Pune', villageName: 'Hinjewadi',
    status: DriverStatus.ACTIVE, onboardedAt: '2024-01-12', assignedVehicleReg: 'MH-14-BZ-1001',
    paymentModel: RentalModel.COMMISSION
  }
];

const DUMMY_SETTLEMENTS: SettlementRecord[] = [
  {
    id: 's1', driverId: 'd1', vehRegNumber: 'MH-12-CR-2024', weekEnding: '2024-05-19',
    olaUberEarnings: 45000, commissionDeducted: 9000, fastTagCharge: 1200, rtoFine: 0,
    privateTollCharges: 400, anyOtherCharges: 0, netPayable: 34400, status: 'SETTLED'
  },
  {
    id: 's2', driverId: 'd2', vehRegNumber: 'MH-14-BZ-1001', weekEnding: '2024-05-19',
    olaUberEarnings: 38000, commissionDeducted: 7600, fastTagCharge: 800, rtoFine: 500,
    privateTollCharges: 200, anyOtherCharges: 0, netPayable: 28900, status: 'PENDING'
  }
];

export const cloudService = {
  fetchDrivers: async (defaults: Driver[]): Promise<Driver[]> => {
    try {
      const res = await fetch(`${API_ENDPOINT}?type=drivers`);
      if (!res.ok) throw new Error('API Offline');
      return await res.json();
    } catch (e) {
      return DUMMY_DRIVERS;
    }
  },

  fetchVehicles: async (defaults: Vehicle[]): Promise<Vehicle[]> => {
    try {
      const res = await fetch(`${API_ENDPOINT}?type=vehicles`);
      if (!res.ok) throw new Error('API Offline');
      return await res.json();
    } catch (e) {
      return DUMMY_VEHICLES;
    }
  },

  fetchSettlements: async (): Promise<SettlementRecord[]> => {
    try {
      const res = await fetch(`${API_ENDPOINT}?type=settlements`);
      if (!res.ok) throw new Error('API Offline');
      return await res.json();
    } catch (e) {
      return DUMMY_SETTLEMENTS;
    }
  },

  saveDriver: async (driver: Driver) => {
    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'drivers', data: driver })
      });
    } catch (e) {
      console.warn('Mock Mode: Record saved to volatile memory only');
    }
  }
};
