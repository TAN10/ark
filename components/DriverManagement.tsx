
import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, ShieldCheck, Mail, Phone, Calendar, Link } from 'lucide-react';
import { Driver, RentalModel, DriverStatus, Vehicle } from '../types';

interface DriverManagementProps {
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  vehicles: Vehicle[];
}

const DriverManagement: React.FC<DriverManagementProps> = ({ drivers, setDrivers, vehicles }) => {
  const [showModal, setShowModal] = useState(false);
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    name: '',
    phone: '',
    carRegNo: '',
    vehicleId: '',
    rentalModel: RentalModel.DAILY,
    status: DriverStatus.ONBOARDING,
    bankDetails: '',
    documents: [],
    onboardedAt: new Date().toISOString().split('T')[0]
  });

  const handleAddDriver = () => {
    if (newDriver.name && newDriver.phone) {
      const selectedVehicle = vehicles.find(v => v.id === newDriver.vehicleId);
      const driver: Driver = {
        ...newDriver as Driver,
        id: Math.random().toString(36).substr(2, 9),
        carRegNo: selectedVehicle?.regNo || 'PENDING'
      };
      setDrivers(prev => [...prev, driver]);
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Driver Directory</h2>
          <p className="text-slate-500">Manage onboarding schemes and driver-vehicle mappings.</p>
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
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Driver Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Mapped Vehicle</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Scheme</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {drivers.map(driver => (
              <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900">{driver.name}</p>
                  <p className="text-xs text-slate-500">{driver.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs font-semibold bg-slate-100 px-2 py-1 rounded border border-slate-200 w-fit">
                    <Link size={12} />
                    {driver.carRegNo}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-600 font-medium">{driver.rentalModel}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${driver.status === DriverStatus.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {driver.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-slate-900"><MoreVertical size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-900 text-white">
              <h3 className="text-2xl font-bold">Onboarding & Mapping</h3>
              <p className="text-slate-400">Map a driver to an available vehicle.</p>
            </div>
            <div className="p-8 grid grid-cols-2 gap-6">
              <input placeholder="Driver Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" onChange={e => setNewDriver({...newDriver, name: e.target.value})} />
              <input placeholder="Phone" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" onChange={e => setNewDriver({...newDriver, phone: e.target.value})} />
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                onChange={e => setNewDriver({...newDriver, vehicleId: e.target.value})}
              >
                <option value="">Select Available Vehicle</option>
                {vehicles.filter(v => v.status === 'IDLE').map(v => (
                  <option key={v.id} value={v.id}>{v.regNo} - {v.model}</option>
                ))}
              </select>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                onChange={e => setNewDriver({...newDriver, rentalModel: e.target.value as RentalModel})}
              >
                <option value={RentalModel.DAILY}>Daily Rental Scheme</option>
                <option value={RentalModel.COMMISSION}>Commission Based Scheme</option>
              </select>
            </div>
            <div className="p-8 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 text-slate-500 font-bold">Cancel</button>
              <button onClick={handleAddDriver} className="bg-amber-500 text-slate-900 px-8 py-3 rounded-xl font-bold">Complete Mapping</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;
