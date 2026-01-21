
import React, { useState } from 'react';
import { User, ShieldCheck, Mail, Calendar, Key, Save } from 'lucide-react';
import { User as UserType } from '../types';

interface UserProfileProps {
  user: UserType;
  onUpdate: (updatedUser: UserType) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });

  const handleSave = () => {
    onUpdate({ ...user, ...formData });
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
        <p className="text-slate-500">Manage your system profile and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <User size={20} className="text-amber-500" />
              Identity Information
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900" 
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleSave}
                className="bg-slate-900 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Key size={20} className="text-blue-500" />
              Security & Passwords
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-slate-500">Change your password to maintain account security.</p>
              <button className="text-sm font-bold text-amber-600 hover:text-amber-700">Initiate Password Reset →</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-900 text-3xl font-black mx-auto">
              {user.name.charAt(0)}
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-bold text-xl">{user.name}</h4>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                <ShieldCheck size={14} className="text-amber-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{user.role}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <span className="text-green-400 font-bold">Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Member Since</span>
                <span className="text-white">Oct 2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
