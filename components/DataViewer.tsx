
import React, { useState } from 'react';
import { Database, Table, User, Car, Receipt, ShieldCheck, AlertCircle } from 'lucide-react';
import { Driver, Vehicle, SettlementRecord } from '../types';

interface DataViewerProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  settlements: SettlementRecord[];
}

const DataViewer: React.FC<DataViewerProps> = ({ drivers, vehicles, settlements }) => {
  const [activeTable, setActiveTable] = useState<'drivers' | 'vehicles' | 'settlements'>('drivers');

  const renderTable = () => {
    switch (activeTable) {
      case 'drivers':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">ID</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Name</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Phone</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Vehicle</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {drivers.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="p-4 font-mono text-[10px] text-slate-400">{d.id}</td>
                    <td className="p-4 text-xs font-bold">{d.name}</td>
                    <td className="p-4 text-xs">{d.phone}</td>
                    <td className="p-4 text-xs font-mono">{d.assignedVehicleReg || 'NONE'}</td>
                    <td className="p-4 text-[10px] font-black uppercase tracking-tighter">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'vehicles':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Reg No</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Make/Model</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Odometer</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {vehicles.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="p-4 text-xs font-black uppercase">{v.regNo}</td>
                    <td className="p-4 text-xs font-bold">{v.make} {v.model}</td>
                    <td className="p-4 text-xs">{v.odometerReading} KM</td>
                    <td className="p-4 text-[10px] font-black uppercase tracking-tighter">{v.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'settlements':
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Week Ending</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Driver ID</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Earnings</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Net Payable</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {settlements.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="p-4 text-xs font-bold">{s.weekEnding}</td>
                    <td className="p-4 font-mono text-[10px] text-slate-400">{s.driverId}</td>
                    <td className="p-4 text-xs font-bold text-emerald-600">₹{s.olaUberEarnings.toLocaleString()}</td>
                    <td className="p-4 text-xs font-black text-indigo-600 dark:text-indigo-400">₹{s.netPayable.toLocaleString()}</td>
                    <td className="p-4 text-[10px] font-black uppercase tracking-tighter">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-1">System Diagnostic</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Raw Data Audit</h2>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-white/5">
          <button 
            onClick={() => setActiveTable('drivers')} 
            className={`px-6 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTable === 'drivers' ? 'bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white' : 'text-slate-500'}`}
          >
            <User size={14} /> Drivers
          </button>
          <button 
            onClick={() => setActiveTable('vehicles')} 
            className={`px-6 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTable === 'vehicles' ? 'bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white' : 'text-slate-500'}`}
          >
            <Car size={14} /> Vehicles
          </button>
          <button 
            onClick={() => setActiveTable('settlements')} 
            className={`px-6 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTable === 'settlements' ? 'bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white' : 'text-slate-500'}`}
          >
            <Receipt size={14} /> Settlements
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 p-8 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
          <ShieldCheck size={18} className="text-amber-500" />
          <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">
            {process.env.POSTGRES_URL ? 'Live Production Node Data' : 'Internal Seed Data Active (Mock Mode)'}
          </p>
        </div>

        {renderTable()}

        <div className="mt-8 flex justify-center">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Showing {activeTable === 'drivers' ? drivers.length : activeTable === 'vehicles' ? vehicles.length : settlements.length} active records
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataViewer;
