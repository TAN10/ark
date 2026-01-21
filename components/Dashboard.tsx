
import React from 'react';
import { 
  Users, 
  Car, 
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Clock
} from 'lucide-react';
import { Driver, SettlementRecord } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  stats: any;
  drivers: Driver[];
  // Fix: changed 'settlements[]' to 'SettlementRecord[]' to match the imported type from types.ts
  settlements: SettlementRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, drivers, settlements }) => {
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
          <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">CRMS DASHBOARD</h2>
          <p className="text-slate-500 font-medium mt-1">Real-time ArkFlow fleet intelligence and settlement analytics.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold shadow-sm">
            <Clock size={14} className="text-amber-500" />
            Last Sync: Just Now
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Fleet Drivers" 
          value={stats.totalDrivers} 
          icon={<Users className="text-indigo-600" />} 
          trend="+4 new" 
          positive={true} 
        />
        <StatCard 
          label="Operational Cars" 
          value={stats.activeDrivers} 
          icon={<Car className="text-emerald-600" />} 
          trend="92% Utilized" 
          positive={true} 
        />
        <StatCard 
          label="Settled Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          icon={<DollarSign className="text-amber-600" />} 
          trend="+₹12.4k" 
          positive={true} 
        />
        <StatCard 
          label="Fines & Accidents" 
          value={`₹${stats.totalExpenses.toLocaleString()}`} 
          icon={<AlertTriangle className="text-rose-600" />} 
          trend="+₹800" 
          positive={false} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Income Chart (Document Requirement: Revenue Details) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                  <Zap size={20} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 tracking-tight">Revenue Performance</h3>
            </div>
            <select className="bg-slate-100 border-none text-[10px] font-black uppercase rounded-xl p-2 px-4 focus:ring-2 focus:ring-amber-500/20">
              <option>Current Week</option>
              <option>Previous Week</option>
            </select>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px'}}
                  itemStyle={{fontWeight: 800}}
                />
                <Area type="monotone" dataKey="income" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Side Column */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50">
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Clock size={20} className="text-slate-400" />
            Recent Settlements
          </h3>
          <div className="space-y-8">
            {settlements.length > 0 ? settlements.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-bold group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                    {drivers.find(d => d.id === s.driverId)?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">{drivers.find(d => d.id === s.driverId)?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.weekEnding}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">₹{s.netPayable.toLocaleString()}</p>
                  <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-lg uppercase font-black tracking-tighter">
                    {s.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 text-slate-400 font-medium italic">No recent activities found.</div>
            )}
          </div>
          <button className="w-full mt-10 py-4 text-xs bg-slate-50 text-slate-500 hover:text-slate-900 font-bold uppercase tracking-widest rounded-2xl border border-slate-200 transition-all">
            Full Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{label: string; value: string | number; icon: React.ReactNode; trend: string; positive: boolean}> = ({ label, value, icon, trend, positive }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-amber-500/5 transition-all group overflow-hidden relative">
    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-amber-50 transition-colors"></div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-amber-500 group-hover:text-white transition-all">{icon}</div>
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {positive ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
          {trend}
        </div>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-slate-950 mt-2 tracking-tighter">{value}</p>
    </div>
  </div>
);

export default Dashboard;
