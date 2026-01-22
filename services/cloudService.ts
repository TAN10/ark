
import { Driver, Vehicle, SettlementRecord, DriverStatus, RentalModel } from '../types';

/**
 * DB INTERFACES FOR TYPE SAFETY
 */
interface DBDriver {
  id: string;
  driver_id: string;
  name: string;
  phone: string;
  dob: string;
  license_number: string;
  aadhar_number: string;
  pan_number: string;
  address: string;
  city: string;
  state: string;
  village: string;
  status: string;
  onboarded_at: string;
  assigned_vehicle_reg: string | null;
  payment_model: string | null;
}

interface DBVehicle {
  id: string;
  reg_no: string;
  make: string;
  model: string;
  status: string;
  odometer_reading: number;
  chasis_number: string;
  purchase_date: string;
  registration_date: string;
  insurance_company: string;
  insurance_start_date: string;
  insurance_end_date: string;
  puc_expiry_date: string;
  fasttag_details: string;
  last_odometer_update: string;
}

interface DBSettlement {
  id: string;
  driver_id: string;
  veh_reg_number: string;
  week_ending: string;
  ola_uber_earnings: number;
  commission_deducted: number;
  fast_tag_charge: number;
  rto_fine: number;
  private_toll_charges: number;
  net_payable: number;
  status: string;
}

const API_URL = process.env.SUPABASE_URL || '';
const ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
  'Prefer': 'return=representation'
});

const mapDriverFromDB = (d: DBDriver): Driver => ({
  id: d.id,
  driverId: d.driver_id,
  name: d.name,
  phone: d.phone,
  dob: d.dob,
  licenseNumber: d.license_number,
  aadharNumber: d.aadhar_number,
  panNumber: d.pan_number,
  permanentAddress: d.address || '',
  city: d.city,
  state: d.state,
  villageName: d.village || '',
  status: d.status as DriverStatus,
  onboardedAt: d.onboarded_at,
  assignedVehicleReg: d.assigned_vehicle_reg || undefined,
  paymentModel: (d.payment_model as RentalModel) || undefined
});

const mapVehicleFromDB = (v: DBVehicle): Vehicle => ({
  id: v.id,
  regNo: v.reg_no,
  make: v.make,
  model: v.model,
  status: v.status as any,
  odometerReading: v.odometer_reading || 0,
  insuranceEndDate: v.insurance_end_date,
  pucExpiryDate: v.puc_expiry_date,
  registrationDate: v.registration_date || '',
  chasisNumber: v.chasis_number || '',
  purchaseDate: v.purchase_date || '',
  insuranceStartDate: v.insurance_start_date || '',
  insuranceCompany: v.insurance_company || '',
  fastTagDetails: v.fasttag_details || '',
  odometerReadingDate: v.last_odometer_update || '',
  maintenanceHistory: [],
  maintenanceCost: 0,
  rentalExpenses: { fastTag: 0, rtoFines: 0, accident: 0 }
});

const mapSettlementFromDB = (s: DBSettlement): SettlementRecord => ({
  id: s.id,
  driverId: s.driver_id,
  // Fixed: Map 'veh_reg_number' to 'vehRegNumber' to match SettlementRecord interface definition in types.ts
  vehRegNumber: s.veh_reg_number,
  weekEnding: s.week_ending,
  // Fixed: Map 'ola_uber_earnings' to 'olaUberEarnings' to match SettlementRecord interface
  olaUberEarnings: Number(s.ola_uber_earnings || 0),
  // Fixed: Map 'commission_deducted' to 'commissionDeducted' to match SettlementRecord interface
  commissionDeducted: Number(s.commission_deducted || 0),
  // Fixed: Map 'fast_tag_charge' to 'fastTagCharge' to match SettlementRecord interface
  fastTagCharge: Number(s.fast_tag_charge || 0),
  // Fixed: Map 'rto_fine' to 'rtoFine' to match SettlementRecord interface
  rtoFine: Number(s.rto_fine || 0),
  // Fixed: Map 'private_toll_charges' to 'privateTollCharges' to match SettlementRecord interface
  privateTollCharges: Number(s.private_toll_charges || 0),
  anyOtherCharges: 0,
  netPayable: Number(s.net_payable || 0),
  status: s.status as 'PENDING' | 'SETTLED'
});

export const cloudService = {
  fetchDrivers: async (defaults: Driver[]): Promise<Driver[]> => {
    try {
      if (!API_URL) return defaults;
      const res = await fetch(`${API_URL}/rest/v1/drivers?select=*&order=onboarded_at.desc`, { headers: getHeaders() });
      if (!res.ok) return defaults;
      const data: DBDriver[] = await res.json();
      return data.map(mapDriverFromDB);
    } catch (e) {
      return defaults;
    }
  },

  fetchVehicles: async (defaults: Vehicle[]): Promise<Vehicle[]> => {
    try {
      if (!API_URL) return defaults;
      const res = await fetch(`${API_URL}/rest/v1/vehicles?select=*`, { headers: getHeaders() });
      if (!res.ok) return defaults;
      const data: DBVehicle[] = await res.json();
      return data.map(mapVehicleFromDB);
    } catch (e) {
      return defaults;
    }
  },

  fetchSettlements: async (): Promise<SettlementRecord[]> => {
    try {
      if (!API_URL) return [];
      const res = await fetch(`${API_URL}/rest/v1/settlements?select=*&order=week_ending.desc`, { headers: getHeaders() });
      if (!res.ok) return [];
      const data: DBSettlement[] = await res.json();
      return data.map(mapSettlementFromDB);
    } catch (e) {
      return [];
    }
  },

  saveDriver: async (driver: Driver): Promise<Response> => {
    const dbPayload = {
      driver_id: driver.driverId,
      name: driver.name,
      phone: driver.phone,
      dob: driver.dob,
      license_number: driver.licenseNumber,
      aadhar_number: driver.aadharNumber,
      pan_number: driver.panNumber,
      address: driver.permanentAddress,
      city: driver.city,
      state: driver.state,
      village: driver.villageName,
      status: driver.status,
      assigned_vehicle_reg: driver.assignedVehicleReg || null,
      payment_model: driver.paymentModel || null
    };
    return fetch(`${API_URL}/rest/v1/drivers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dbPayload)
    });
  }
};
