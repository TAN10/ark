
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Car, 
  LogOut,
  BarChart3,
  Activity,
  Link as LinkIcon,
  UserCheck,
  CreditCard,
  Settings as SettingsIcon,
  Sun,
  Moon,
  CloudLightning
} from 'lucide-react';
import { Driver, RentalModel, DriverStatus, SettlementRecord, Vehicle, User } from './types';
import { cloudService } from './services/cloudService';
import Dashboard from './components/Dashboard';
import DriverManagement from './components/DriverManagement';
import VehicleManagement from './components/VehicleManagement';
import DriverVehicleMapping from './components/DriverVehicleMapping';
import BillingInvoice from './components/BillingInvoice';
import Reports from './components/Reports';
import UserManagement from './components/UserManagement';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import SettingsView from './components/SettingsView';
import NotificationsView from './components/NotificationsView';

const SESSION_KEY = 'arkflow_v3_session';
const THEME_KEY = 'arkflow_theme';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'dark';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [settlements, setSettlements] = useState<SettlementRecord[]>([]);

  // Initial Cloud Load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [v, d, s] = await Promise.all([
        cloudService.fetchVehicles([
          { 
            id: 'v1', regNo: 'MH-12-CR-2024', registrationDate: '2024-01-10', chasisNumber: 'XCV998877SH', 
            make: 'Maruti', model: 'Ertiga', purchaseDate: '2024-01-05', insuranceStartDate: '2024-01-10',
            insuranceEndDate: '2024-12-30', insuranceCompany: 'Tata AIG', pucExpiryDate: '2024-12-10',
            fastTagDetails: 'FT-991022', status: 'ACTIVE', odometerReading: 12450, odometerReadingDate: '2024-05-20',
            maintenanceHistory: [], maintenanceCost: 4500,
            rentalExpenses: { fastTag: 1200, rtoFines: 0, accident: 0 }
          }
        ]),
        cloudService.fetchDrivers([
          {
            id: 'd1', driverId: 'DRV-101', name: 'Arjun Mehra', phone: '9811223344', dob: '1988-05-15',
            licenseNumber: 'DL-MH12-2022-001', aadharNumber: '112233445566', panNumber: 'ABCDE1122F',
            permanentAddress: 'Kothrud, Pune', state: 'Maharashtra', city: 'Pune', villageName: 'Kothrud',
            status: DriverStatus.ACTIVE, onboardedAt: '2023-10-01', assignedVehicleReg: 'MH-12-CR-2024',
            paymentModel: RentalModel.DAILY
          }
        ]),
        cloudService.fetchSettlements()
      ]);
      setVehicles(v);
      setDrivers(d);
      setSettlements(s);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const stats = useMemo(() => {
    const totalRev = settlements.reduce((acc, s) => acc + (s.olaUberEarnings || 0), 0);
    const totalExp = settlements.reduce((acc, s) => 
      acc + (s.commissionDeducted || 0) + (s.fastTagCharge || 0) + (s.rtoFine || 0) + (s.privateTollCharges || 0), 0);
    
    return {
      totalDrivers: drivers.length,
      activeDrivers: drivers.filter(d => d.status === DriverStatus.ACTIVE).length,
      totalRevenue: totalRev,
      totalExpenses: totalExp,
      activeFleetCount: vehicles.filter(v => v.status === 'ACTIVE').length
    };
  }, [drivers, settlements, vehicles]);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (!user || !user.isAuthenticated) {
    return <Login onLogin={setUser} />;
  }

  const renderContent = () => {
    if (isLoading) return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-slate-400">
        <Activity size={48} className="animate-pulse text-cyan-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Establishing Vercel Node...</p>
      </div>
    );

    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={stats} drivers={drivers} settlements={settlements} />;
      case 'users': return <UserManagement />;
      case 'drivers': return <DriverManagement drivers={drivers} setDrivers={setDrivers} />;
      case 'vehicles': return <VehicleManagement vehicles={vehicles} setVehicles={setVehicles} />;
      case 'mapping': return <DriverVehicleMapping drivers={drivers} vehicles={vehicles} setDrivers={setDrivers} />;
      case 'billing': return <BillingInvoice drivers={drivers} settlements={settlements} setSettlements={setSettlements} />;
      case 'reports': return <Reports drivers={drivers} settlements={settlements} vehicles={vehicles} />;
      case 'profile': return <UserProfile user={user} onUpdate={(u) => setUser({...user, ...u})} />;
      case 'settings': return <SettingsView isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case 'notifications': return <NotificationsView vehicles={vehicles} settlements={settlements} />;
      default: return <Dashboard stats={stats} drivers={drivers} settlements={settlements} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#020617] overflow-hidden text-slate-900 dark:text-slate-100 font-sans selection:bg-cyan-500/30">
      <aside className="w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/5 flex flex-col shrink-0">
        <div className="p-8 flex items-center gap-4">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            <CloudLightning className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-none italic uppercase text-slate-900 dark:text-white">ARKFLOW</h1>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1.5">Vercel Postgres</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-hide">
          <SectionTitle>Navigation</SectionTitle>
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18}/>} label="Dashboard" />
          {user.role === 'ADMIN' && <NavItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<UserCheck size={18}/>} label="Operators" />}
          
          <SectionTitle>Fleet</SectionTitle>
          <NavItem active={activeTab === 'drivers'} onClick={() => setActiveTab('drivers')} icon={<Users size={18}/>} label="Drivers" />
          <NavItem active={activeTab === 'vehicles'} onClick={() => setActiveTab('vehicles')} icon={<Car size={18}/>} label="Vehicles" />
          <NavItem active={activeTab === 'mapping'} onClick={() => setActiveTab('mapping')} icon={<LinkIcon size={18}/>} label="Assignments" />
          
          <SectionTitle>Finance</SectionTitle>
          <NavItem active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} icon={<CreditCard size={18}/>} label="Billing" />
          <NavItem active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<BarChart3 size={18}/>} label="Analytics" />
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/20">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-4 mb-4 w-full text-left p-2 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-slate-200 dark:hover:bg-white/5'}`}
          >
            <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black border border-slate-300 dark:border-white/5">
              {user.firstName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate text-slate-900 dark:text-white uppercase tracking-tight">{user.firstName} {user.lastName}</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{user.role}</p>
            </div>
          </button>
          <button 
            onClick={() => setUser(null)} 
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-slate-500 hover:bg-rose-500/10 hover:text-rose-600 transition-all text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto flex flex-col bg-white dark:bg-[#020617]">
        <header className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 sticky top-0 z-40 px-10 py-4 flex justify-between items-center">
          <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h2>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div> Vercel Ready</span>
            </div>
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-white/10 ml-4 pl-4">
              <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg transition-all">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setActiveTab('settings')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg transition-all">
                <SettingsIcon size={18} />
              </button>
            </div>
          </div>
        </header>
        <div className="p-10 max-w-[1400px] mx-auto w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const SectionTitle = ({children}: {children?: React.ReactNode}) => (
  <p className="px-5 py-4 text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">{children}</p>
);

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3.5 px-5 py-3 rounded-xl transition-all group ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900'}`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>{icon}</span>
    <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
