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
  Settings,
  Bell,
  Activity,
  Link as LinkIcon,
  UserCheck,
  CreditCard
} from 'lucide-react';
import { Driver, RentalModel, DriverStatus, SettlementRecord, Vehicle, User, UserRole } from './types';
import Dashboard from './components/Dashboard';
import DriverManagement from './components/DriverManagement';
import VehicleManagement from './components/VehicleManagement';
import DriverVehicleMapping from './components/DriverVehicleMapping';
import BillingInvoice from './components/BillingInvoice';
import Reports from './components/Reports';
import UserManagement from './components/UserManagement';
import Login from './components/Login';

const SESSION_KEY = 'arkflow_v3_session';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { 
      id: 'v1', regNo: 'MH-12-AB-1234', registrationDate: '2022-01-10', chasisNumber: 'CHAS998877', 
      make: 'Maruti', model: 'Dzire', purchaseDate: '2022-01-05', insuranceStartDate: '2023-01-10',
      insuranceEndDate: '2024-01-10', insuranceCompany: 'HDFC Ergo', pucExpiryDate: '2024-07-10',
      fastTagDetails: 'FT-001928', status: 'ACTIVE', odometerReading: 45000, odometerReadingDate: '2024-03-20',
      maintenanceHistory: [],
      // Added missing properties required by Vehicle interface
      maintenanceCost: 0,
      rentalExpenses: {
        fastTag: 0,
        rtoFines: 0,
        accident: 0
      }
    }
  ]);

  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: 'd1', driverId: 'DRV-101', name: 'Rahul Sharma', phone: '9876543210', dob: '1990-05-15',
      licenseNumber: 'DL-MH12-2022-001', aadharNumber: '123456789012', panNumber: 'ABCDE1234F',
      permanentAddress: '123, Main St', state: 'Maharashtra', city: 'Pune', villageName: 'Kothrud',
      status: DriverStatus.ACTIVE, onboardedAt: '2023-10-01', assignedVehicleReg: 'MH-12-AB-1234',
      paymentModel: RentalModel.DAILY
    }
  ]);

  const [settlements, setSettlements] = useState<SettlementRecord[]>([]);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  if (!user || !user.isAuthenticated) {
    return <Login onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={{}} drivers={drivers} settlements={settlements} />;
      case 'users': return <UserManagement />;
      case 'drivers': return <DriverManagement drivers={drivers} setDrivers={setDrivers} />;
      case 'vehicles': return <VehicleManagement vehicles={vehicles} setVehicles={setVehicles} />;
      case 'mapping': return <DriverVehicleMapping drivers={drivers} vehicles={vehicles} setDrivers={setDrivers} />;
      case 'billing': return <BillingInvoice drivers={drivers} settlements={settlements} setSettlements={setSettlements} />;
      case 'reports': return <Reports drivers={drivers} settlements={settlements} vehicles={vehicles} />;
      default: return <Dashboard stats={{}} drivers={drivers} settlements={settlements} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-slate-900 font-sans">
      <aside className="w-80 bg-slate-950 text-white flex flex-col shrink-0">
        <div className="p-8 flex items-center gap-4">
          <div className="bg-indigo-600 p-2.5 rounded-2xl">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none italic">ARKFLOW <span className="text-indigo-500">CRMS</span></h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Operational Module v3.0</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          <SectionTitle>Core Administration</SectionTitle>
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18}/>} label="Executive Dashboard" />
          {user.role === 'ADMIN' && <NavItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<UserCheck size={18}/>} label="User Management" />}
          
          <SectionTitle>Fleet Operations</SectionTitle>
          <NavItem active={activeTab === 'drivers'} onClick={() => setActiveTab('drivers')} icon={<Users size={18}/>} label="Driver Management" />
          <NavItem active={activeTab === 'vehicles'} onClick={() => setActiveTab('vehicles')} icon={<Car size={18}/>} label="Vehicle Management" />
          <NavItem active={activeTab === 'mapping'} onClick={() => setActiveTab('mapping')} icon={<LinkIcon size={18}/>} label="Driver-Vehicle Mapping" />
          
          <SectionTitle>Finance & Analysis</SectionTitle>
          <NavItem active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} icon={<CreditCard size={18}/>} label="Billing & Invoice" />
          <NavItem active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<BarChart3 size={18}/>} label="Key Business Reports" />
        </nav>

        <div className="p-6 border-t border-white/5 bg-slate-900/40">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-white font-black">{user.firstName.charAt(0)}</div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase">{user.role}</p>
            </div>
          </div>
          <button onClick={() => setUser(null)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-xs font-bold">
            <LogOut size={14} /> Exit System
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-10 py-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 capitalize tracking-tight">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl border border-green-100">
               <ShieldCheck className="text-green-600" size={16} />
               <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Validated Session</span>
            </div>
            <Bell size={20} className="text-slate-400" />
          </div>
        </header>
        <div className="p-10 max-w-[1600px] mx-auto animate-in fade-in duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const SectionTitle = ({children}: {children: React.ReactNode}) => (
  <p className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{children}</p>
);

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group ${active ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
  >
    <span className={`${active ? 'text-white' : 'group-hover:text-indigo-500'}`}>{icon}</span>
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

export default App;