
import React, { useState } from 'react';
import { FileUp, TrendingUp, Download, Printer, Sparkles, Zap, Receipt, ShieldAlert, Loader2 } from 'lucide-react';
import { Driver, SettlementRecord } from '../types';
import { analyzeReport } from '../services/geminiService';

interface BillingInvoiceProps {
  drivers: Driver[];
  settlements: SettlementRecord[];
  setSettlements: React.Dispatch<React.SetStateAction<SettlementRecord[]>>;
}

const BillingInvoice: React.FC<BillingInvoiceProps> = ({ drivers, settlements, setSettlements }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [activeStep, setActiveStep] = useState<'upload' | 'ledger'>('upload');
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const handleProcess = async () => {
    setIsUploading(true);
    setAiInsight(null);
    
    // Simulate raw data from a CSV/Excel file
    const rawData = "BATCH_ID: 0092 | DRIVER_A: 25000 earnings, 5000 comm | DRIVER_B: 18000 earnings, 3000 comm";
    
    try {
      const results = await analyzeReport(rawData);
      
      const newSettlements: SettlementRecord[] = results.map((res: any) => {
        // Try to find matching driver or fallback to first available
        const driver = drivers.find(d => d.name.toLowerCase().includes(res.driverName.toLowerCase())) || drivers[0];
        
        return {
          id: Math.random().toString(36).substr(2, 9),
          driverId: driver.id,
          vehRegNumber: driver.assignedVehicleReg || 'UNASSIGNED',
          weekEnding: new Date().toISOString().split('T')[0],
          olaUberEarnings: res.earnings,
          commissionDeducted: res.commission,
          fastTagCharge: 950,
          rtoFine: 0,
          privateTollCharges: res.tolls || 200,
          anyOtherCharges: 0,
          netPayable: res.earnings - res.commission - 950 - (res.tolls || 200),
          status: 'PENDING'
        };
      });

      setSettlements(prev => [...newSettlements, ...prev]);
      setAiInsight(`Deciphered ${results.length} records. Intelligent ledger reconciliation complete.`);
      setActiveStep('ledger');
    } catch (error) {
      console.error("AI Analysis failed:", error);
      alert("Failed to process data via Gemini AI.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-cyan-500 font-black text-[9px] uppercase tracking-[0.3em] mb-1.5">Financial Gateway</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Settlement Portal</h2>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-white/5">
           <TabBtn active={activeStep === 'upload'} onClick={() => setActiveStep('upload')}>Audit Upload</TabBtn>
           <TabBtn active={activeStep === 'ledger'} onClick={() => setActiveStep('ledger')}>Payable Ledger</TabBtn>
        </div>
      </div>

      {aiInsight && (
        <div className="bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-500/20 p-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2 duration-500">
          <div className="p-2 bg-cyan-500 rounded-lg text-white shadow-lg shadow-cyan-500/20">
            <Sparkles size={16} />
          </div>
          <p className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">{aiInsight}</p>
        </div>
      )}

      {activeStep === 'upload' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-950 p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/5 flex flex-col items-center justify-center text-center space-y-8 hover:border-cyan-500/30 hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-all group cursor-pointer shadow-xl">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-400 dark:text-slate-700 group-hover:text-cyan-500 group-hover:scale-105 transition-all border border-slate-200 dark:border-white/5">
              <FileUp size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Sync Platform Data</h3>
              <p className="text-slate-500 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-2 max-w-xs mx-auto leading-relaxed">Gemini AI will automatically parse earnings logs and calculate net payables.</p>
            </div>
            <button 
              disabled={isUploading}
              onClick={handleProcess}
              className="bg-slate-900 dark:bg-white text-white dark:text-black px-12 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-2xl hover:bg-cyan-500 hover:text-white disabled:bg-slate-300 dark:disabled:bg-slate-800 transition-all flex items-center gap-3"
            >
              {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing via Gemini...
                </>
              ) : 'Start Batch Processing'}
            </button>
          </div>

          <div className="bg-white dark:bg-slate-950 p-12 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><TrendingUp size={18} /></div>
                <h3 className="text-lg font-black italic uppercase text-slate-900 dark:text-white tracking-tighter">Incentive Matrix</h3>
              </div>
              <div className="space-y-3">
                <IncentiveTier range="60-69 TRIPS" amount="₹1,300" />
                <IncentiveTier range="70-79 TRIPS" amount="₹1,600" />
                <IncentiveTier range="80-99 TRIPS" amount="₹2,000" />
                <IncentiveTier range="115+ TRIPS" amount="₹3,800" active />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden">
           <table className="w-full text-left">
             <thead>
               <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/5">
                 <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Operator</th>
                 <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Gross Yield</th>
                 <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Liabilities</th>
                 <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Net Payable</th>
                 <th className="px-8 py-5 text-center text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Audit Export</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-200 dark:divide-white/5">
               {settlements.map(s => {
                 const driver = drivers.find(d => d.id === s.driverId);
                 const deductions = s.commissionDeducted + s.fastTagCharge + s.rtoFine + s.privateTollCharges;
                 return (
                   <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all group">
                     <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-600 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors border border-slate-200 dark:border-white/5 font-black text-sm uppercase">
                           {driver?.name.charAt(0)}
                         </div>
                         <div>
                           <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{driver?.name}</p>
                           <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-tighter mt-1">{s.vehRegNumber}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-8 py-6 text-right font-black text-xs text-slate-600 dark:text-slate-300">₹{s.olaUberEarnings.toLocaleString()}</td>
                     <td className="px-8 py-6 text-right font-bold text-xs text-rose-500">-₹{deductions.toLocaleString()}</td>
                     <td className="px-8 py-6 text-right font-black text-sm text-cyan-600 dark:text-cyan-500">₹{s.netPayable.toLocaleString()}</td>
                     <td className="px-8 py-6 text-center">
                       <button className="bg-slate-100 dark:bg-slate-900 hover:bg-cyan-600 text-slate-500 dark:text-slate-400 hover:text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/5 transition-all flex items-center gap-2 mx-auto">
                         <Printer size={14} /> Audit Print
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

// Fixed: Made children optional to resolve TS error where children are reported as missing.
const TabBtn = ({ children, active, onClick }: { children?: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white dark:bg-slate-800 text-black dark:text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
  >
    {children}
  </button>
);

const IncentiveTier = ({ range, amount, active }: { range: string, amount: string, active?: boolean }) => (
  <div className={`flex justify-between items-center p-4 rounded-xl border transition-all ${active ? 'bg-cyan-600 border-cyan-400 shadow-[0_0_20px_rgba(8,145,178,0.2)]' : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 group hover:border-slate-300 dark:hover:border-white/10'}`}>
    <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-slate-500'}`}>{range}</span>
    <div className="flex items-center gap-2">
      {active && <Zap size={14} className="text-white" />}
      <span className={`text-[11px] font-black ${active ? 'text-white' : 'text-cyan-600 dark:text-cyan-500'}`}>{amount} <span className="text-[9px] opacity-70">BONUS</span></span>
    </div>
  </div>
);

export default BillingInvoice;
