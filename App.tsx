
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  FileText, 
  Car, 
  LogOut,
  BarChart3,
  Search,
  ShieldCheck,
  Wrench,
  User as UserIcon,
  ShieldAlert,
  Settings,
  Bell,
  Activity
} from 'lucide-react';
import { Driver, RentalModel, DriverStatus, SettlementRecord, Vehicle, User } from './types';
import Dashboard from './components/Dashboard';
import DriverManagement from './components/DriverManagement';
import SettlementSystem from './components/SettlementSystem';
import VehicleManagement from './components/VehicleManagement';
import Reports from './components/Reports';
import Login from './components/Login';
import UserProfile from './components/UserProfile';

const SESSION_KEY = 'arkflow_v2_session'; // Changed key to force new login

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'drivers' | 'settlements' | 'vehicles' | 'reports' | 'profile'>('dashboard');
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'v1', regNo: 'MH-12-AB-1234', model: 'Maruti Dzire', year: 2022, maintenanceCost: 5000, rentalExpenses: { fastTag: 1200, rtoFines: 0, accident: 0 }, status: 'ACTIVE' },
    { id: 'v2', regNo: 'MH-12-XY-9000', model: 'Hyundai Xcent', year: 2021, maintenanceCost: 3500, rentalExpenses: { fastTag: 800, rtoFines: 500, accident: 0 }, status: 'ACTIVE' },
    { id: 'v3', regNo: 'MH-12-CC-4444', model: 'Toyota Etios', year: 2023, maintenanceCost: 0, rentalExpenses: { fastTag: 0, rtoFines: 0, accident: 0 }, status: 'IDLE' }
  ]);

  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: '1',
      name: 'Rahul Sharma',
      phone: '+91 9876543210',
      carRegNo: 'MH-12-AB-1234',
      vehicleId: 'v1',
      rentalModel: RentalModel.DAILY,
      status: DriverStatus.ACTIVE,
      bankDetails: 'SBI - 123456789',
      documents: ['Aadhar.pdf'],
      onboardedAt: '2023-10-01'
    }
  ]);

  const [settlements, setSettlements] = useState<SettlementRecord[]>([
    {
      id: 's1',
      driverId: '1',
      weekEnding: '2023-11-20',
      olaUberEarnings: 15400,
      fastTagCharges: 450,
      rtoFines: 0,
      tollTax: 200,
      commissionDeducted: 3080,
      netPayable: 11670,
      status: 'SETTLED'
    }
  ]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  const stats = useMemo(() => ({
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter(d => d.status === DriverStatus.ACTIVE).length,
    totalRevenue: settlements.reduce((acc, s) => acc + s.olaUberEarnings, 0),
    totalMaintenance: vehicles.reduce((acc, v) => acc + v.maintenanceCost, 0),
    totalExpenses: vehicles.reduce((acc, v) => acc + v.rentalExpenses.fastTag + v.rentalExpenses.rtoFines + v.rentalExpenses.accident, 0),
    pendingSettlements: settlements.filter(s => s.status === 'PENDING').length
  }), [drivers, settlements, vehicles]);

  if (!user || !user.isAuthenticated) {
    return <Login onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={stats} drivers={drivers} settlements={settlements} />;
      case 'drivers': return <DriverManagement drivers={drivers} setDrivers={setDrivers} vehicles={vehicles} />;
      case 'settlements': return <SettlementSystem drivers={drivers} settlements={settlements} setSettlements={setSettlements} />;
      case 'vehicles': return <VehicleManagement vehicles={vehicles} setVehicles={setVehicles} />;
      case 'reports': return <Reports drivers={drivers} settlements={settlements} vehicles={vehicles} />;
      case 'profile': return <UserProfile user={user} onUpdate={setUser} />;
      default: return <Dashboard stats={stats} drivers={drivers} settlements={settlements} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      <aside className="w-72 bg-indigo-950 text-white flex flex-col shrink-0 shadow-2xl">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-indigo-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tighter leading-none">ARKFLOW <span className="text-indigo-400">v2</span></h1>
            <p className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest mt-1">Enterprise Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 py-3 text-[10px] font-black text-indigo-300/30 uppercase tracking-[0.2em]">Management</p>
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18}/>} label="Executive Summary" />
          <NavItem active={activeTab === 'drivers'} onClick={() => setActiveTab('drivers')} icon={<Users size={18}/>} label="Driver Fleet" />
          <NavItem active={activeTab === 'vehicles'} onClick={() => setActiveTab('vehicles')} icon={<Car size={18}/>} label="Vehicle Assets" />
          
          <div className="py-4"></div>
          <p className="px-4 py-3 text-[10px] font-black text-indigo-300/30 uppercase tracking-[0.2em]">Finance & Stats</p>
          <NavItem active={activeTab === 'settlements'} onClick={() => setActiveTab('settlements')} icon={<FileText size={18}/>} label="Settlements" />
          <NavItem active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<BarChart3 size={18}/>} label="Insights & BI" />
        </nav>

        <div className="p-6 border-t border-white/5 bg-indigo-900/20">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-indigo-500/20 ring-1 ring-indigo-400/30' : 'hover:bg-white/5'}`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-black shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[9px] text-indigo-300/70 uppercase font-black">{user.role}</p>
            </div>
          </button>
          <button 
            onClick={() => setUser(null)}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl text-indigo-300 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs font-bold"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-10 py-5 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h2 className="text-lg font-bold text-slate-800 capitalize tracking-tight">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-xl border border-indigo-100">
               <ShieldCheck className="text-indigo-600" size={16} />
               <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Active v2 Session</span>
             </div>
          </div>
        </header>

        <div className="p-10 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl transition-all group ${active ? 'bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-600/20' : 'text-indigo-200/50 hover:bg-white/5 hover:text-white'}`}
  >
    <span className={`${active ? 'text-white' : 'group-hover:text-indigo-400'} transition-colors`}>{icon}</span>
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

export default App;
