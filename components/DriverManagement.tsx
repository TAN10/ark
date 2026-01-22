
import React, { useState } from 'react';
/* Added Car to lucide-react imports */
import { Plus, Search, MoreHorizontal, UserPlus, Phone, CreditCard, MapPin, Calendar, FileText, Car } from 'lucide-react';
import { Driver, DriverStatus } from '../types';

interface DriverManagementProps {
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
}

const DriverManagement: React.FC<DriverManagementProps> = ({ drivers, setDrivers }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-1">Fleet Operations</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">DRIVER DIRECTORY</h2>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm w-80">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Name or Mobile ID" 
              className="bg-transparent border-none focus:outline-none text-sm w-full font-medium" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAdd(true)}
            className="bg-slate-900 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
          >
            <UserPlus size={20} /> Onboard New Driver
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identification</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Govt. Documents</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Location</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Mapping</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Account Status</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDrivers.map(driver => (
              <tr key={driver.id} className="hover:bg-slate-50/80 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg">{driver.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{driver.name}</p>
                      <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                        <Phone size={12} />
                        <span className="text-[11px] font-bold">{driver.phone}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                      <CreditCard size={12} className="text-slate-400" /> Aadhaar: {driver.aadharNumber}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                      <FileText size={12} className="text-slate-400" /> License: {driver.licenseNumber}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                    <MapPin size={12} className="text-indigo-500" /> {driver.city}, {driver.state}
                  </div>
                </td>
                <td className="px-8 py-6">
                  {/* Fixed Car icon usage */}
                  {driver.assignedVehicleReg ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-xl">
                      <Car size={12} className="text-indigo-600" />
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">{driver.assignedVehicleReg}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 uppercase italic">Unassigned</span>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${driver.status === DriverStatus.ACTIVE ? 'bg-green-50 border-green-100 text-green-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${driver.status === DriverStatus.ACTIVE ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{driver.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-slate-400 hover:bg-white hover:text-slate-900 rounded-xl transition-all shadow-sm">
                    <MoreHorizontal size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && <DriverModal onClose={() => setShowAdd(false)} onAdd={(d) => { setDrivers([...drivers, d]); setShowAdd(false); }} />}
    </div>
  );
};

const DriverModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (d: Driver) => void }) => {
  const [form, setForm] = useState<Partial<Driver>>({
    status: DriverStatus.ONBOARDING,
    onboardedAt: new Date().toISOString().split('T')[0]
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-6">
      <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black italic tracking-tight">ADD NEW DRIVER</h3>
            <p className="text-slate-400 text-sm font-medium">Register driver details into CRMS Master Database</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all">✕</button>
        </div>
        <div className="p-10 grid grid-cols-3 gap-8 overflow-y-auto max-h-[60vh]">
          <div className="col-span-1 space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Basic Info</label>
            <input placeholder="Full Name" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, name: e.target.value})} />
            <input placeholder="Mobile ID" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, phone: e.target.value})} />
            <input type="date" placeholder="Date of Birth" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, dob: e.target.value})} />
          </div>
          <div className="col-span-1 space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Govt IDs</label>
            <input placeholder="Driving License #" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold uppercase" onChange={e => setForm({...form, licenseNumber: e.target.value})} />
            <input placeholder="Aadhaar # (12 Digit)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, aadharNumber: e.target.value})} />
            <input placeholder="PAN # (10 Digit)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold uppercase" onChange={e => setForm({...form, panNumber: e.target.value})} />
          </div>
          <div className="col-span-1 space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location Details</label>
            <input placeholder="Village / Area" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, villageName: e.target.value})} />
            <input placeholder="City" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, city: e.target.value})} />
            <input placeholder="State" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" onChange={e => setForm({...form, state: e.target.value})} />
          </div>
        </div>
        <div className="p-10 bg-slate-50 flex justify-end gap-4 border-t border-slate-100">
          <button onClick={onClose} className="px-8 py-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Discard Changes</button>
          <button 
            onClick={() => onAdd({ ...form, id: Math.random().toString(), driverId: 'DRV-' + Date.now().toString().slice(-4) } as Driver)}
            className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all uppercase tracking-widest text-xs"
          >
            Save to Master Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverManagement;
