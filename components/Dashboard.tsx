
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Car, 
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Driver, SettlementRecord } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardProps {
  stats: any;
  drivers: Driver[];
  settlements: SettlementRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, drivers, settlements }) => {
  const chartData = [
    { name: 'Mon', income: 4000 },
    { name: 'Tue', income: 3000 },
    { name: 'Wed', income: 5000 },
    { name: 'Thu', income: 2780 },
    { name: 'Fri', income: 1890 },
    { name: 'Sat', income: 6390 },
    { name: 'Sun', income: 4490 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Fleet Overview</h2>
          <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Export CSV</button>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg">New Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Drivers" 
          value={stats.totalDrivers} 
          icon={<Users className="text-blue-600" />} 
          trend="+12%" 
          positive={true} 
        />
        <StatCard 
          label="Active Cars" 
          value={stats.activeDrivers} 
          icon={<Car className="text-green-600" />} 
          trend="+5%" 
          positive={true} 
        />
        <StatCard 
          label="Weekly Earnings" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          icon={<DollarSign className="text-amber-600" />} 
          trend="-2.4%" 
          positive={false} 
        />
        <StatCard 
          label="Pending Fines" 
          value="₹4,200" 
          icon={<AlertTriangle className="text-red-600" />} 
          trend="+₹800" 
          positive={false} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Income Trends</h3>
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-1 px-2">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="income" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Settlements</h3>
          <div className="space-y-6">
            {settlements.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                    {drivers.find(d => d.id === s.driverId)?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{drivers.find(d => d.id === s.driverId)?.name}</p>
                    <p className="text-xs text-slate-500">{s.weekEnding}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">₹{s.netPayable.toLocaleString()}</p>
                  <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">View all settlements</button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{label: string; value: string | number; icon: React.ReactNode; trend: string; positive: boolean}> = ({ label, value, icon, trend, positive }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      <div className={`flex items-center gap-1 text-xs font-bold ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium">{label}</p>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

export default Dashboard;
