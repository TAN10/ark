
import React, { useState } from 'react';
import { Search, MoreHorizontal, UserPlus, Phone, CreditCard, MapPin, FileText, Car, Fingerprint } from 'lucide-react';
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
    <div className="space-y-8 pb-16">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-cyan-500 font-black text-[9px] uppercase tracking-[0.3em] mb-1.5">Personnel Registry</p>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Driver Management</h2>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-white/5 w-80 focus-within:border-cyan-500/30 transition-all">
            <Search size={16} className="text-slate-600" />
            <input 
              type="text" 
              placeholder="Search ID or Phone" 
              className="bg-transparent border-none focus:outline-none text-[11px] font-black uppercase tracking-widest w-full text-white placeholder:text-slate-700" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAdd(true)}
            className="bg-white text-black font-black text-[10px] uppercase tracking-widest px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-cyan-500 transition-all shadow-xl"
          >
            <UserPlus size={16} /> Onboard Personnel
          </button>
        </div>
      </div>

      <div className="bg-slate-950/50 rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Operator ID</th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Identification Set</th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Location Data</th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Active Link</th>
              <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Status Code</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredDrivers.map(driver => (
              <tr key={driver.id} className="hover:bg-white/[0.03] transition-all group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-600 group-hover:text-cyan-400 font-black text-sm border border-white/5 transition-all">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white uppercase tracking-widest">{driver.name}</p>
                      <div className="flex items-center gap-1.5 text-slate-600 mt-1">
                        <Phone size={10} />
                        <span className="text-[9px] font-bold uppercase tracking-tighter">{driver.phone}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                      <Fingerprint size={12} className="text-slate-700" /> {driver.aadharNumber}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                      <FileText size={12} className="text-slate-700" /> {driver.licenseNumber}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                    <MapPin size={12} className="text-cyan-600" /> {driver.city}, {driver.state}
                  </div>
                </td>
                <td className="px-8 py-6">
                  {driver.assignedVehicleReg ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.05] border border-white/5 rounded-lg">
                      <Car size={10} className="text-cyan-500" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{driver.assignedVehicleReg}</span>
                    </div>
                  ) : (
                    <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest italic">Unlinked</span>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border ${driver.status === DriverStatus.ACTIVE ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                    <div className={`w-1 h-1 rounded-full ${driver.status === DriverStatus.ACTIVE ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">{driver.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-slate-700 hover:text-white transition-all">
                    <MoreHorizontal size={18} />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
      <div className="bg-slate-950 border border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-10 border-b border-white/5 bg-slate-900 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black italic tracking-tighter uppercase text-white">Operator Onboarding</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Personnel Master Records</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-500">✕</button>
        </div>
        <div className="p-10 grid grid-cols-3 gap-10 overflow-y-auto max-h-[60vh] scrollbar-hide">
          <div className="space-y-6">
            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Personal Scope</p>
            <div className="space-y-4">
              <Input placeholder="FULL LEGAL NAME" onChange={e => setForm({...form, name: e.target.value})} />
              <Input placeholder="MOBILE IDENTIFIER" onChange={e => setForm({...form, phone: e.target.value})} />
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-600 uppercase ml-2 tracking-widest">Date of Birth</label>
                <Input type="date" onChange={e => setForm({...form, dob: e.target.value})} />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Government ID Set</p>
            <div className="space-y-4">
              <Input placeholder="DL SERIAL NUMBER" onChange={e => setForm({...form, licenseNumber: e.target.value})} />
              <Input placeholder="AADHAAR ID (12 DIGIT)" onChange={e => setForm({...form, aadharNumber: e.target.value})} />
              <Input placeholder="PAN SERIAL (10 DIGIT)" onChange={e => setForm({...form, panNumber: e.target.value})} />
            </div>
          </div>
          <div className="space-y-6">
            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em]">Geographic Profile</p>
            <div className="space-y-4">
              <Input placeholder="VILLAGE / LOCALITY" onChange={e => setForm({...form, villageName: e.target.value})} />
              <Input placeholder="CITY BASE" onChange={e => setForm({...form, city: e.target.value})} />
              <Input placeholder="STATE PROVINCE" onChange={e => setForm({...form, state: e.target.value})} />
            </div>
          </div>
        </div>
        <div className="p-8 bg-slate-900/50 flex justify-end gap-6 border-t border-white/5">
          <button onClick={onClose} className="px-8 py-3 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all">Cancel</button>
          <button 
            onClick={() => onAdd({ ...form, id: Math.random().toString(), driverId: 'DRV-' + Date.now().toString().slice(-4) } as Driver)}
            className="bg-cyan-600 text-white px-12 py-4 rounded-xl font-black shadow-2xl shadow-cyan-600/20 hover:bg-cyan-500 transition-all uppercase tracking-widest text-[10px]"
          >
            Authorize Personnel
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

export default DriverManagement;
