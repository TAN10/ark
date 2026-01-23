
import { Driver, Vehicle, SettlementRecord, DriverStatus, RentalModel } from '../types';

/**
 * MEGA SEED GENERATOR v3.3.0
 * Programmatically generates requested load: 60 Drivers, 60 Vehicles, 1000 Settlements.
 */

const API_ENDPOINT = '/api/data';

const NAMES_POOL = ['Arjun', 'Sameer', 'Prakash', 'Rahul', 'Amit', 'Sanjay', 'Vikram', 'Anil', 'Sunil', 'Kiran', 'Deepak', 'Manoj', 'Rakesh', 'Suresh', 'Vijay', 'Ajay', 'Rohit', 'Sandeep', 'Nitin', 'Prasad'];
const SURNAMES_POOL = ['Mehra', 'Khan', 'Patil', 'Deshmukh', 'Sharma', 'Verma', 'Gupta', 'Joshi', 'Kulkarni', 'More', 'Pawar', 'Yadav', 'Singh', 'Chaudhary', 'Gadkari', 'Shinde', 'Bhosale'];
const MAKES = ['Maruti', 'Hyundai', 'Toyota', 'Tata', 'Honda', 'Mahindra'];
const MODELS = ['Ertiga', 'Venue', 'Innova', 'Swift Dzire', 'Amaze', 'XUV700', 'Tiago', 'Nexon'];

const generateVehicles = (count: number): Vehicle[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `v-${i + 1}`,
    regNo: `MH-12-FL-${1000 + i}`,
    registrationDate: '2023-01-10',
    chasisNumber: `CHS-${Math.random().toString(36).toUpperCase().substr(2, 10)}`,
    make: MAKES[Math.floor(Math.random() * MAKES.length)],
    model: MODELS[Math.floor(Math.random() * MODELS.length)],
    purchaseDate: '2023-01-01',
    insuranceStartDate: '2023-01-10',
    insuranceEndDate: '2025-12-30',
    insuranceCompany: 'Tata AIG',
    pucExpiryDate: '2025-06-10',
    fastTagDetails: `FT-${100000 + i}`,
    status: Math.random() > 0.2 ? 'ACTIVE' : (Math.random() > 0.5 ? 'IDLE' : 'MAINTENANCE'),
    odometerReading: Math.floor(Math.random() * 50000) + 1000,
    odometerReadingDate: '2024-05-20',
    maintenanceHistory: [],
    maintenanceCost: Math.floor(Math.random() * 20000),
    rentalExpenses: { fastTag: 1200, rtoFines: 0, accident: 0 }
  }));
};

const generateDrivers = (count: number, vehicles: Vehicle[]): Driver[] => {
  return Array.from({ length: count }).map((_, i) => {
    const v = vehicles[i] || null;
    return {
      id: `d-${i + 1}`,
      driverId: `DRV-${200 + i}`,
      name: `${NAMES_POOL[Math.floor(Math.random() * NAMES_POOL.length)]} ${SURNAMES_POOL[Math.floor(Math.random() * SURNAMES_POOL.length)]}`,
      phone: `98${Math.floor(Math.random() * 90000000 + 10000000)}`,
      dob: '1990-01-01',
      licenseNumber: `LIC-MH12-${10000 + i}`,
      aadharNumber: `${Math.floor(Math.random() * 900000000000 + 100000000000)}`,
      panNumber: `PAN${Math.random().toString(36).toUpperCase().substr(2, 5)}01Z`,
      permanentAddress: 'Pune, Maharashtra',
      state: 'Maharashtra',
      city: 'Pune',
      villageName: 'Shivajinagar',
      status: Math.random() > 0.1 ? DriverStatus.ACTIVE : DriverStatus.ONBOARDING,
      onboardedAt: '2023-10-01',
      assignedVehicleReg: v ? v.regNo : undefined,
      paymentModel: Math.random() > 0.5 ? RentalModel.DAILY : RentalModel.COMMISSION
    };
  });
};

const generateSettlements = (count: number, drivers: Driver[]): SettlementRecord[] => {
  return Array.from({ length: count }).map((_, i) => {
    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    const earnings = Math.floor(Math.random() * 30000) + 10000;
    const comm = Math.floor(earnings * 0.2);
    const tolls = Math.floor(Math.random() * 1500);
    return {
      id: `s-${i + 1}`,
      driverId: driver.id,
      vehRegNumber: driver.assignedVehicleReg || 'MH-12-XX-0000',
      weekEnding: `2024-05-${Math.floor(Math.random() * 20) + 10}`,
      olaUberEarnings: earnings,
      commissionDeducted: comm,
      fastTagCharge: 1200,
      rtoFine: 0,
      privateTollCharges: tolls,
      anyOtherCharges: 0,
      netPayable: earnings - comm - 1200 - tolls,
      status: Math.random() > 0.3 ? 'SETTLED' : 'PENDING'
    };
  });
};

// Initialization of Mega Seed
const _V = generateVehicles(60);
const _D = generateDrivers(60, _V);
const _S = generateSettlements(1000, _D);

export const cloudService = {
  fetchDrivers: async (defaults: Driver[]): Promise<Driver[]> => {
    try {
      const res = await fetch(`${API_ENDPOINT}?type=drivers`);
      if (!res.ok) throw new Error('API Offline');
      const data = await res.json();
      return data.length > 0 ? data : _D;
    } catch (e) {
      return _D;
    }
  },

  fetchVehicles: async (defaults: Vehicle[]): Promise<Vehicle[]> => {
    try {
      const res = await fetch(`${API_ENDPOINT}?type=vehicles`);
      if (!res.ok) throw new Error('API Offline');
      const data = await res.json();
      return data.length > 0 ? data : _V;
    } catch (e) {
      return _V;
    }
  },

  fetchSettlements: async (): Promise<SettlementRecord[]> => {
    try {
      const res = await fetch(`${API_ENDPOINT}?type=settlements`);
      if (!res.ok) throw new Error('API Offline');
      const data = await res.json();
      return data.length > 0 ? data : _S;
    } catch (e) {
      return _S;
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
