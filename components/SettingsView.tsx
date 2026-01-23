
import React, { useState } from 'react';
import { 
  Database, ShieldCheck, Monitor, Zap,
  Copy, CheckCircle, Terminal,
  Server, Globe, Key, ArrowRight, ExternalLink,
  Layers, Package, Code, CheckCircle2, AlertCircle, Activity
} from 'lucide-react';

interface SettingsViewProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  tableStatus?: {
    drivers: boolean;
    vehicles: boolean;
    settlements: boolean;
  };
}

const VERCEL_POSTGRES_SQL = `-- ARKFLOW VERCEL POSTGRES SCHEMA
-- Copy and run this in the Vercel Dashboard 'Query' tab

-- 1. CLEANUP
DROP TABLE IF EXISTS settlements;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS vehicles;

-- 2. VEHICLES TABLE
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reg_no TEXT UNIQUE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT DEFAULT 'IDLE',
  odometer_reading INTEGER DEFAULT 0,
  insurance_end_date DATE,
  puc_expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. DRIVERS TABLE
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  aadhar_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'ACTIVE',
  assigned_vehicle_reg TEXT,
  onboarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. SETTLEMENTS TABLE
CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id),
  week_ending DATE NOT NULL,
  gross_earnings NUMERIC(12, 2) DEFAULT 0,
  net_payable NUMERIC(12, 2) DEFAULT 0,
  status TEXT DEFAULT 'PENDING'
);
`;

const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, toggleTheme, tableStatus }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(VERCEL_POSTGRES_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Vercel Infrastructure</h2>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Postgres Database & Edge Runtime</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {/* VISUAL HEALTH AUDIT */}
          <section className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl space-y-10 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Activity size={180} />
            </div>
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-white text-slate-900 rounded-2xl">
                  <Monitor size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight">System Health Audit</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time table integrity check</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <HealthTile label="Drivers Table" active={tableStatus?.drivers} />
                 <HealthTile label="Vehicles Table" active={tableStatus?.vehicles} />
                 <HealthTile label="Settlements Table" active={tableStatus?.settlements} />
              </div>

              <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse"></div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Data Feed: {process.env.POSTGRES_URL ? 'Cloud Streaming' : 'Simulated Preview Mode Active'}</p>
              </div>
            </div>
          </section>

          {/* SQL EDITOR */}
          <section className="bg-white dark:bg-slate-950 p-12 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl">
                  <Terminal size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black italic uppercase text-slate-900 dark:text-white tracking-tight">Database Schema</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Execute in Vercel Query Tab</p>
                </div>
              </div>
              <button 
                onClick={handleCopy}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-indigo-600 hover:text-white'}`}
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy SQL'}
              </button>
            </div>

            <div className="bg-slate-950 rounded-3xl p-8 border border-white/5 max-h-[400px] overflow-y-auto scrollbar-hide ring-1 ring-inset ring-white/10 shadow-inner">
              <pre className="text-[11px] font-mono text-cyan-400 leading-relaxed whitespace-pre-wrap">
                {VERCEL_POSTGRES_SQL}
              </pre>
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-950 p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Deployment Status</h3>
             <div className="space-y-6">
                <StatusItem label="Edge Runtime" value="V3 Stable" active />
                <StatusItem label="Vercel Postgres" value={process.env.POSTGRES_URL ? 'Connected' : 'Offline'} active={!!process.env.POSTGRES_URL} />
                <StatusItem label="SSL Engine" value="Active" active />
             </div>
          </div>

          <div className="bg-indigo-600 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Package size={100} />
             </div>
             <div className="relative z-10">
               <h4 className="text-lg font-black italic uppercase tracking-tighter mb-4">Storage Node</h4>
               <p className="text-[10px] font-bold text-indigo-100 leading-relaxed uppercase opacity-80 mb-6">
                  Verify your database tables via the health tiles. If markers are RED, please execute the Migration SQL.
               </p>
               <a href="https://vercel.com/docs/storage/vercel-postgres" target="_blank" className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-white text-indigo-600 px-4 py-2 rounded-lg">
                 Vercel Docs <ExternalLink size={12} />
               </a>
             </div>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="w-full py-6 bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-lg flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white hover:border-cyan-500 transition-all"
          >
            {isDarkMode ? <Monitor size={18} /> : <Zap size={18} />}
            Toggle UI Theme
          </button>
        </div>
      </div>
    </div>
  );
};

const HealthTile = ({ label, active }: { label: string, active?: boolean }) => (
  <div className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center justify-center gap-3 text-center ${active ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-rose-500/10 border-rose-500/20'}`}>
    <div className={`p-2 rounded-lg ${active ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
      {active ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest text-white/70">{label}</span>
    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${active ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
      {active ? 'OK' : 'ERR'}
    </span>
  </div>
);

const StatusItem = ({ label, value, active }: { label: string, value?: string, active?: boolean }) => (
  <div className="flex justify-between items-center">
    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`}></div>
      {value && <span className={`text-[10px] font-black uppercase tracking-tight ${active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{value}</span>}
    </div>
  </div>
);

export default SettingsView;
