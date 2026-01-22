
import React, { useState } from 'react';
import { Link2, Unlink, CheckCircle, Car, User, ArrowRight } from 'lucide-react';
import { Driver, Vehicle, RentalModel } from '../types';

interface DriverVehicleMappingProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
}

const DriverVehicleMapping: React.FC<DriverVehicleMappingProps> = ({ drivers, vehicles, setDrivers }) => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [paymentModel, setPaymentModel] = useState<RentalModel>(RentalModel.DAILY);

  const availableVehicles = vehicles.filter(v => v.status === 'IDLE');
  const availableDrivers = drivers.filter(d => !d.assignedVehicleReg);

  const handleMap = () => {
    if (!selectedDriver || !selectedVehicle) return;
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    setDrivers(prev => prev.map(d => d.id === selectedDriver ? { ...d, assignedVehicleReg: vehicle?.regNo, paymentModel } : d));
    alert('Mapping Successfully Established');
    setSelectedDriver('');
    setSelectedVehicle('');
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-1">Logistics Mapping</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">FLEET ASSIGNMENT</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">1. Select Available Driver</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold appearance-none"
              value={selectedDriver}
              onChange={e => setSelectedDriver(e.target.value)}
            >
              <option value="">Choose Driver...</option>
              {availableDrivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.phone})</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">2. Assign Vehicle Asset</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold appearance-none"
              value={selectedVehicle}
              onChange={e => setSelectedVehicle(e.target.value)}
            >
              <option value="">Choose Registration...</option>
              {availableVehicles.map(v => <option key={v.id} value={v.id}>{v.regNo} - {v.model}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">3. Operating Model</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setPaymentModel(RentalModel.DAILY)}
                className={`flex-1 p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${paymentModel === RentalModel.DAILY ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
              >
                Daily Rental
              </button>
              <button 
                onClick={() => setPaymentModel(RentalModel.COMMISSION)}
                className={`flex-1 p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${paymentModel === RentalModel.COMMISSION ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
              >
                Commission
              </button>
            </div>
          </div>

          <button 
            onClick={handleMap}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-900/10 hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
          >
            <Link2 size={18} /> Establish Master Mapping
          </button>
        </div>

        <div className="lg:col-span-2 bg-slate-50 p-10 rounded-[3rem] border border-slate-200 border-dashed space-y-8">
           <h3 className="text-xl font-black italic text-slate-900">Active Operational Links</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {drivers.filter(d => d.assignedVehicleReg).map(d => (
               <div key={d.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group">
                 <div className="flex items-center gap-4">
                    <div className="text-indigo-600"><User size={24} /></div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{d.name}</p>
                      <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">{d.paymentModel}</p>
                    </div>
                 </div>
                 <div className="text-slate-300"><ArrowRight size={20} /></div>
                 <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-sm font-black text-slate-900">{d.assignedVehicleReg}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Fleet</p>
                    </div>
                    <div className="text-slate-400"><Car size={24} /></div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DriverVehicleMapping;
