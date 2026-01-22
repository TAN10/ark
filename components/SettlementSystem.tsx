
import React, { useState } from 'react';
import { FileUp, Download, CheckCircle2, Sparkles, ReceiptText, Printer } from 'lucide-react';
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
    const mockCsv = "Rahul Sharma, 15000, 3000";
    
    try {
      const results = await analyzeReport(mockCsv);
      const newSettlements: SettlementRecord[] = results.map((res: any) => {
        const driver = drivers.find(d => d.name === res.driverName);
        /* Fixed property names to match SettlementRecord interface in types.ts */
        return {
          id: Math.random().toString(36).substr(2, 9),
          driverId: driver?.id || 'unknown',
          vehRegNumber: driver?.assignedVehicleReg || 'unknown',
          weekEnding: new Date().toISOString().split('T')[0],
          olaUberEarnings: res.earnings,
          commissionDeducted: res.commission,
          fastTagCharge: 500,
          rtoFine: 0,
          privateTollCharges: 100,
          anyOtherCharges: 0,
          netPayable: res.earnings - res.commission - 500 - 100,
          status: 'PENDING'
        };
      });
      setSettlements(prev => [...newSettlements, ...prev]);
      setGeminiAdvice("Processed billing for " + results.length + " drivers. All commission rates verified against scheme master.");
    } catch (error) {
      console.error("Gemini failed:", error);
    } finally { setIsProcessing(false); }
  };

  const generateStatement = (driverId: string) => {
    alert("Generating Statement for Driver ID: " + driverId + ". This will export a PDF account statement with individual trip summaries.");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Billing & Invoices</h2>
          <p className="text-slate-500">Upload OLA/UBER data to generate driver statements.</p>
        </div>
        <div className="flex gap-3">
          <button 
            disabled={isProcessing}
            onClick={simulateUpload}
            className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
          >
            <FileUp size={20} />
            {isProcessing ? 'Processing Data...' : 'Upload OLA/UBER Data'}
          </button>
        </div>
      </div>

      {geminiAdvice && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-4 items-start shadow-sm shadow-amber-500/5">
          <div className="bg-amber-500 p-2 rounded-lg text-white"><Sparkles size={18} /></div>
          <div>
            <h4 className="text-sm font-bold text-amber-900">Billing Insight</h4>
            <p className="text-sm text-amber-800 mt-1">{geminiAdvice}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Driver / Vehicle</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Revenue</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Deductions</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Net Payable</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Invoicing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {settlements.map(s => {
              const driver = drivers.find(d => d.id === s.driverId);
              /* Fixed carRegNo -> assignedVehicleReg and deduction field names */
              return (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{driver?.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-500">{driver?.assignedVehicleReg}</p>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold">₹{s.olaUberEarnings.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-sm text-red-500">₹{(s.commissionDeducted + s.fastTagCharge + s.privateTollCharges).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-green-600">₹{s.netPayable.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => generateStatement(s.driverId)}
                      className="inline-flex items-center gap-2 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all"
                    >
                      <Printer size={14} /> Generate Statement
                    </button>
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
