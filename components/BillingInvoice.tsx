
import React, { useState } from 'react';
import { FileUp, Search, TrendingUp, Download, CheckCircle2, AlertTriangle, Printer, Sparkles } from 'lucide-react';
import { Driver, SettlementRecord } from '../types';

interface BillingInvoiceProps {
  drivers: Driver[];
  settlements: SettlementRecord[];
  setSettlements: React.Dispatch<React.SetStateAction<SettlementRecord[]>>;
}

const BillingInvoice: React.FC<BillingInvoiceProps> = ({ drivers, settlements, setSettlements }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [activeStep, setActiveStep] = useState<'upload' | 'ledger'>('upload');

  const handleProcess = () => {
    setIsUploading(true);
    setTimeout(() => {
      const mock: SettlementRecord = {
        id: Math.random().toString(),
        driverId: drivers[0].id,
        vehRegNumber: drivers[0].assignedVehicleReg || 'MH-12-AB-1234',
        weekEnding: new Date().toISOString().split('T')[0],
        olaUberEarnings: 18450,
        commissionDeducted: 3690,
        fastTagCharge: 850,
        rtoFine: 0,
        privateTollCharges: 200,
        anyOtherCharges: 0,
        netPayable: 13710,
        status: 'PENDING'
      };
      setSettlements([mock, ...settlements]);
      setIsUploading(false);
      setActiveStep('ledger');
    }, 2000);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-1">Financial Operations</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">BILLING & SETTLEMENTS</h2>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
           <button onClick={() => setActiveStep('upload')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeStep === 'upload' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Data Upload</button>
           <button onClick={() => setActiveStep('ledger')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeStep === 'ledger' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}>Payment Ledger</button>
        </div>
      </div>

      {activeStep === 'upload' ? (
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-6 hover:border-indigo-500 hover:bg-indigo-50/20 transition-all group">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <FileUp size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 italic">UPLOAD OLA/UBER DATA</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs font-medium">Select the weekly report file (.csv or .xlsx) from operator portal.</p>
            </div>
            <button 
              disabled={isUploading}
              onClick={handleProcess}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/10 hover:bg-indigo-600 disabled:opacity-50"
            >
              {isUploading ? 'Verifying File Structure...' : 'Process Weekly Earnings'}
            </button>
          </div>

          <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden text-white">
            <Sparkles className="absolute top-8 right-8 text-indigo-500/30" size={64} />
            <h3 className="text-xl font-black italic mb-6">Uber Incentive Engine</h3>
            <div className="space-y-4">
              <IncentiveTier range="60 - 69 Trips" amount="₹1,300" />
              <IncentiveTier range="70 - 79 Trips" amount="₹1,600" />
              <IncentiveTier range="80 - 99 Trips" amount="₹2,000" />
              <IncentiveTier range="100 - 114 Trips" amount="₹2,800" />
              <IncentiveTier range="115+ Trips" amount="₹3,800" active />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
           <table className="w-full text-left">
             <thead className="bg-slate-50">
               <tr className="border-b border-slate-100">
                 <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Driver / Vehicle</th>
                 <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Gross Revenue</th>
                 <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Total Deductions</th>
                 <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Net Payable</th>
                 <th className="px-8 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Statements</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {settlements.map(s => {
                 const driver = drivers.find(d => d.id === s.driverId);
                 const deductions = s.commissionDeducted + s.fastTagCharge + s.rtoFine + s.privateTollCharges;
                 return (
                   <tr key={s.id} className="hover:bg-slate-50 transition-all">
                     <td className="px-8 py-6">
                       <p className="text-sm font-black text-slate-900">{driver?.name}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{s.vehRegNumber}</p>
                     </td>
                     <td className="px-8 py-6 text-right font-black text-sm text-slate-900">₹{s.olaUberEarnings.toLocaleString()}</td>
                     <td className="px-8 py-6 text-right font-bold text-sm text-rose-500">-₹{deductions.toLocaleString()}</td>
                     <td className="px-8 py-6 text-right font-black text-sm text-green-600">₹{s.netPayable.toLocaleString()}</td>
                     <td className="px-8 py-6 text-center">
                       <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                         <Printer size={14} /> Print Statement
                       </button>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

const IncentiveTier = ({ range, amount, active }: { range: string, amount: string, active?: boolean }) => (
  <div className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${active ? 'bg-indigo-600 border-indigo-400 shadow-lg' : 'bg-white/5 border-white/10'}`}>
    <span className="text-xs font-bold">{range}</span>
    <span className="text-xs font-black text-indigo-400">{amount} Bonus</span>
  </div>
);

export default BillingInvoice;
