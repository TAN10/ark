
import { Driver, Vehicle, SettlementRecord } from '../types';

/**
 * PROFESSIONAL SUPABASE ADAPTER
 * Communicates directly with Supabase via the PostgREST API.
 */

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'apikey': process.env.SUPABASE_ANON_KEY || '',
  'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`,
  'Prefer': 'return=representation'
});

const API_URL = process.env.SUPABASE_URL || '';

export const cloudService = {
  // --- Drivers ---
  fetchDrivers: async (defaults: Driver[]): Promise<Driver[]> => {
    try {
      if (!API_URL) throw new Error('Missing SUPABASE_URL');
      const res = await fetch(`${API_URL}/rest/v1/drivers?select=*&order=onboarded_at.desc`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (e) {
      console.warn('Cloud Fetch Failed, using local cache:', e);
      const saved = localStorage.getItem('ark_cache_drivers');
      return saved ? JSON.parse(saved) : defaults;
    }
  },

  saveDriver: async (driver: Driver) => {
    try {
      const res = await fetch(`${API_URL}/rest/v1/drivers`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(driver)
      });
      return await res.json();
    } catch (e) {
      const drivers = JSON.parse(localStorage.getItem('ark_cache_drivers') || '[]');
      localStorage.setItem('ark_cache_drivers', JSON.stringify([driver, ...drivers]));
    }
  },

  updateDriver: async (id: string, updates: Partial<Driver>) => {
    return fetch(`${API_URL}/rest/v1/drivers?id=eq.${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
  },

  // --- Vehicles ---
  fetchVehicles: async (defaults: Vehicle[]): Promise<Vehicle[]> => {
    try {
      if (!API_URL) throw new Error('Missing SUPABASE_URL');
      const res = await fetch(`${API_URL}/rest/v1/vehicles?select=*`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (e) {
      const saved = localStorage.getItem('ark_cache_vehicles');
      return saved ? JSON.parse(saved) : defaults;
    }
  },

  saveVehicle: async (vehicle: Vehicle) => {
    try {
      await fetch(`${API_URL}/rest/v1/vehicles`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(vehicle)
      });
    } catch (e) {
      const list = JSON.parse(localStorage.getItem('ark_cache_vehicles') || '[]');
      localStorage.setItem('ark_cache_vehicles', JSON.stringify([vehicle, ...list]));
    }
  },

  // --- Settlements ---
  fetchSettlements: async (): Promise<SettlementRecord[]> => {
    try {
      if (!API_URL) throw new Error('Missing SUPABASE_URL');
      const res = await fetch(`${API_URL}/rest/v1/settlements?select=*&order=week_ending.desc`, {
        headers: getHeaders()
      });
      return await res.json();
    } catch (e) {
      const saved = localStorage.getItem('ark_cache_settlements');
      return saved ? JSON.parse(saved) : [];
    }
  },

  saveSettlement: async (record: SettlementRecord) => {
    try {
      await fetch(`${API_URL}/rest/v1/settlements`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(record)
      });
    } catch (e) {
      const list = JSON.parse(localStorage.getItem('ark_cache_settlements') || '[]');
      localStorage.setItem('ark_cache_settlements', JSON.stringify([record, ...list]));
    }
  }
};
