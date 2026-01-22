
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Driver, SettlementRecord, Vehicle } from '../types';
import { Download, FileSpreadsheet, Calendar, Filter, ArrowUpRight, TrendingDown } from 'lucide-react';

interface ReportsProps {
  drivers: Driver[];
  settlements: SettlementRecord[];
  vehicles: Vehicle[];
}

const Reports: React.FC<ReportsProps> = ({ drivers, settlements, vehicles }) => {
  const [reportType, setReportType] = useState<'revenue' | 'utilization' | 'settlement'>('revenue');

  const driverBillingData = drivers.map(d => {
    const billing = settlements.filter(s => s.driverId === d.id);
    const revenue = billing.reduce((acc, s) => acc + s.olaUberEarnings, 0);
    return { name: d.name.split(' ')[0], earnings: revenue };
  });

  const maintenanceData = vehicles.map(v => ({
    name: v.regNo,
    cost: v.maintenanceCost
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-1">Business Intelligence</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">KPI Analytical Reports</h2>
        </div>
        <div className="flex gap-4">
           <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
             <button onClick={() => setReportType('revenue')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportType === 'revenue' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Revenue</button>
             <button onClick={() => setReportType('utilization')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportType === 'utilization' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Utilization</button>
             <button onClick={() => setReportType('settlement')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportType === 'settlement' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Settlements</button>
           </div>
           <button className="bg-slate-900 text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all text-[10px] uppercase tracking-widest">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black italic tracking-tight">Financial Performance (Driver Wise)</h3>
                <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase">
                  <ArrowUpRight size={14} /> +12% Efficiency
                </div>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={driverBillingData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <Tooltip 
                       contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                       itemStyle={{fontWeight: 800}}
                    />
                    <Bar dataKey="earnings" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-widest">Payment Settlement Summary</h3>
                <Calendar className="text-slate-300" size={18} />
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-100">
                    <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Reg</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Gross Rev</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Expenses</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {settlements.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="px-8 py-5 text-xs font-black text-slate-900">{s.vehRegNumber}</td>
                      <td className="px-8 py-5 text-xs font-bold text-slate-600">₹{s.olaUberEarnings.toLocaleString()}</td>
                      <td className="px-8 py-5 text-xs font-bold text-rose-500">₹{(s.commissionDeducted + s.fastTagCharge + s.rtoFine).toLocaleString()}</td>
                      <td className="px-8 py-5">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg">Reported</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl">
             <h3 className="text-lg font-black italic mb-8">Asset Utilization</h3>
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
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={5}
                    >
                      {COLORS.map((entry, index) => <Cell key={index} fill={entry} stroke="none" />)}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px'}} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="space-y-3 mt-8">
               <UtilizationLegend label="Active Operations" color="bg-indigo-500" count={vehicles.filter(v => v.status === 'ACTIVE').length} />
               <UtilizationLegend label="Standby Fleet" color="bg-emerald-500" count={vehicles.filter(v => v.status === 'IDLE').length} />
               <UtilizationLegend label="In Maintenance" color="bg-amber-500" count={vehicles.filter(v => v.status === 'MAINTENANCE').length} />
             </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-sm font-black uppercase tracking-widest">Maintenance Burn</h3>
               <TrendingDown className="text-rose-500" size={18} />
             </div>
             <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maintenanceData}>
                    <XAxis dataKey="name" hide />
                    <Bar dataKey="cost" fill="#f43f5e" radius={4} barSize={12} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
             <p className="text-[10px] text-slate-400 font-bold text-center mt-6">MAINTENANCE EXPENSE BY ASSET REGISTRATION</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UtilizationLegend = ({ label, color, count }: { label: string, color: string, count: number }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-xs font-black">{count}</span>
  </div>
);

export default Reports;
