
import { Driver, Vehicle, SettlementRecord } from '../types';

const STORAGE_KEYS = {
  DRIVERS: 'arkflow_drivers',
  VEHICLES: 'arkflow_vehicles',
  SETTLEMENTS: 'arkflow_settlements'
};

export const arkStore = {
  // --- Drivers ---
  saveDrivers: (drivers: Driver[]) => {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
  },
  loadDrivers: (defaults: Driver[]): Driver[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.DRIVERS);
    return saved ? JSON.parse(saved) : defaults;
  },

  // --- Vehicles ---
  saveVehicles: (vehicles: Vehicle[]) => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  },
  loadVehicles: (defaults: Vehicle[]): Vehicle[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return saved ? JSON.parse(saved) : defaults;
  },

  // --- Settlements ---
  saveSettlements: (settlements: SettlementRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.SETTLEMENTS, JSON.stringify(settlements));
  },
  loadSettlements: (defaults: SettlementRecord[]): SettlementRecord[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTLEMENTS);
    return saved ? JSON.parse(saved) : defaults;
  },

  // --- Global Wipe (for resetting) ---
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    window.location.reload();
  }
};
