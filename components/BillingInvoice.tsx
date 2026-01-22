
import React, { useState } from 'react';
import { FileUp, TrendingUp, Download, Printer, Sparkles, Zap, Receipt, ShieldAlert } from 'lucide-react';
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
      const activeDriver = drivers.find(d => d.status === 'ACTIVE') || drivers[0];
      const mock: SettlementRecord = {
        id: Math.random().toString(36).substr(2, 9),
        driverId: activeDriver.id,
        vehRegNumber: activeDriver.assignedVehicleReg || 'MH-12-CR-2024',
        weekEnding: new Date().toISOString().split('T')[0],
        olaUberEarnings: 21500,
        commissionDeducted: 4300,
        fastTagCharge: 950,
        rtoFine: 0,
        privateTollCharges: 300,
        anyOtherCharges: 0,
        netPayable: 15950,
        status: 'PENDING'
      };
      setSettlements([mock, ...settlements]);
      setIsUploading(false);
      setActiveStep('ledger');
    }, 2500);
  };

  return (
    <div className="space-y-10 pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-cyan-500 font-black text-[9px] uppercase tracking-[0.3em] mb-1.5">Financial Gateway</p>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Settlement Portal</h2>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5">
           <TabBtn active={activeStep === 'upload'} onClick={() => setActiveStep('upload')}>Audit Upload</TabBtn>
           <TabBtn active={activeStep === 'ledger'} onClick={() => setActiveStep('ledger')}>Payable Ledger</TabBtn>
        </div>
      </div>

      {activeStep === 'upload' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-950 p-12 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-8 hover:border-cyan-500/30 hover:bg-white/[0.01] transition-all group cursor-pointer">
            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-700 group-hover:text-cyan-500 group-hover:scale-105 transition-all border border-white/5">
              <FileUp size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Sync Platform Data</h3>
              <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-2 max-w-xs mx-auto leading-relaxed">Accepts Weekly Gross Revenue logs from Uber & Ola portals for automatic reconciliation.</p>
            </div>
            <button 
              disabled={isUploading}
              onClick={handleProcess}
              className="bg-white text-black px-12 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 transition-all"
            >
              {isUploading ? 'Decrypting Record Sets...' : 'Start Batch Processing'}
            </button>
          </div>

          <div className="bg-slate-950 p-12 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><TrendingUp size={18} /></div>
                <h3 className="text-lg font-black italic uppercase text-white tracking-tighter">Incentive Matrix</h3>
              </div>
              <div className="space-y-3">
                <IncentiveTier range="60-69 TRIPS" amount="₹1,300" />
                <IncentiveTier range="70-79 TRIPS" amount="₹1,600" />
                <IncentiveTier range="80-99 TRIPS" amount="₹2,000" />
                <IncentiveTier range="100-114 TRIPS" amount="₹2,800" />
                <IncentiveTier range="115+ TRIPS" amount="₹3,800" active />
              </div>
            </div>
            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] mt-8 text-center">Calculated automatically upon data ingest</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/50 rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
           <table className="w-full text-left">
             <thead>
               <tr className="bg-white/[0.02] border-b border-white/5">
                 <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Operator</th>
                 <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Gross Yield</th>
                 <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Liabilities</th>
                 <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Net Payable</th>
                 <th className="px-8 py-5 text-center text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Audit Export</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
               {settlements.map(s => {
                 const driver = drivers.find(d => d.id === s.driverId);
                 const deductions = s.commissionDeducted + s.fastTagCharge + s.rtoFine + s.privateTollCharges;
                 return (
                   <tr key={s.id} className="hover:bg-white/[0.03] transition-all group">
                     <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-slate-600 group-hover:text-cyan-400 transition-colors border border-white/5 font-black text-sm uppercase">
                           {driver?.name.charAt(0)}
                         </div>
                         <div>
                           <p className="text-[11px] font-black text-white uppercase tracking-widest">{driver?.name}</p>
                           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter mt-1">{s.vehRegNumber}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-8 py-6 text-right font-black text-xs text-slate-300">₹{s.olaUberEarnings.toLocaleString()}</td>
                     <td className="px-8 py-6 text-right font-bold text-xs text-rose-500">-₹{deductions.toLocaleString()}</td>
                     <td className="px-8 py-6 text-right font-black text-sm text-cyan-500">₹{s.netPayable.toLocaleString()}</td>
                     <td className="px-8 py-6 text-center">
                       <button className="bg-slate-900 hover:bg-cyan-600 text-slate-400 hover:text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all flex items-center gap-2 mx-auto">
                         <Printer size={14} /> Audit Print
                       </button>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
           {settlements.length === 0 && (
             <div className="p-24 text-center">
               <Receipt className="mx-auto text-slate-800 mb-4" size={48} />
               <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.2em]">No financial data available for audit</p>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

const TabBtn = ({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
  >
    {children}
  </button>
);

const IncentiveTier = ({ range, amount, active }: { range: string, amount: string, active?: boolean }) => (
  <div className={`flex justify-between items-center p-4 rounded-xl border transition-all ${active ? 'bg-cyan-600 border-cyan-400 shadow-[0_0_20px_rgba(8,145,178,0.2)]' : 'bg-white/[0.02] border-white/5 group hover:border-white/10'}`}>
    <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-slate-400'}`}>{range}</span>
    <div className="flex items-center gap-2">
      {active && <Zap size={14} className="text-white" />}
      <span className={`text-[11px] font-black ${active ? 'text-white' : 'text-cyan-500'}`}>{amount} <span className="text-[9px] opacity-70">BONUS</span></span>
    </div>
  </div>
);

export default BillingInvoice;
