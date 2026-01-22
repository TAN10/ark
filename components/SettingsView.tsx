
import React, { useState } from 'react';
import { 
  Database, ShieldCheck, Trash2, 
  RotateCcw, RefreshCw, Monitor, Zap,
  ExternalLink, Copy, CheckCircle, Terminal,
  Server, Globe, Key
} from 'lucide-react';

interface SettingsViewProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const SUPABASE_SQL = `-- ARKFLOW SUPABASE MIGRATION V3
-- Copy and run this in the Supabase SQL Editor

-- 1. DROP EXISTING TABLES
DROP TABLE IF EXISTS settlements;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS vehicles;

-- 2. CREATE VEHICLES
CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reg_no text UNIQUE NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  status text DEFAULT 'IDLE',
  odometer_reading integer DEFAULT 0,
  chasis_number text,
  purchase_date date,
  registration_date date,
  insurance_company text,
  insurance_start_date date,
  insurance_end_date date,
  puc_expiry_date date,
  fasttag_details text,
  last_odometer_update date,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. CREATE DRIVERS
CREATE TABLE drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text UNIQUE NOT NULL,
  dob date,
  license_number text UNIQUE NOT NULL,
  aadhar_number text UNIQUE NOT NULL,
  pan_number text UNIQUE NOT NULL,
  permanent_address text,
  city text,
  state text,
  village_name text,
  status text DEFAULT 'ACTIVE',
  onboarded_at timestamp with time zone DEFAULT now(),
  assigned_vehicle_reg text,
  payment_model text
);

-- 4. CREATE SETTLEMENTS
CREATE TABLE settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid REFERENCES drivers(id) ON DELETE CASCADE,
  veh_reg_number text,
  week_ending date NOT NULL,
  ola_uber_earnings numeric DEFAULT 0,
  commission_deducted numeric DEFAULT 0,
  fast_tag_charge numeric DEFAULT 0,
  rto_fine numeric DEFAULT 0,
  private_toll_charges numeric DEFAULT 0,
  net_payable numeric DEFAULT 0,
  status text DEFAULT 'PENDING',
  created_at timestamp with time zone DEFAULT now()
);

-- 5. ENABLE ACCESS
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow All" ON drivers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All" ON settlements FOR ALL USING (true) WITH CHECK (true);
`;

const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, toggleTheme }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Infrastructure</h2>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Professional Deployment Configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          
          <section className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/10">
            <div className="absolute top-0 right-0 p-8">
              <Globe className="text-cyan-500 opacity-20" size={120} />
            </div>
            
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white text-slate-900 rounded-2xl">
                  <Server size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tight">Vercel Pipeline</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Production Environment Variables</p>
                </div>
              </div>

              <div className="space-y-4">
                <EnvRow name="SUPABASE_URL" description="Endpoint URL from Supabase Project API Settings" />
                <EnvRow name="SUPABASE_ANON_KEY" description="Anon Public API Key for client access" />
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-950 p-12 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl space-y-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-600 rounded-2xl text-white">
                  <Terminal size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white tracking-tight">Database Migration</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Execute V3 Schema in SQL Editor</p>
                </div>
              </div>
              <button 
                onClick={handleCopy}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-cyan-600 hover:text-white'}`}
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy SQL'}
              </button>
            </div>

            <div className="bg-slate-950 rounded-3xl p-8 border border-white/5 max-h-[400px] overflow-y-auto scrollbar-hide ring-1 ring-inset ring-white/10 shadow-inner">
              <pre className="text-[11px] font-mono text-cyan-400 leading-relaxed whitespace-pre-wrap">
                {SUPABASE_SQL}
              </pre>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-950 p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">System Connectivity</h3>
             <div className="space-y-6">
                <StatusItem label="Supabase URL" value={process.env.SUPABASE_URL ? 'Linked' : 'Missing'} active={!!process.env.SUPABASE_URL} />
                <StatusItem label="Anon API Key" value={process.env.SUPABASE_ANON_KEY ? 'Verified' : 'Missing'} active={!!process.env.SUPABASE_ANON_KEY} />
             </div>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="w-full py-6 bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-lg flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white hover:border-cyan-500 transition-all"
          >
            {isDarkMode ? <Monitor size={18} /> : <Zap size={18} />}
            Toggle {isDarkMode ? 'Light' : 'Dark'} UI
          </button>
        </div>
      </div>
    </div>
  );
};

const EnvRow = ({ name, description }: { name: string, description: string }) => (
  <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all group">
    <div className="flex justify-between items-center mb-1">
      <span className="text-[11px] font-black text-cyan-400 font-mono tracking-tight">{name}</span>
      <span className="text-[8px] font-black text-slate-500 uppercase">Var</span>
    </div>
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{description}</p>
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
