
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Plus, 
  TrendingUp, 
  AlertCircle, 
  Car, 
  Clock,
  LogOut,
  BarChart3,
  Search
} from 'lucide-react';
import { Driver, RentalModel, DriverStatus, SettlementRecord } from './types';
import Dashboard from './components/Dashboard';
import DriverManagement from './components/DriverManagement';
import SettlementSystem from './components/SettlementSystem';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'drivers' | 'settlements'>('dashboard');
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: '1',
      name: 'Rahul Sharma',
      phone: '+91 9876543210',
      carRegNo: 'MH-12-AB-1234',
      rentalModel: RentalModel.DAILY,
      status: DriverStatus.ACTIVE,
      bankDetails: 'SBI - 123456789',
      documents: ['Aadhar.pdf', 'License.pdf'],
      onboardedAt: '2023-10-01'
    },
    {
      id: '2',
      name: 'Amit Patel',
      phone: '+91 9123456789',
      carRegNo: 'MH-12-XY-9000',
      rentalModel: RentalModel.COMMISSION,
      status: DriverStatus.ACTIVE,
      bankDetails: 'HDFC - 987654321',
      documents: ['Aadhar.pdf', 'Pan.pdf'],
      onboardedAt: '2023-11-15'
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

  const stats = useMemo(() => {
    return {
      totalDrivers: drivers.length,
      activeDrivers: drivers.filter(d => d.status === DriverStatus.ACTIVE).length,
      totalRevenue: settlements.reduce((acc, s) => acc + s.olaUberEarnings, 0),
      pendingSettlements: settlements.filter(s => s.status === 'PENDING').length
    };
  }, [drivers, settlements]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} drivers={drivers} settlements={settlements} />;
      case 'drivers':
        return <DriverManagement drivers={drivers} setDrivers={setDrivers} />;
      case 'settlements':
        return <SettlementSystem drivers={drivers} settlements={settlements} setSettlements={setSettlements} />;
      default:
        return <Dashboard stats={stats} drivers={drivers} settlements={settlements} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-amber-500 p-2 rounded-lg">
            <Car className="w-6 h-6 text-slate-900" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">ArkFlow</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-amber-500 text-slate-900 font-semibold shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'drivers' ? 'bg-amber-500 text-slate-900 font-semibold shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={20} />
            Drivers
          </button>
          <button
            onClick={() => setActiveTab('settlements')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settlements' ? 'bg-amber-500 text-slate-900 font-semibold shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText size={20} />
            Settlements
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white cursor-pointer transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-lg w-96">
            <Search className="text-slate-400" size={18} />
            <input type="text" placeholder="Search drivers, cars, or records..." className="bg-transparent border-none focus:outline-none text-sm w-full" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 border border-slate-300">
              AS
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Ark Operator</p>
              <p className="text-xs text-slate-500">Fleet Management</p>
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

export default App;
