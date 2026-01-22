
import React, { useState } from 'react';
import { Link2, Unlink, CheckCircle, Car, User, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Driver, Vehicle, RentalModel } from '../types';
import { suggestAutoMapping } from '../services/geminiService';

interface DriverVehicleMappingProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
}

const DriverVehicleMapping: React.FC<DriverVehicleMappingProps> = ({ drivers, vehicles, setDrivers }) => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [paymentModel, setPaymentModel] = useState<RentalModel>(RentalModel.DAILY);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const availableVehicles = vehicles.filter(v => v.status === 'IDLE');
  const availableDrivers = drivers.filter(d => !d.assignedVehicleReg);

  const handleAiAssist = async () => {
    setLoadingAi(true);
    try {
      const suggestion = await suggestAutoMapping(availableDrivers, availableVehicles);
      setAiSuggestion(suggestion || "Recommendation algorithm inconclusive.");
    } catch (e) {
      setAiSuggestion("AI Node unavailable.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleMap = () => {
    if (!selectedDriver || !selectedVehicle) return;
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    setDrivers(prev => prev.map(d => d.id === selectedDriver ? { ...d, assignedVehicleReg: vehicle?.regNo, paymentModel } : d));
    alert('Mapping Successfully Established');
    setSelectedDriver('');
    setSelectedVehicle('');
    setAiSuggestion(null);
  };

  return (
    <div className="space-y-10 pb-16">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-cyan-600 font-black text-[10px] uppercase tracking-[0.3em] mb-1.5">Asset Logistics</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Fleet Assignment</h2>
        </div>
        <button 
          onClick={handleAiAssist}
          disabled={loadingAi || availableDrivers.length === 0}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/20 text-[10px] uppercase tracking-widest disabled:bg-slate-300 dark:disabled:bg-slate-800"
        >
          {loadingAi ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          AI Auto-Match Assistant
        </button>
      </div>

      {aiSuggestion && (
        <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-500/20 p-6 rounded-[2rem] flex items-start gap-5 animate-in slide-in-from-left-4 duration-500">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Intelligent Assignment Logic</h4>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight leading-relaxed">{aiSuggestion}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-950 p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">1. Select Available Driver</label>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white focus:ring-2 ring-cyan-500/20 outline-none appearance-none cursor-pointer"
              value={selectedDriver}
              onChange={e => setSelectedDriver(e.target.value)}
            >
              <option value="">CHOOSE PERSONNEL...</option>
              {availableDrivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.phone})</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">2. Assign Vehicle Asset</label>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white focus:ring-2 ring-cyan-500/20 outline-none appearance-none cursor-pointer"
              value={selectedVehicle}
              onChange={e => setSelectedVehicle(e.target.value)}
            >
              <option value="">CHOOSE REGISTRATION...</option>
              {availableVehicles.map(v => <option key={v.id} value={v.id}>{v.regNo} — {v.make} {v.model}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">3. Operating Model</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setPaymentModel(RentalModel.DAILY)}
                className={`flex-1 p-5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${paymentModel === RentalModel.DAILY ? 'bg-cyan-600 border-cyan-400 text-white shadow-xl shadow-cyan-600/20' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-400'}`}
              >
                Daily Rent
              </button>
              <button 
                onClick={() => setPaymentModel(RentalModel.COMMISSION)}
                className={`flex-1 p-5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${paymentModel === RentalModel.COMMISSION ? 'bg-cyan-600 border-cyan-400 text-white shadow-xl shadow-cyan-600/20' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/5 text-slate-400'}`}
              >
                % Comm.
              </button>
            </div>
          </div>

          <button 
            onClick={handleMap}
            disabled={!selectedDriver || !selectedVehicle}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-indigo-600 hover:text-white disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 transition-all flex items-center justify-center gap-3"
          >
            <Link2 size={18} /> Establish Master Mapping
          </button>
        </div>

        <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-950/50 p-10 rounded-[3rem] border-2 border-slate-200 dark:border-white/5 border-dashed space-y-8 min-h-[500px]">
           <h3 className="text-xl font-black italic text-slate-900 dark:text-white uppercase tracking-tighter">Active Operational Links</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {drivers.filter(d => d.assignedVehicleReg).length > 0 ? drivers.filter(d => d.assignedVehicleReg).map(d => (
               <div key={d.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-lg flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 transition-colors">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{d.name}</p>
                      <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1">{d.paymentModel}</p>
                    </div>
                 </div>
                 <div className="text-slate-200 dark:text-slate-800"><ArrowRight size={20} /></div>
                 <div className="text-right">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{d.assignedVehicleReg}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Fleet Node</p>
                 </div>
               </div>
             )) : (
               <div className="col-span-2 flex flex-col items-center justify-center py-20 text-center">
                 <Unlink size={48} className="text-slate-200 dark:text-slate-800 mb-4" />
                 <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">No active asset pairings</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DriverVehicleMapping;
