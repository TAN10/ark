
import React, { useState } from 'react';
import { FileUp, Download, CheckCircle2, AlertCircle, Sparkles, ReceiptText } from 'lucide-react';
import { Driver, SettlementRecord } from '../types';
import { analyzeReport } from '../services/geminiService';

interface SettlementSystemProps {
  drivers: Driver[];
  settlements: SettlementRecord[];
  setSettlements: React.Dispatch<React.SetStateAction<SettlementRecord[]>>;
}

const SettlementSystem: React.FC<SettlementSystemProps> = ({ drivers, settlements, setSettlements }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [geminiAdvice, setGeminiAdvice] = useState<string | null>(null);

  const simulateUpload = async () => {
    setIsProcessing(true);
    // In a real app, you'd read a file. Here we simulate a CSV parse.
    const mockCsv = "Rahul Sharma, 15000, 3000\nAmit Patel, 12000, 2400";
    
    try {
      const results = await analyzeReport(mockCsv);
      
      const newSettlements: SettlementRecord[] = results.map((res: any) => {
        const driver = drivers.find(d => d.name === res.driverName);
        return {
          id: Math.random().toString(36).substr(2, 9),
          driverId: driver?.id || 'unknown',
          weekEnding: new Date().toISOString().split('T')[0],
          olaUberEarnings: res.earnings,
          commissionDeducted: res.commission,
          fastTagCharges: 500, // Simulated default
          rtoFines: 0,
          tollTax: 100,
          netPayable: res.earnings - res.commission - 500 - 100,
          status: 'PENDING'
        };
      });

      setSettlements(prev => [...newSettlements, ...prev]);
      setGeminiAdvice("I've noticed a 15% increase in tolls for Rahul Sharma this week. Consider reviewing the preferred routes.");
    } catch (error) {
      console.error("Gemini failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Weekly Settlements</h2>
          <p className="text-slate-500">The "Monday Routine": Process earnings, fines, and final billing.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={18} />
            Export Master Sheet
          </button>
          <button 
            disabled={isProcessing}
            onClick={simulateUpload}
            className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50"
          >
            <FileUp size={20} />
            {isProcessing ? 'Processing...' : 'Upload OLA/UBER Report'}
          </button>
        </div>
      </div>

      {geminiAdvice && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-4 items-start">
          <div className="bg-amber-500 p-2 rounded-lg text-white">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900">AI Settlement Intelligence</h4>
            <p className="text-sm text-amber-800 mt-1">{geminiAdvice}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Driver / Vehicle</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Earnings</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Commission</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Tolls/Fines</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Net Payable</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {settlements.map(s => {
              const driver = drivers.find(d => d.id === s.driverId);
              const totalDeductions = s.fastTagCharges + s.tollTax + s.rtoFines;
              return (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{driver?.name || 'Unknown Driver'}</p>
                    <p className="text-xs text-slate-500">{driver?.carRegNo || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                    ₹{s.olaUberEarnings.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-red-500">
                    -₹{s.commissionDeducted.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-red-500">
                    <div className="flex flex-col items-end">
                      <span>-₹{totalDeductions.toLocaleString()}</span>
                      {s.rtoFines > 0 && <span className="text-[10px] bg-red-50 text-red-600 px-1 rounded font-bold">INCLUDES RTO FINE</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-green-600">
                    ₹{s.netPayable.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      {s.status === 'SETTLED' ? (
                        <span className="flex items-center gap-1 text-green-600 text-[10px] font-bold bg-green-50 px-2 py-1 rounded-full border border-green-200 uppercase">
                          <CheckCircle2 size={12} /> Settled
                        </span>
                      ) : (
                        <button className="flex items-center gap-1 text-amber-600 text-[10px] font-bold bg-amber-50 px-2 py-1 rounded-full border border-amber-200 uppercase hover:bg-amber-100 transition-colors">
                          <ReceiptText size={12} /> Pay Now
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettlementSystem;
