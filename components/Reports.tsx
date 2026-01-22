
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Driver, SettlementRecord, Vehicle } from '../types';
import { Download, FileSpreadsheet, Calendar, Filter, ArrowUpRight, TrendingDown, Sparkles, Loader2 } from 'lucide-react';
import { suggestBillingOptimizations } from '../services/geminiService';

interface ReportsProps {
  drivers: Driver[];
  settlements: SettlementRecord[];
  vehicles: Vehicle[];
}

const Reports: React.FC<ReportsProps> = ({ drivers, settlements, vehicles }) => {
  const [reportType, setReportType] = useState<'revenue' | 'utilization' | 'settlement'>('revenue');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const driverBillingData = drivers.map(d => {
    const billing = settlements.filter(s => s.driverId === d.id);
    const revenue = billing.reduce((acc, s) => acc + s.olaUberEarnings, 0);
    return { name: d.name.split(' ')[0], earnings: revenue };
  });

  const getAiInsights = async () => {
    setLoadingAi(true);
    try {
      const insight = await suggestBillingOptimizations(settlements.slice(0, 5));
      setAiInsight(insight || "System busy. Try again later.");
    } catch (e) {
      setAiInsight("Unable to connect to Gemini node.");
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    getAiInsights();
  }, []);

  const COLORS = ['#0891b2', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-10 pb-16">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-cyan-600 font-black text-[10px] uppercase tracking-widest mb-1">Business Intelligence</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase">KPI Analytical Reports</h2>
        </div>
        <div className="flex gap-4">
           <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-white/5">
             <button onClick={() => setReportType('revenue')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportType === 'revenue' ? 'bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white' : 'text-slate-500'}`}>Revenue</button>
             <button onClick={() => setReportType('utilization')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportType === 'utilization' ? 'bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white' : 'text-slate-500'}`}>Utilization</button>
           </div>
           <button className="bg-slate-900 dark:bg-white text-white dark:text-black font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-cyan-600 dark:hover:bg-cyan-500 hover:text-white transition-all text-[10px] uppercase tracking-widest shadow-xl">
            <Download size={18} /> Export Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white dark:bg-slate-950/80 p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black italic tracking-tight text-slate-900 dark:text-white uppercase">Financial Yield Profile</h3>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 text-[10px] font-black uppercase">
                  <ArrowUpRight size={14} /> +12% Efficiency
                </div>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={driverBillingData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                    <Tooltip 
                       contentStyle={{backgroundColor: 'currentColor', borderRadius: '16px', border: 'none', padding: '12px'}}
                       itemStyle={{fontWeight: 900, color: '#06b6d4', fontSize: '10px'}}
                    />
                    <Bar dataKey="earnings" fill="#0891b2" radius={[12, 12, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* AI Insights Section */}
           <div className="bg-gradient-to-br from-slate-900 to-black p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
             <div className="relative z-10">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-cyan-600 rounded-2xl text-white shadow-xl shadow-cyan-600/20">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="text-lg font-black italic text-white uppercase tracking-tighter">Gemini Fleet Optimizer</h3>
                  </div>
                  <button 
                    onClick={getAiInsights}
                    disabled={loadingAi}
                    className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2"
                  >
                    {loadingAi ? <Loader2 size={12} className="animate-spin" /> : "Re-Sync Intelligence"}
                  </button>
               </div>
               
               {loadingAi ? (
                 <div className="space-y-4 py-4">
                   <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse"></div>
                   <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse"></div>
                   <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse"></div>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {aiInsight?.split('\n').filter(line => line.trim()).map((point, i) => (
                      <div key={i} className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all">
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-tight leading-relaxed">
                          {point.replace(/^[•*-]\s*/, '')}
                        </p>
                      </div>
                    ))}
                 </div>
               )}
             </div>
           </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-950 rounded-[3rem] p-10 border border-slate-200 dark:border-white/5 shadow-xl">
             <h3 className="text-lg font-black italic mb-8 text-slate-900 dark:text-white uppercase">Asset Utilization</h3>
             <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={[
                        { name: 'Active', value: vehicles.filter(v => v.status === 'ACTIVE').length },
                        { name: 'Idle', value: vehicles.filter(v => v.status === 'IDLE').length },
                        { name: 'Maint.', value: vehicles.filter(v => v.status === 'MAINTENANCE').length }
                      ]} 
                      dataKey="value" 
                      innerRadius={65} 
                      outerRadius={85} 
                      paddingAngle={8}
                    >
                      {COLORS.map((entry, index) => <Cell key={index} fill={entry} stroke="none" />)}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#020617', border: 'none', borderRadius: '12px'}} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="space-y-4 mt-8">
               <UtilizationLegend label="Active Operations" color="bg-cyan-600" count={vehicles.filter(v => v.status === 'ACTIVE').length} />
               <UtilizationLegend label="Standby Fleet" color="bg-emerald-500" count={vehicles.filter(v => v.status === 'IDLE').length} />
               <UtilizationLegend label="Under Audit" color="bg-amber-500" count={vehicles.filter(v => v.status === 'MAINTENANCE').length} />
             </div>
          </div>

          <div className="bg-white dark:bg-slate-950 p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Yield Volatility</h3>
               <TrendingDown className="text-rose-500" size={18} />
             </div>
             <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    {n: 'W1', v: 4000}, {n: 'W2', v: 3000}, {n: 'W3', v: 5500}, {n: 'W4', v: 4800}
                  ]}>
                    <Line type="monotone" dataKey="v" stroke="#0891b2" strokeWidth={3} dot={false} />
                    <Tooltip hide />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UtilizationLegend = ({ label, color, count }: { label: string, color: string, count: number }) => (
  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/5">
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-xs font-black text-slate-900 dark:text-white">{count} UNIT{count !== 1 ? 'S' : ''}</span>
  </div>
);

export default Reports;
