
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
  Bell
} from 'lucide-react';
import { Driver, RentalModel, DriverStatus, SettlementRecord, Vehicle, User } from './types';
import Dashboard from './components/Dashboard';
import DriverManagement from './components/DriverManagement';
import SettlementSystem from './components/SettlementSystem';
import VehicleManagement from './components/VehicleManagement';
import Reports from './components/Reports';
import Login from './components/Login';
import UserProfile from './components/UserProfile';

const App: React.FC = () => {
  // Persistence logic for CRMS session
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('arkflow_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'drivers' | 'settlements' | 'vehicles' | 'reports' | 'profile'>('dashboard');
  
  // Fleet Master Data (Vehicle Management Module)
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'v1', regNo: 'MH-12-AB-1234', model: 'Maruti Dzire', year: 2022, maintenanceCost: 5000, rentalExpenses: { fastTag: 1200, rtoFines: 0, accident: 0 }, status: 'ACTIVE' },
    { id: 'v2', regNo: 'MH-12-XY-9000', model: 'Hyundai Xcent', year: 2021, maintenanceCost: 3500, rentalExpenses: { fastTag: 800, rtoFines: 500, accident: 0 }, status: 'ACTIVE' },
    { id: 'v3', regNo: 'MH-12-CC-4444', model: 'Toyota Etios', year: 2023, maintenanceCost: 0, rentalExpenses: { fastTag: 0, rtoFines: 0, accident: 0 }, status: 'IDLE' }
  ]);

  // Driver Master Data (Driver Management Module)
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

  // Settlement Data (Billing & Invoice Module)
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
      localStorage.setItem('arkflow_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('arkflow_session');
    }
  }, [user]);

  // Key Business Reports Calculation logic
  const stats = useMemo(() => {
    return {
      totalDrivers: drivers.length,
      activeDrivers: drivers.filter(d => d.status === DriverStatus.ACTIVE).length,
      totalRevenue: settlements.reduce((acc, s) => acc + s.olaUberEarnings, 0),
      totalMaintenance: vehicles.reduce((acc, v) => acc + v.maintenanceCost, 0),
      totalExpenses: vehicles.reduce((acc, v) => acc + v.rentalExpenses.fastTag + v.rentalExpenses.rtoFines + v.rentalExpenses.accident, 0),
      pendingSettlements: settlements.filter(s => s.status === 'PENDING').length
    };
  }, [drivers, settlements, vehicles]);

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
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden text-[#0f172a]">
      {/* Sidebar - Matching CRMS Module Requirements */}
      <aside className="w-72 bg-slate-950 text-white flex flex-col shrink-0">
        <div className="p-8 pb-4 flex items-center gap-3">
          <div className="bg-amber-500 p-2 rounded-xl shadow-lg shadow-amber-500/20">
            <Car className="w-7 h-7 text-slate-950" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter italic leading-none">ARKFLOW</h1>
            <p className="text-[10px] font-bold text-amber-500/80 tracking-widest uppercase mt-1">CRMS System</p>
          </div>
        </div>

        <div className="px-6 py-4">
           <div className="h-px bg-white/5 w-full"></div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Operations</p>
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18}/>} label="Fleet Overview" />
          <NavItem active={activeTab === 'drivers'} onClick={() => setActiveTab('drivers')} icon={<Users size={18}/>} label="Driver Management" />
          <NavItem active={activeTab === 'vehicles'} onClick={() => setActiveTab('vehicles')} icon={<Wrench size={18}/>} label="Vehicle Management" />
          
          <div className="py-2"></div>
          <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Finances & Data</p>
          <NavItem active={activeTab === 'settlements'} onClick={() => setActiveTab('settlements')} icon={<FileText size={18}/>} label="Billing & Invoice" />
          <NavItem active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<BarChart3 size={18}/>} label="Key Business Reports" />
        </nav>

        {/* User Profile Management (Document Requirement 1.2) */}
        <div className="p-4 border-t border-white/5 bg-slate-900/50">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all border border-transparent ${activeTab === 'profile' ? 'bg-white/10 border-white/10 ring-1 ring-white/10' : 'hover:bg-white/5'}`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              {user.name.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white truncate max-w-[100px]">{user.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldAlert size={10} className="text-amber-500" />
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider">{user.role}</p>
              </div>
            </div>
          </button>
          
          <div className="flex items-center gap-2 mt-2 px-1">
             <button onClick={() => { localStorage.removeItem('arkflow_session'); setUser(null); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs font-bold">
               <LogOut size={14} />
               Logout
             </button>
             <button onClick={() => setActiveTab('profile')} className="p-2.5 rounded-xl text-slate-500 hover:bg-white/5 hover:text-white transition-all">
                <Settings size={14} />
             </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-10 py-5 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-slate-900 capitalize tracking-tight">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h2>
            <div className="hidden sm:flex items-center gap-3 bg-slate-100 px-4 py-2.5 rounded-2xl w-80 border border-slate-200/60 focus-within:ring-2 focus-within:ring-amber-500/10 focus-within:border-amber-500/50 transition-all">
              <Search className="text-slate-400" size={16} />
              <input type="text" placeholder="Search drivers, vehicles..." className="bg-transparent border-none focus:outline-none text-xs w-full font-medium" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
             </button>
             <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-2xl border border-green-500/20">
               <ShieldCheck className="text-green-600" size={16} />
               <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Secure Session</span>
             </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${active ? 'bg-amber-500 text-slate-950 font-bold shadow-xl shadow-amber-500/20 translate-x-1' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
  >
    <span className={`${active ? 'text-slate-950' : 'text-slate-500 group-hover:text-amber-500'} transition-colors`}>{icon}</span>
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

export default App;
