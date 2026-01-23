
import React, { useState } from 'react';
import { 
  Database, ShieldCheck, Monitor, Zap,
  Copy, CheckCircle, Terminal,
  Server, Globe, Key, ArrowRight, ExternalLink,
  Layers, Package, Code
} from 'lucide-react';

interface SettingsViewProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
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

const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, toggleTheme }) => {
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
          
          {/* STEP BY STEP GUIDE */}
          <section className="bg-white dark:bg-slate-950 p-12 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl space-y-12">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                <Layers size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white tracking-tight">Deployment Guide</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Connect ArkFlow to Vercel Postgres</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <StepItem 
                num="01" 
                title="Create Database" 
                desc="Go to Vercel Dashboard > Storage > Create > Postgres. Name it 'arkflow-db'." 
              />
              <StepItem 
                num="02" 
                title="Connect Project" 
                desc="Select this project in the Vercel Storage settings and click 'Connect'." 
              />
              <StepItem 
                num="03" 
                title="Inject Secrets" 
                desc="Vercel will automatically add POSTGRES_URL to your environment variables." 
              />
              <StepItem 
                num="04" 
                title="Init Schema" 
                desc="Copy the SQL below and run it in the Vercel Postgres 'Query' tab." 
              />
            </div>
          </section>

          {/* SQL EDITOR */}
          <section className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Terminal size={24} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight">Database Schema</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Vercel Postgres (Neon) Migration</p>
                </div>
              </div>
              <button 
                onClick={handleCopy}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-cyan-600'}`}
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy SQL'}
              </button>
            </div>

            <div className="bg-black/50 rounded-3xl p-8 border border-white/5 max-h-[400px] overflow-y-auto scrollbar-hide">
              <pre className="text-[11px] font-mono text-cyan-400 leading-relaxed whitespace-pre-wrap">
                {VERCEL_POSTGRES_SQL}
              </pre>
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-950 p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Connection Status</h3>
             <div className="space-y-6">
                <StatusItem label="Edge Runtime" value="Active" active />
                <StatusItem label="Vercel Postgres" value={process.env.POSTGRES_URL ? 'Connected' : 'Local Only'} active={!!process.env.POSTGRES_URL} />
                <StatusItem label="SSL Encryption" value="TLS 1.3" active />
             </div>
          </div>

          <div className="bg-indigo-600 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Package size={100} />
             </div>
             <div className="relative z-10">
               <h4 className="text-lg font-black italic uppercase tracking-tighter mb-4">Storage Node</h4>
               <p className="text-[10px] font-bold text-indigo-100 leading-relaxed uppercase opacity-80 mb-6">
                  ArkFlow is currently configured for Vercel Storage. All data is persisted on the Neon database engine with automatic backups.
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

const StepItem = ({ num, title, desc }: { num: string, title: string, desc: string }) => (
  <div className="p-6 bg-slate-50 dark:bg-white/[0.02] rounded-3xl border border-slate-100 dark:border-white/5 group hover:border-cyan-500/30 transition-all">
    <div className="flex items-center gap-3 mb-3">
      <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-500 font-mono">{num}</span>
      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{title}</h4>
    </div>
    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase leading-relaxed tracking-tight">{desc}</p>
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
