
import { Driver, Vehicle, SettlementRecord, DriverStatus, RentalModel } from '../types';

/**
 * PROFESSIONAL SUPABASE ADAPTER WITH DATA MAPPING
 * Translates between snake_case (Database) and camelCase (Application).
 */

const API_URL = process.env.SUPABASE_URL || '';
const ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`,
  'Prefer': 'return=representation'
});

// --- Mapping Helpers ---

const mapDriverFromDB = (d: any): Driver => ({
  id: d.id,
  driverId: d.driver_id,
  name: d.name,
  phone: d.phone,
  dob: d.dob,
  licenseNumber: d.license_number,
  aadharNumber: d.aadhar_number,
  panNumber: d.pan_number,
  permanentAddress: d.permanent_address,
  city: d.city,
  state: d.state,
  villageName: d.village_name || '',
  status: d.status as DriverStatus,
  onboardedAt: d.onboarded_at,
  assignedVehicleReg: d.assigned_vehicle_reg,
  paymentModel: d.payment_model as RentalModel
});

const mapVehicleFromDB = (v: any): Vehicle => ({
  id: v.id,
  regNo: v.reg_no,
  make: v.make,
  model: v.model,
  status: v.status,
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

const mapSettlementFromDB = (s: any): SettlementRecord => ({
  id: s.id,
  driverId: s.driver_id,
  vehRegNumber: s.veh_reg_number,
  weekEnding: s.week_ending,
  olaUberEarnings: Number(s.ola_uber_earnings || 0),
  commissionDeducted: Number(s.commission_deducted || 0),
  fastTagCharge: Number(s.fast_tag_charge || 0),
  rtoFine: Number(s.rto_fine || 0),
  privateTollCharges: Number(s.private_toll_charges || 0),
  anyOtherCharges: 0,
  netPayable: Number(s.net_payable || 0),
  status: s.status as 'PENDING' | 'SETTLED'
});

export const cloudService = {
  fetchDrivers: async (defaults: Driver[]): Promise<Driver[]> => {
    try {
      if (!API_URL) throw new Error('Missing SUPABASE_URL');
      const res = await fetch(`${API_URL}/rest/v1/drivers?select=*&order=onboarded_at.desc`, { headers: getHeaders() });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.map(mapDriverFromDB);
    } catch (e) {
      console.error('Fetch Drivers Error:', e);
      return defaults;
    }
  },

  fetchVehicles: async (defaults: Vehicle[]): Promise<Vehicle[]> => {
    try {
      if (!API_URL) throw new Error('Missing SUPABASE_URL');
      const res = await fetch(`${API_URL}/rest/v1/vehicles?select=*`, { headers: getHeaders() });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.map(mapVehicleFromDB);
    } catch (e) {
      console.error('Fetch Vehicles Error:', e);
      return defaults;
    }
  },

  fetchSettlements: async (): Promise<SettlementRecord[]> => {
    try {
      if (!API_URL) throw new Error('Missing SUPABASE_URL');
      const res = await fetch(`${API_URL}/rest/v1/settlements?select=*&order=week_ending.desc`, { headers: getHeaders() });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return data.map(mapSettlementFromDB);
    } catch (e) {
      console.error('Fetch Settlements Error:', e);
      return [];
    }
  },

  saveDriver: async (driver: Driver) => {
    const dbPayload = {
      driver_id: driver.driverId,
      name: driver.name,
      phone: driver.phone,
      dob: driver.dob,
      license_number: driver.licenseNumber,
      aadhar_number: driver.aadharNumber,
      pan_number: driver.panNumber,
      permanent_address: driver.permanentAddress,
      city: driver.city,
      state: driver.state,
      status: driver.status,
      assigned_vehicle_reg: driver.assignedVehicleReg,
      payment_model: driver.paymentModel
    };
    return fetch(`${API_URL}/rest/v1/drivers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dbPayload)
    });
  }
};
