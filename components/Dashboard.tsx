
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
  Activity
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
  // Safe formatting to prevent crashes
  const formatCurrency = (val: number | undefined) => `₹${(val || 0).toLocaleString()}`;
  const formatCount = (val: number | undefined) => (val || 0).toString();

  const chartData = [
    { name: 'Mon', income: 4200 },
    { name: 'Tue', income: 3800 },
    { name: 'Wed', income: 5500 },
    { name: 'Thu', income: 4900 },
    { name: 'Fri', income: 6200 },
    { name: 'Sat', income: 7800 },
    { name: 'Sun', income: 6400 },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">OPERATIONAL DASHBOARD</h2>
          <p className="text-slate-500 font-medium mt-1">Enterprise-level fleet tracking and settlement intelligence.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest shadow-sm text-slate-400">
            <Clock size={14} className="text-indigo-500" />
            Live Sync: ACTIVE
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Fleet Drivers" 
          value={formatCount(stats.totalDrivers)} 
          icon={<Users className="text-indigo-600" />} 
          trend="Master Master List" 
          positive={true} 
        />
        <StatCard 
          label="Operational Cars" 
          value={formatCount(stats.activeFleetCount)} 
          icon={<Car className="text-emerald-600" />} 
          trend="Fleet Active" 
          positive={true} 
        />
        <StatCard 
          label="Settled Revenue" 
          value={formatCurrency(stats.totalRevenue)} 
          icon={<DollarSign className="text-amber-600" />} 
          trend="Current Cycle" 
          positive={true} 
        />
        <StatCard 
          label="Operational Expenses" 
          value={formatCurrency(stats.totalExpenses)} 
          icon={<AlertTriangle className="text-rose-600" />} 
          trend="Includes Fines" 
          positive={false} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Income Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600">
                  <Zap size={20} />
               </div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight italic">REVENUE ANALYTICS</h3>
            </div>
            <select className="bg-slate-100 border-none text-[10px] font-black uppercase rounded-xl p-2.5 px-5 focus:ring-2 focus:ring-indigo-500/20">
              <option>Cycle: 7D Period</option>
              <option>Cycle: 30D Period</option>
            </select>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px'}}
                  itemStyle={{fontWeight: 900, color: '#4338ca'}}
                />
                <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Side Column */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 italic">
            <Clock size={20} className="text-indigo-400" />
            CYCLE SETTLEMENTS
          </h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide">
            {settlements.length > 0 ? settlements.map((s, idx) => {
              const driver = drivers.find(d => d.id === s.driverId);
              return (
                <div key={idx} className="flex items-center justify-between group p-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-black text-lg shadow-sm">
                      {driver?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{driver?.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.weekEnding}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-indigo-600">₹{s.netPayable.toLocaleString()}</p>
                    <span className="text-[8px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg uppercase font-black tracking-widest border border-emerald-100">
                      {s.status}
                    </span>
                  </div>
                </div>
              );
            }) : (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-20 text-center">
                <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                  {/* Fixed: Added Activity to lucide-react imports */}
                  <Activity size={40} />
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No Active Ledger Entries</p>
              </div>
            )}
          </div>
          <button className="w-full mt-8 py-4 text-[10px] bg-slate-950 text-white hover:bg-indigo-600 font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg">
            Download Global Audit
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{label: string; value: string | number; icon: React.ReactNode; trend: string; positive: boolean}> = ({ label, value, icon, trend, positive }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 hover:shadow-indigo-500/10 transition-all group overflow-hidden relative border-b-4 border-b-transparent hover:border-b-indigo-500">
    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50 transition-colors"></div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3.5 bg-slate-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">{icon}</div>
        <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${positive ? 'text-emerald-600' : 'text-rose-600'} bg-slate-50 px-2.5 py-1 rounded-lg`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-slate-950 mt-1 tracking-tighter italic">{value}</p>
    </div>
  </div>
);

export default Dashboard;
