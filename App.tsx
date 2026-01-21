
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
  ShieldAlert
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
  // Persistence logic for login session
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('arkflow_session');
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
      localStorage.setItem('arkflow_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('arkflow_session');
    }
  }, [user]);

  const stats = useMemo(() => {
    return {
      totalDrivers: drivers.length,
      activeDrivers: drivers.filter(d => d.status === DriverStatus.ACTIVE).length,
      totalRevenue: settlements.reduce((acc, s) => acc + s.olaUberEarnings, 0),
      totalMaintenance: vehicles.reduce((acc, v) => acc + v.maintenanceCost, 0),
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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
          <div className="bg-amber-500 p-2 rounded-lg">
            <Car className="w-6 h-6 text-slate-900" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">ArkFlow</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18}/>} label="Dashboard" />
          <NavItem active={activeTab === 'drivers'} onClick={() => setActiveTab('drivers')} icon={<Users size={18}/>} label="Drivers" />
          <NavItem active={activeTab === 'vehicles'} onClick={() => setActiveTab('vehicles')} icon={<Wrench size={18}/>} label="Vehicles" />
          <NavItem active={activeTab === 'settlements'} onClick={() => setActiveTab('settlements')} icon={<FileText size={18}/>} label="Billing & Invoices" />
          <NavItem active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<BarChart3 size={18}/>} label="Business Reports" />
        </nav>

        <div className="p-4 border-t border-slate-800 mt-auto">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 p-3 mb-2 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'}`}
          >
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center border border-slate-700 text-slate-900 font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white truncate max-w-[100px]">{user.name}</p>
              <div className="flex items-center gap-1">
                <ShieldAlert size={10} className="text-amber-500" />
                <p className="text-[10px] text-slate-500 uppercase font-black">{user.role}</p>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => {
              localStorage.removeItem('arkflow_session');
              setUser(null);
            }} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-xl w-96 border border-slate-200">
            <Search className="text-slate-400" size={18} />
            <input type="text" placeholder="Global search..." className="bg-transparent border-none focus:outline-none text-sm w-full" />
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg border border-green-100">
               <ShieldCheck className="text-green-600" size={14} />
               <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Authorized CRMS Session</span>
             </div>
          </div>
        </header>

        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-amber-500 text-slate-900 font-bold shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);

export default App;
