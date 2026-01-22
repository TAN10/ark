
import React from 'react';
import { 
  Users, 
  Car, 
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Clock,
  Activity,
  History
} from 'lucide-react';
import { Driver, SettlementRecord } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  stats: {
    totalDrivers?: number;
    activeDrivers?: number;
    totalRevenue?: number;
    totalExpenses?: number;
    activeFleetCount?: number;
  };
  drivers: Driver[];
  settlements: SettlementRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, drivers, settlements }) => {
  const formatCurrency = (val: number | undefined) => `₹${(val || 0).toLocaleString()}`;
  const formatCount = (val: number | undefined) => (val || 0).toString();

  const chartData = [
    { name: '05/12', income: 42000 },
    { name: '05/13', income: 38500 },
    { name: '05/14', income: 55200 },
    { name: '05/15', income: 49000 },
    { name: '05/16', income: 62800 },
    { name: '05/17', income: 78000 },
    { name: '05/18', income: 64500 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Control Center</h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1.5">Fleet intelligence & financial metrics</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200 dark:border-white/5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Real-time processing active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Fleet Drivers" 
          value={formatCount(stats.totalDrivers)} 
          icon={<Users size={20} />} 
          trend="+12% vs last month" 
          positive={true} 
          color="text-cyan-600 dark:text-cyan-500"
        />
        <StatCard 
          label="Operational Units" 
          value={formatCount(stats.activeFleetCount)} 
          icon={<Car size={20} />} 
          trend="85% Utilization" 
          positive={true} 
          color="text-emerald-600 dark:text-emerald-500"
        />
        <StatCard 
          label="Gross Revenue" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={<DollarSign size={20} />} 
          trend="Target: ₹1.2M" 
          positive={true} 
          color="text-amber-600 dark:text-amber-500"
        />
        <StatCard 
          label="Active Liabilities" 
          value={formatCurrency(stats.totalExpenses)} 
          icon={<AlertTriangle size={20} />} 
          trend="Includes Fines" 
          positive={false} 
          color="text-rose-600 dark:text-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-950/80 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-cyan-600/10 rounded-xl text-cyan-600 dark:text-cyan-500 border border-cyan-500/10">
                  <Zap size={20} />
               </div>
               <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Yield Analytics</h3>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-slate-50 dark:bg-slate-900 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest rounded-lg border border-slate-200 dark:border-white/5 hover:text-slate-900 dark:hover:text-white transition-all">Daily</button>
              <button className="px-4 py-1.5 bg-cyan-600/10 dark:bg-cyan-600/20 text-[9px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest rounded-lg border border-cyan-500/10 shadow-lg shadow-cyan-500/5">Weekly</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'currentColor', borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                  itemStyle={{fontWeight: 900, color: '#06b6d4', textTransform: 'uppercase', fontSize: '10px'}}
                  labelStyle={{color: '#94a3b8', fontSize: '10px', marginBottom: '4px'}}
                />
                <Area type="monotone" dataKey="income" stroke="#0891b2" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950/80 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-2xl flex flex-col">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3 uppercase italic">
            <History size={20} className="text-cyan-600 dark:text-cyan-500" />
            Settlements
          </h3>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-hide">
            {settlements.length > 0 ? settlements.map((s, idx) => {
              const driver = drivers.find(d => d.id === s.driverId);
              return (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-black text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 border border-slate-200 dark:border-white/5 transition-colors shadow-sm">
                      {driver?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{driver?.name}</p>
                      <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-widest">{s.weekEnding}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-cyan-600 dark:text-cyan-500">₹{s.netPayable.toLocaleString()}</p>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest ${s.status === 'SETTLED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : 'bg-amber-500/10 text-amber-600 dark:text-amber-500'}`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              );
            }) : (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-12 text-center">
                <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-400 dark:text-slate-700">
                  <Activity size={32} />
                </div>
                <p className="text-slate-500 dark:text-slate-600 text-[9px] font-black uppercase tracking-[0.2em]">Queue empty</p>
              </div>
            )}
          </div>
          <button className="w-full mt-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-cyan-600 transition-all text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl">
            Export Master Log
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{label: string; value: string | number; icon: React.ReactNode; trend: string; positive: boolean; color: string}> = ({ label, value, icon, trend, positive, color }) => (
  <div className="bg-white dark:bg-slate-950/80 p-6 rounded-3xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all group overflow-hidden relative shadow-sm dark:shadow-none">
    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 dark:bg-white/[0.02] rounded-full -mr-12 -mt-12 group-hover:bg-cyan-500/5 transition-colors"></div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-white/5 ${color} group-hover:shadow-sm transition-all`}>{icon}</div>
        <div className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-widest ${positive ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'} bg-slate-100 dark:bg-black/40 px-2 py-0.5 rounded shadow-sm dark:shadow-none`}>
          {positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {trend}
        </div>
      </div>
      <p className="text-slate-500 dark:text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">{label}</p>
      <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tighter uppercase italic">{value}</p>
    </div>
  </div>
);

export default Dashboard;
