
import React from 'react';
import { Bell, ShieldAlert, CreditCard, Wrench, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { Vehicle, SettlementRecord } from '../types';

interface NotificationsViewProps {
  vehicles: Vehicle[];
  settlements: SettlementRecord[];
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ vehicles, settlements }) => {
  // Generate some simulated system notifications based on data
  const notifications = [
    ...vehicles.filter(v => {
      const expiry = new Date(v.insuranceEndDate);
      const diff = (expiry.getTime() - new Date().getTime()) / (1000 * 3600 * 24);
      return diff < 30;
    }).map(v => ({
      id: `notif-ins-${v.id}`,
      type: 'compliance',
      title: 'Insurance Expiration Imminent',
      message: `Vehicle ${v.regNo} insurance ends on ${v.insuranceEndDate}. Renew within 7 days to avoid service gap.`,
      time: '2h ago',
      priority: 'high'
    })),
    ...settlements.filter(s => s.status === 'PENDING').map(s => ({
      id: `notif-settle-${s.id}`,
      type: 'finance',
      title: 'Settlement Pending Approval',
      message: `Payout of ₹${s.netPayable.toLocaleString()} for cycle ${s.weekEnding} is awaiting operator validation.`,
      time: '5h ago',
      priority: 'medium'
    })),
    {
      id: 'system-1',
      type: 'security',
      title: 'Global Database Sync Complete',
      message: 'Master audit logs successfully backed up to cold storage node IN-DR-02.',
      time: '12h ago',
      priority: 'low'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Operational Alerts</h2>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1.5">System-wide monitoring and audit stream</p>
      </div>

      <div className="max-w-4xl space-y-4">
        {notifications.length > 0 ? notifications.map((n) => (
          <div 
            key={n.id} 
            className="bg-white dark:bg-slate-950 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-xl hover:border-cyan-500/30 transition-all group flex items-start gap-6"
          >
            <div className={`p-4 rounded-2xl flex-shrink-0 border ${
              n.priority === 'high' ? 'bg-rose-50 dark:bg-rose-900/10 text-rose-500 border-rose-100 dark:border-rose-500/20' :
              n.priority === 'medium' ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-500 border-amber-100 dark:border-amber-500/20' :
              'bg-cyan-50 dark:bg-cyan-900/10 text-cyan-500 border-cyan-100 dark:border-cyan-500/20'
            }`}>
              {n.type === 'compliance' && <ShieldAlert size={24} />}
              {n.type === 'finance' && <CreditCard size={24} />}
              {n.type === 'security' && <CheckCircle2 size={24} />}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{n.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                      n.priority === 'high' ? 'bg-rose-500 text-white' : 
                      n.priority === 'medium' ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {n.priority} PRIORITY
                    </span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock size={10} /> {n.time}
                    </span>
                  </div>
                </div>
                <button className="text-[10px] font-black text-slate-400 hover:text-cyan-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Dismiss Alert
                </button>
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight leading-relaxed">
                {n.message}
              </p>
            </div>
          </div>
        )) : (
          <div className="p-24 text-center bg-white dark:bg-slate-950 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10 shadow-inner">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-600 mx-auto mb-4">
              <Bell size={32} />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Operational Queue Clear</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
