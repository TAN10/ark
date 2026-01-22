
import React from 'react';
import { Settings, Shield, Bell, Database, HelpCircle, Monitor, Sun, Moon, ToggleLeft, ToggleRight, Check } from 'lucide-react';

interface SettingsViewProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">System Configuration</h2>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1.5">Manage platform behavior and security parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Appearance Section */}
          <section className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Monitor size={20} />
              </div>
              <h3 className="text-lg font-black italic uppercase text-slate-900 dark:text-white tracking-tight">Interface & Theme</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5">
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Dynamic Dark Mode</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Switch between High-Contrast and Alpine Light mode</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 hover:border-cyan-500/30 transition-all shadow-sm"
                >
                  {isDarkMode ? (
                    <>
                      <Moon size={14} className="text-cyan-500" />
                      <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Dark Active</span>
                    </>
                  ) : (
                    <>
                      <Sun size={14} className="text-amber-500" />
                      <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Light Active</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Language</p>
                  <select className="mt-2 w-full bg-transparent border-none text-xs font-black uppercase text-slate-900 dark:text-white focus:ring-0">
                    <option>English (Global)</option>
                    <option>Hindi (IN)</option>
                  </select>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Currency Format</p>
                  <select className="mt-2 w-full bg-transparent border-none text-xs font-black uppercase text-slate-900 dark:text-white focus:ring-0">
                    <option>INR (₹) - Locale</option>
                    <option>USD ($) - Int</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Shield size={20} />
              </div>
              <h3 className="text-lg font-black italic uppercase text-slate-900 dark:text-white tracking-tight">Security & Auth</h3>
            </div>

            <div className="space-y-4">
              <ToggleRow label="Two-Factor Authentication" description="Require secure code for sensitive operations" active={true} />
              <ToggleRow label="Automatic Session Lock" description="Lock session after 30 minutes of inactivity" active={false} />
              <ToggleRow label="IP Restriction" description="Allow access only from authorized network nodes" active={false} />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-slate-950 p-8 rounded-3xl border border-slate-800 dark:border-white/5 shadow-2xl">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <Database size={16} className="text-cyan-500" /> System State
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Master Ledger Sync</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-black text-emerald-500">SYNCHRONIZED</span>
                  <span className="text-[9px] font-black text-slate-600 uppercase">2m ago</span>
                </div>
              </div>
              <button className="w-full py-4 bg-white text-black hover:bg-cyan-500 transition-all text-[10px] font-black uppercase tracking-[0.2em] rounded-xl">
                Download Global Backup
              </button>
              <button className="w-full py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] rounded-xl">
                Wipe Local Cache
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle size={18} className="text-indigo-500" />
              <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Node Information</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Core Version</span>
                <span className="text-slate-900 dark:text-slate-300">v3.2.0-STABLE</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Cluster Node</span>
                <span className="text-slate-900 dark:text-slate-300">IN-MUM-01</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Uptime</span>
                <span className="text-slate-900 dark:text-slate-300">14d 06h 22m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToggleRow = ({ label, description, active }: { label: string, description: string, active: boolean }) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/[0.01] rounded-2xl transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/5">
    <div>
      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{label}</p>
      <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{description}</p>
    </div>
    <button className={`p-1 rounded-full transition-all ${active ? 'text-cyan-500' : 'text-slate-300 dark:text-slate-700'}`}>
      {active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
    </button>
  </div>
);

export default SettingsView;
