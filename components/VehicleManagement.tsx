
import React, { useState } from 'react';
import { Plus, Search, Car, Wrench, AlertCircle, Calendar, Shield, Activity, History, DollarSign } from 'lucide-react';
import { Vehicle, MaintenanceRecord } from '../types';

interface VehicleManagementProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
}

const VehicleManagement: React.FC<VehicleManagementProps> = ({ vehicles, setVehicles }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter(v => 
    v.regNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-1">Asset Control</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">FLEET INVENTORY</h2>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm w-80">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Reg Number (e.g. MH-12)" 
              className="bg-transparent border-none focus:outline-none text-sm w-full font-medium" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-slate-900 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
          >
            <Plus size={20} /> Register New Vehicle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Chassis & Purchase</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Compliance</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map(v => (
                <tr 
                  key={v.id} 
                  className={`hover:bg-indigo-50/30 transition-all cursor-pointer ${selectedVehicle?.id === v.id ? 'bg-indigo-50/50' : ''}`}
                  onClick={() => setSelectedVehicle(v)}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600">
                        <Car size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{v.regNo}</p>
                        <p className="text-[11px] font-bold text-slate-500">{v.make} {v.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[11px] font-black text-slate-700 uppercase">{v.chasisNumber}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">Purchased: {v.purchaseDate}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500">
                        <Shield size={12} className="text-indigo-400" /> Ins. End: {v.insuranceEndDate}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-500">
                        <AlertCircle size={12} className="text-rose-400" /> PUC: {v.pucExpiryDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      v.status === 'ACTIVE' ? 'bg-green-50 border-green-100 text-green-700' :
                      v.status === 'MAINTENANCE' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                      'bg-slate-50 border-slate-100 text-slate-500'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="text-indigo-600 font-black text-[10px] uppercase tracking-tighter hover:underline">Edit Master</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          {selectedVehicle ? (
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black italic tracking-tighter">{selectedVehicle.regNo}</h3>
                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Maintenance Ledger</p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <Wrench size={24} className="text-indigo-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Odometer</p>
                    <p className="text-lg font-black mt-1">{selectedVehicle.odometerReading.toLocaleString()} KM</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Service</p>
                    <p className="text-lg font-black mt-1 text-emerald-400">₹{selectedVehicle.maintenanceCost.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Transactions</h4>
                  {selectedVehicle.maintenanceHistory.length > 0 ? selectedVehicle.maintenanceHistory.map(h => (
                    <div key={h.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div>
                        <p className="text-xs font-bold">{h.serviceType}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{h.serviceDate}</p>
                      </div>
                      <p className="text-xs font-black">₹{h.serviceExpense}</p>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-500 italic py-4">No maintenance history recorded.</p>
                  )}
                </div>

                <button className="w-full mt-8 bg-indigo-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                  Log Service Transaction
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <History size={32} />
              </div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Select a vehicle to view logs</p>
            </div>
          )}

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity size={16} className="text-indigo-600" /> Fleet Compliance Alerts
            </h3>
            <div className="space-y-4">
              <AlertItem label="Insurance Expiring" count={2} color="text-rose-500" />
              <AlertItem label="PUC Due (7 Days)" count={5} color="text-amber-500" />
              <AlertItem label="Service Odometer Due" count={1} color="text-indigo-500" />
            </div>
          </div>
        </div>
      </div>

      {showAddModal && <AddVehicleModal onClose={() => setShowAddModal(false)} onAdd={(v) => { setVehicles([...vehicles, v]); setShowAddModal(false); }} />}
    </div>
  );
};

const AlertItem = ({ label, count, color }: { label: string, count: number, color: string }) => (
  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
    <span className="text-xs font-bold text-slate-600">{label}</span>
    <span className={`text-xs font-black ${color}`}>{count} Assets</span>
  </div>
);

const AddVehicleModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (v: Vehicle) => void }) => {
  const [form, setForm] = useState<Partial<Vehicle>>({
    status: 'IDLE',
    maintenanceCost: 0,
    rentalExpenses: { fastTag: 0, rtoFines: 0, accident: 0 },
    registrationDate: new Date().toISOString().split('T')[0]
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-6">
      <div className="bg-white rounded-[3rem] w-full max-w-5xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-10 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black italic tracking-tight uppercase">Register Fleet Asset</h3>
            <p className="text-slate-400 text-sm font-medium">Vehicle Master Data (Section 4.3 Requirement)</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all">✕</button>
        </div>
        <div className="p-10 grid grid-cols-3 gap-8 overflow-y-auto max-h-[70vh] scrollbar-hide">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Primary Info</p>
            <input placeholder="Registration Number (MH-XX-XX-XXXX)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold uppercase" onChange={e => setForm({...form, regNo: e.target.value})} />
            <input placeholder="Chassis Number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold uppercase" onChange={e => setForm({...form, chasisNumber: e.target.value})} />
            <input placeholder="Vehicle Make (e.g. Maruti)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, make: e.target.value})} />
            <input placeholder="Vehicle Model (e.g. Dzire)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, model: e.target.value})} />
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Maintenance & Compliance</p>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Purchase Date</label>
              <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, purchaseDate: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Insurance Company</label>
              <input placeholder="HDFC, SBI, etc." className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, insuranceCompany: e.target.value})} />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2 space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Ins. End Date</label>
                <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, insuranceEndDate: e.target.value})} />
              </div>
              <div className="w-1/2 space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">PUC Expiry</label>
                <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, pucExpiryDate: e.target.value})} />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Logistics Data</p>
            <input placeholder="FastTag ID / Details" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, fastTagDetails: e.target.value})} />
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Odometer (KM)</label>
              <input type="number" placeholder="45000" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, odometerReading: parseInt(e.target.value)})} />
            </div>
          </div>
        </div>
        <div className="p-10 bg-slate-50 flex justify-end gap-4 border-t border-slate-100">
          <button onClick={onClose} className="px-8 py-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Discard Entry</button>
          <button 
            onClick={() => onAdd({ ...form, id: Math.random().toString(), maintenanceHistory: [], odometerReadingDate: new Date().toISOString().split('T')[0] } as Vehicle)}
            className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black shadow-xl hover:bg-indigo-500 transition-all uppercase tracking-widest text-[10px]"
          >
            Commit to Master Database
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;
