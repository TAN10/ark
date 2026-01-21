
import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { Driver, RentalModel, DriverStatus } from '../types';

interface DriverManagementProps {
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
}

const DriverManagement: React.FC<DriverManagementProps> = ({ drivers, setDrivers }) => {
  const [showModal, setShowModal] = useState(false);
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    name: '',
    phone: '',
    carRegNo: '',
    rentalModel: RentalModel.DAILY,
    status: DriverStatus.ONBOARDING,
    bankDetails: '',
    documents: [],
    onboardedAt: new Date().toISOString().split('T')[0]
  });

  const handleAddDriver = () => {
    if (newDriver.name && newDriver.phone) {
      const driver: Driver = {
        ...newDriver as Driver,
        id: Math.random().toString(36).substr(2, 9),
      };
      setDrivers(prev => [...prev, driver]);
      setShowModal(false);
      setNewDriver({
        name: '',
        phone: '',
        carRegNo: '',
        rentalModel: RentalModel.DAILY,
        status: DriverStatus.ONBOARDING,
        bankDetails: '',
        documents: [],
        onboardedAt: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Driver Directory</h2>
          <p className="text-slate-500">Manage onboarding, car assignments, and documentation.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-amber-500 text-slate-900 font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
        >
          <Plus size={20} />
          Onboard Driver
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by name, vehicle, or status..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Filters
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Driver Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle Reg No</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Model</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Onboarded</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {drivers.map(driver => (
              <tr key={driver.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{driver.name}</p>
                      <p className="text-xs text-slate-500">{driver.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded">IND</div>
                    <p className="text-sm font-semibold text-slate-700 tracking-wide">{driver.carRegNo}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {driver.rentalModel}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    driver.status === DriverStatus.ACTIVE ? 'bg-green-100 text-green-700' : 
                    driver.status === DriverStatus.ONBOARDING ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {driver.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {driver.onboardedAt}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Onboarding Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900">New Driver Onboarding</h3>
              <p className="text-slate-500 mt-1">Fill in the required details to assign a car and model.</p>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={newDriver.name}
                  onChange={e => setNewDriver({...newDriver, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20" 
                  placeholder="e.g. John Doe" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel" 
                  value={newDriver.phone}
                  onChange={e => setNewDriver({...newDriver, phone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20" 
                  placeholder="+91 00000 00000" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle Reg No</label>
                <input 
                  type="text" 
                  value={newDriver.carRegNo}
                  onChange={e => setNewDriver({...newDriver, carRegNo: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20" 
                  placeholder="MH-XX-XX-XXXX" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rental Model</label>
                <select 
                  value={newDriver.rentalModel}
                  onChange={e => setNewDriver({...newDriver, rentalModel: e.target.value as RentalModel})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value={RentalModel.DAILY}>Daily Rental</option>
                  <option value={RentalModel.COMMISSION}>Commission Based</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bank Details</label>
                <textarea 
                  value={newDriver.bankDetails}
                  onChange={e => setNewDriver({...newDriver, bankDetails: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 min-h-[80px]" 
                  placeholder="Bank Name, Account Number, IFSC Code"
                />
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddDriver}
                className="px-6 py-2.5 rounded-xl font-bold bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
              >
                Complete Onboarding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;
