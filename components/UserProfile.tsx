
import React, { useState } from 'react';
import { User, ShieldCheck, Mail, Calendar, Key, Save, UserCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface UserProfileProps {
  user: UserType;
  onUpdate: (updatedUser: UserType) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
    mobileNumber: user.mobileNumber
  });

  const handleSave = () => {
    onUpdate({ ...user, ...formData });
    alert('Identity Record Updated Successfully');
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Operator Profile</h2>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1.5">Manage operator identity and authentication parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-50 dark:bg-cyan-900/10 rounded-xl text-cyan-600 dark:text-cyan-400">
                <UserCircle size={20} />
              </div>
              <h3 className="text-lg font-black italic uppercase text-slate-900 dark:text-white tracking-tight">Identity Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500/40 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500/40 transition-all" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Secure Email Address</label>
                <input 
                  type="email" 
                  value={formData.emailAddress}
                  onChange={(e) => setFormData({...formData, emailAddress: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500/40 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Mobile Contact</label>
                <input 
                  type="text" 
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500/40 transition-all" 
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleSave}
                className="bg-slate-900 dark:bg-white text-white dark:text-black font-black px-10 py-4 rounded-xl flex items-center gap-2 hover:bg-cyan-500 hover:text-white transition-all shadow-xl text-[10px] uppercase tracking-widest"
              >
                <Save size={16} />
                Commit Identity Changes
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl space-y-6">
            <h3 className="text-lg font-black italic uppercase text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-blue-600 dark:text-blue-400">
                <Key size={20} />
              </div>
              Authentication Protocol
            </h3>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Master password rotation required every 90 days</p>
              <button className="text-[10px] font-black text-cyan-600 dark:text-cyan-500 hover:text-cyan-700 uppercase tracking-widest px-4 py-2 border border-cyan-500/20 rounded-xl">Initiate Rotation →</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="w-24 h-24 rounded-[2rem] bg-cyan-600 flex items-center justify-center text-white text-4xl font-black mx-auto shadow-2xl shadow-cyan-600/40 relative z-10">
              {user.firstName.charAt(0)}
            </div>
            <div className="text-center space-y-2 relative z-10">
              <h4 className="font-black text-2xl tracking-tighter italic uppercase">{user.firstName} {user.lastName}</h4>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
                <ShieldCheck size={14} className="text-cyan-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
              </div>
            </div>
            <div className="pt-6 border-t border-white/10 space-y-4 relative z-10">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">Security Clearance</span>
                <span className="text-emerald-400">Validated</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">Node Operator ID</span>
                <span className="text-white">{user.userId}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">Onboarded Date</span>
                <span className="text-white">Oct 12, 2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
