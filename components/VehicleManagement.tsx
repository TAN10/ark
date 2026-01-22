
import React, { useState } from 'react';
// Fixed: Removed 'Tool' from imports as it's not exported by lucide-react.
import { Plus, Search, Car, Wrench, AlertCircle, Calendar, Shield, Activity, History } from 'lucide-react';
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

  const handleLogMaintenance = (record: MaintenanceRecord) => {
    setVehicles(prev => prev.map(v => {
      if (v.regNo === record.vehRegNumber) {
        return {
          ...v,
          maintenanceHistory: [record, ...v.maintenanceHistory],
          maintenanceCost: v.maintenanceCost + record.serviceExpense,
          odometerReading: record.odometerReading
        };
      }
      return v;
    }));
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-cyan-500 font-black text-[9px] uppercase tracking-[0.3em] mb-1.5">Asset Registry</p>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Fleet Inventory</h2>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-white/5 w-80 focus-within:border-cyan-500/30 transition-all">
            <Search size={16} className="text-slate-600" />
            <input 
              type="text" 
              placeholder="Search Reg ID (e.g. MH-12)" 
              className="bg-transparent border-none focus:outline-none text-[11px] font-black uppercase tracking-widest w-full text-white placeholder:text-slate-700" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-white text-black font-black text-[10px] uppercase tracking-widest px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-cyan-500 transition-all shadow-xl"
          >
            <Plus size={16} /> Register Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-slate-950/50 rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Vehicle Identification</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Configuration</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Compliance Matrix</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredVehicles.map(v => (
                <tr 
                  key={v.id} 
                  className={`hover:bg-white/[0.03] transition-all cursor-pointer group ${selectedVehicle?.id === v.id ? 'bg-cyan-500/5' : ''}`}
                  onClick={() => setSelectedVehicle(v)}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-600 group-hover:text-cyan-400 border border-white/5 transition-all">
                        <Car size={20} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-white uppercase tracking-widest">{v.regNo}</p>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tight mt-0.5">{v.make} • {v.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{v.chasisNumber}</p>
                    <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase">Purchased: {v.purchaseDate}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase">
                        <Shield size={10} className="text-cyan-500" /> Ins: {v.insuranceEndDate}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase">
                        <AlertCircle size={10} className="text-rose-500" /> PUC: {v.pucExpiryDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border ${
                      v.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                      v.status === 'MAINTENANCE' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                      'bg-slate-800 border-white/10 text-slate-500'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          {selectedVehicle ? (
            <div className="bg-slate-950 p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white">{selectedVehicle.regNo}</h3>
                    <p className="text-cyan-500 text-[9px] font-black uppercase tracking-[0.3em] mt-1">Lifecycle Tracking</p>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5 text-cyan-500">
                    <Wrench size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Odometer</p>
                    <p className="text-lg font-black mt-1 text-white">{selectedVehicle.odometerReading.toLocaleString()} <span className="text-[10px] text-slate-500">KM</span></p>
                  </div>
                  <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Service Burn</p>
                    <p className="text-lg font-black mt-1 text-emerald-500">₹{selectedVehicle.maintenanceCost.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                  <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Recent Service Logs</h4>
                  {selectedVehicle.maintenanceHistory.length > 0 ? selectedVehicle.maintenanceHistory.map(h => (
                    <div key={h.id} className="flex items-center justify-between p-3.5 bg-white/[0.02] rounded-xl border border-white/5 group/row hover:border-cyan-500/20">
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">{h.serviceType}</p>
                        <p className="text-[9px] text-slate-600 font-bold mt-0.5">{h.serviceDate}</p>
                      </div>
                      <p className="text-[11px] font-black text-cyan-500">₹{h.serviceExpense}</p>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-white/5 rounded-2xl">
                      {/* Fixed: Replaced 'Tool' with 'Wrench' as 'Tool' is not an exported member of lucide-react */}
                      <Wrench size={24} className="text-slate-800 mb-2" />
                      <p className="text-[9px] text-slate-700 uppercase font-black tracking-widest">No maintenance history</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => alert("Maintenance Logging Module Initiated for " + selectedVehicle.regNo)}
                  className="w-full mt-8 bg-cyan-600/10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:bg-cyan-600 hover:text-white transition-all border border-cyan-500/20 shadow-xl shadow-cyan-500/5"
                >
                  Log Maintenance Event
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/50 rounded-3xl p-16 text-center border border-dashed border-white/5 flex flex-col items-center justify-center space-y-4 shadow-inner">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-slate-800">
                <History size={32} />
              </div>
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">Select vehicle to audit</p>
            </div>
          )}

          <div className="bg-slate-950 p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <Activity size={16} className="text-cyan-500" /> System Integrity
            </h3>
            <div className="space-y-3">
              <AlertItem label="Insurance Renewal" count={1} color="text-rose-500" />
              <AlertItem label="PUC Audit Required" count={2} color="text-amber-500" />
              <AlertItem label="Odometer Threshold" count={1} color="text-cyan-500" />
            </div>
          </div>
        </div>
      </div>

      {showAddModal && <AddVehicleModal onClose={() => setShowAddModal(false)} onAdd={(v) => { setVehicles([...vehicles, v]); setShowAddModal(false); }} />}
    </div>
  );
};

const AlertItem = ({ label, count, color }: { label: string, count: number, color: string }) => (
  <div className="flex justify-between items-center p-4 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-all">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <span className={`text-[10px] font-black ${color} bg-black/40 px-2 py-0.5 rounded`}>{count} UNIT{count !== 1 ? 'S' : ''}</span>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
      <div className="bg-slate-950 border border-white/10 rounded-3xl w-full max-w-5xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-10 border-b border-white/5 bg-slate-900 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black italic tracking-tighter uppercase text-white">Provision New Asset</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Enterprise Fleet Onboarding</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-500">✕</button>
        </div>
        <div className="p-10 grid grid-cols-3 gap-10 overflow-y-auto max-h-[70vh] scrollbar-hide">
          <div className="space-y-6">
            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Identification</p>
            <div className="space-y-4">
              <Input placeholder="REGISTRATION NUMBER" onChange={e => setForm({...form, regNo: e.target.value})} />
              <Input placeholder="CHASSIS SERIAL" onChange={e => setForm({...form, chasisNumber: e.target.value})} />
              <Input placeholder="MANUFACTURER" onChange={e => setForm({...form, make: e.target.value})} />
              <Input placeholder="MODEL VARIANT" onChange={e => setForm({...form, model: e.target.value})} />
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Compliance</p>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-600 uppercase ml-2 tracking-widest">Insurance Expiry</label>
                <Input type="date" onChange={e => setForm({...form, insuranceEndDate: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-600 uppercase ml-2 tracking-widest">PUC Expiry</label>
                <Input type="date" onChange={e => setForm({...form, pucExpiryDate: e.target.value})} />
              </div>
              <Input placeholder="FASTTAG ACCOUNT ID" onChange={e => setForm({...form, fastTagDetails: e.target.value})} />
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Status</p>
            <div className="space-y-4">
              <Input type="number" placeholder="CURRENT ODOMETER (KM)" onChange={e => setForm({...form, odometerReading: parseInt(e.target.value)})} />
              <div className="p-6 border border-white/5 bg-white/[0.02] rounded-2xl">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-relaxed text-center">By committing this data, the asset will be immediately available for operator assignment.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 bg-slate-900/50 flex justify-end gap-6 border-t border-white/5">
          <button onClick={onClose} className="px-8 py-3 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all">Cancel</button>
          <button 
            onClick={() => onAdd({ ...form, id: Math.random().toString(), maintenanceHistory: [], odometerReadingDate: new Date().toISOString().split('T')[0] } as Vehicle)}
            className="bg-cyan-600 text-white px-12 py-4 rounded-xl font-black shadow-2xl shadow-cyan-600/20 hover:bg-cyan-500 transition-all uppercase tracking-widest text-[10px]"
          >
            Commit to Ledger
          </button>
        </div>
      </div>
    </div>
  );
};

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props} 
    className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-[11px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-cyan-500/40 focus:bg-slate-800 transition-all placeholder:text-slate-700"
  />
);

export default VehicleManagement;
