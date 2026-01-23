
import { Driver, Vehicle, SettlementRecord, DriverStatus, RentalModel } from '../types';

/**
 * VERCEL POSTGRES API ADAPTER
 * Communicates with Vercel Serverless Functions (/api/*)
 */

const API_ENDPOINT = '/api/data';

export const cloudService = {
  fetchDrivers: async (defaults: Driver[]): Promise<Driver[]> => {
    try {
      const res = await fetch(`${API_ENDPOINT}?type=drivers`);
      if (!res.ok) throw new Error('API Offline');
      return await res.json();
    } catch (e) {
      const saved = localStorage.getItem('ark_drivers');
      return saved ? JSON.parse(saved) : defaults;
    }
  },

  fetchVehicles: async (defaults: Vehicle[]): Promise<Vehicle[]> => {
    try {
      const res = await fetch(`${API_ENDPOINT}?type=vehicles`);
      if (!res.ok) throw new Error('API Offline');
      return await res.json();
    } catch (e) {
      const saved = localStorage.getItem('ark_vehicles');
      return saved ? JSON.parse(saved) : defaults;
    }
  },

  fetchSettlements: async (): Promise<SettlementRecord[]> => {
    try {
      const res = await fetch(`${API_ENDPOINT}?type=settlements`);
      if (!res.ok) throw new Error('API Offline');
      return await res.json();
    } catch (e) {
      const saved = localStorage.getItem('ark_settlements');
      return saved ? JSON.parse(saved) : [];
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
      const drivers = JSON.parse(localStorage.getItem('ark_drivers') || '[]');
      localStorage.setItem('ark_drivers', JSON.stringify([driver, ...drivers]));
    }
  }
};
