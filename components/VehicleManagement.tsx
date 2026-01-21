
import React, { useState } from 'react';
import { Plus, Search, Car, Wrench, AlertCircle, TrendingUp } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleManagementProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
}

const VehicleManagement: React.FC<VehicleManagementProps> = ({ vehicles, setVehicles }) => {
  const [showModal, setShowModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    regNo: '',
    model: '',
    year: new Date().getFullYear(),
    maintenanceCost: 0,
    rentalExpenses: { fastTag: 0, rtoFines: 0, accident: 0 },
    status: 'IDLE'
  });

  const handleAdd = () => {
    if (newVehicle.regNo && newVehicle.model) {
      setVehicles([...vehicles, { ...newVehicle, id: Date.now().toString() } as Vehicle]);
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Vehicle Management</h2>
          <p className="text-slate-500">Master fleet data, maintenance tracking, and rental expenses.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg"
        >
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Fleet</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{vehicles.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Vehicles</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{vehicles.filter(v => v.status === 'ACTIVE').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Maintenance Cost</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">₹{vehicles.reduce((acc, v) => acc + v.maintenanceCost, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Registration & Model</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Maint. Cost</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">FastTag / Fines</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total Expenses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vehicles.map(v => (
              <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                      <Car size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{v.regNo}</p>
                      <p className="text-xs text-slate-500">{v.model} ({v.year})</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${v.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-slate-700">₹{v.maintenanceCost}</td>
                <td className="px-6 py-4 text-right text-sm text-slate-500">
                  <div className="flex flex-col items-end">
                    <span>Tag: ₹{v.rentalExpenses.fastTag}</span>
                    <span className="text-red-500">Fine: ₹{v.rentalExpenses.rtoFines}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                  ₹{(v.maintenanceCost + v.rentalExpenses.fastTag + v.rentalExpenses.rtoFines + v.rentalExpenses.accident).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-900 text-white">
              <h3 className="text-xl font-bold">New Vehicle Entry</h3>
              <p className="text-slate-400 text-sm">Add vehicle to CRMS master data.</p>
            </div>
            <div className="p-8 space-y-4">
              <input 
                placeholder="Reg No (e.g. MH-12-XX-0000)" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                onChange={e => setNewVehicle({...newVehicle, regNo: e.target.value})}
              />
              <input 
                placeholder="Model Name" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
              />
              <div className="flex gap-4">
                <input 
                  type="number" 
                  placeholder="Year" 
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                  onChange={e => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})}
                />
                <select 
                   className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                   onChange={e => setNewVehicle({...newVehicle, status: e.target.value as any})}
                >
                  <option value="IDLE">Idle</option>
                  <option value="ACTIVE">Active</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 text-slate-500 font-bold">Cancel</button>
              <button onClick={handleAdd} className="bg-amber-500 text-slate-900 px-8 py-2 rounded-xl font-bold shadow-lg shadow-amber-500/20">Save Vehicle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
