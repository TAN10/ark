
import React, { useState } from 'react';
import { 
  Database, Globe, Copy, CheckCircle, 
  ExternalLink, MousePointer2, List, Code2, AlertTriangle,
  ArrowRight, Layout, Monitor, Sun, Moon, Link as LinkIcon,
  Search, Eye, Check, MousePointer, Keyboard, XCircle, Info
} from 'lucide-react';

interface SettingsViewProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const SCHEMA_SQL = `-- ARKFLOW MASTER SCHEMA
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'OPERATOR',
    status VARCHAR(10) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reg_no VARCHAR(20) UNIQUE NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'IDLE',
    odometer_reading INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'ONBOARDING',
    assigned_vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    week_ending DATE NOT NULL,
    gross_earnings NUMERIC(12, 2) DEFAULT 0,
    net_payable NUMERIC(12, 2) DEFAULT 0,
    status VARCHAR(10) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, toggleTheme }) => {
  const [copied, setCopied] = useState(false);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Troubleshooting</h2>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Bypassing the "Already Connected" Error</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* THE ERROR FIX PANEL */}
          <section className="bg-white dark:bg-slate-950 p-12 rounded-[3rem] border-4 border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
               <div className="bg-rose-500 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-lg">Error Resolution</div>
            </div>

            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-xl">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white tracking-tight leading-none">The connection is already active!</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Vercel says "Already Connected" because you've done it correctly before.</p>
                </div>
              </div>

              {/* ACTION STEPS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 space-y-4">
                    <div className="flex items-center gap-2">
                       <XCircle size={16} className="text-rose-500" />
                       <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white">Step 1</span>
                    </div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                       Click <span className="text-rose-500 font-black italic">"Cancel"</span> on the pop-up. You don't need to configure it again.
                    </p>
                 </div>
                 <div className="p-8 bg-emerald-500/5 rounded-[2.5rem] border-2 border-dashed border-emerald-500/30 space-y-4">
                    <div className="flex items-center gap-2">
                       <Check size={16} className="text-emerald-500" />
                       <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white">Step 2</span>
                    </div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                       Go back to the main <span className="text-emerald-500 font-black italic">Storage</span> tab and click on your database name.
                    </p>
                 </div>
              </div>

              {/* VISUAL NAVIGATION GUIDE */}
              <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-white/10">
                 <div className="flex items-center gap-3 mb-6">
                    <Info size={16} className="text-cyan-400" />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Where the Query tab is hiding:</p>
                 </div>
                 <div className="flex flex-wrap justify-center gap-6 opacity-80">
                    <div className="px-4 py-2 bg-white/5 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">Browse</div>
                    <div className="px-8 py-2 bg-cyan-600 rounded-lg text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-cyan-600/30 ring-2 ring-white/20">Query</div>
                    <div className="px-4 py-2 bg-white/5 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">Logs</div>
                    <div className="px-4 py-2 bg-white/5 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">Settings</div>
                 </div>
                 <p className="text-[9px] font-bold text-slate-500 uppercase text-center mt-6">This menu appears only AFTER you click the database name in the main list.</p>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1 italic">When you find the tab, paste this SQL:</p>
                <button 
                  onClick={handleCopySchema}
                  className={`w-full py-7 transition-all text-sm font-black uppercase tracking-[0.3em] rounded-3xl shadow-2xl flex items-center justify-center gap-4 ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-cyan-600 hover:text-white'}`}
                >
                  {copied ? (
                    <>
                      <CheckCircle size={24} /> READY FOR QUERY TAB
                    </>
                  ) : (
                    <>
                      <Copy size={24} /> Copy Master SQL Schema
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Theme Section */}
          <section className="bg-white dark:bg-slate-950 p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl text-indigo-600">
                <Monitor size={20} />
              </div>
              <h3 className="text-lg font-black italic uppercase text-slate-900 dark:text-white tracking-tight">System Appearance</h3>
            </div>
            <button 
              onClick={toggleTheme}
              className="px-8 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:border-cyan-500 transition-all"
            >
              Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 dark:bg-slate-950 p-10 rounded-[3rem] border border-slate-800 dark:border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3 relative z-10 italic">
              <Database size={18} className="text-rose-500" /> Conflict Detected
            </h3>
            <div className="space-y-6 relative z-10">
              <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reason</p>
                <p className="text-xs font-black text-white mt-2 leading-relaxed uppercase">The project "ark" is already linked to "neon-teal-car".</p>
              </div>
              <div className="p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verification</p>
                <p className="text-[10px] font-bold text-white mt-2 uppercase">Connection is verified as ACTIVE in your account.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
