
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Driver, SettlementRecord, Vehicle } from '../types';

interface ReportsProps {
  drivers: Driver[];
  settlements: SettlementRecord[];
  vehicles: Vehicle[];
}

const Reports: React.FC<ReportsProps> = ({ drivers, settlements, vehicles }) => {
  const driverBillingData = drivers.map(d => {
    const driverSettlements = settlements.filter(s => s.driverId === d.id);
    const totalEarnings = driverSettlements.reduce((acc, s) => acc + s.olaUberEarnings, 0);
    return { name: d.name, earnings: totalEarnings };
  });

  const utilizationData = [
    { name: 'Active', value: vehicles.filter(v => v.status === 'ACTIVE').length, color: '#22c55e' },
    { name: 'Idle', value: vehicles.filter(v => v.status === 'IDLE').length, color: '#f59e0b' },
    { name: 'Maintenance', value: vehicles.filter(v => v.status === 'MAINTENANCE').length, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Key Business Reports</h2>
        <p className="text-slate-500">Analytical overview of fleet utilization and driver performance.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Vehicle Utilization Report</h3>
          <div className="h-64 flex flex-col items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={utilizationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                   {utilizationData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
             <div className="flex gap-4 mt-4">
                {utilizationData.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-500 font-medium">{item.name}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Driver-wise Billing Report</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driverBillingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="earnings" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Account Statements Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-slate-50">
               <tr>
                 <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Driver</th>
                 <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Total Revenue (OLA/UBER)</th>
                 <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Total Deductions</th>
                 <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {drivers.map(d => {
                 const billing = settlements.filter(s => s.driverId === d.id);
                 const revenue = billing.reduce((acc, s) => acc + s.olaUberEarnings, 0);
                 const deductions = billing.reduce((acc, s) => acc + s.commissionDeducted + s.fastTagCharges + s.tollTax, 0);
                 return (
                   <tr key={d.id}>
                     <td className="px-6 py-4 text-sm font-bold text-slate-900">{d.name}</td>
                     <td className="px-6 py-4 text-sm text-slate-700">₹{revenue.toLocaleString()}</td>
                     <td className="px-6 py-4 text-sm text-red-500">₹{deductions.toLocaleString()}</td>
                     <td className="px-6 py-4">
                       <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-[10px] font-bold">REPORT GENERATED</span>
                     </td>
                   </tr>
                 )
               })}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
