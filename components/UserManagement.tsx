
import React, { useState } from 'react';
import { UserCheck, Search, ShieldCheck, Mail, Phone, Calendar, UserPlus, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { User } from '../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 'u1',
      userId: 'ADM-001',
      firstName: 'Vikram',
      lastName: 'Singh',
      emailAddress: 'admin@arkshipping.com',
      mobileNumber: '9876543210',
      role: 'ADMIN',
      status: 'ACTIVE',
      isAuthenticated: true,
      createdOn: '2023-09-01',
      createdBy: 'SYSTEM'
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.mobileNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-1">Administrative</p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">SYSTEM OPERATORS</h2>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm w-80">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by UID or Mobile" 
              className="bg-transparent border-none focus:outline-none text-sm w-full font-medium" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-slate-900 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl">
            <UserPlus size={20} /> New Access Account
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">User Details</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Authorization</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Registered At</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Account Status</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg">
                      {u.firstName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{u.firstName} {u.lastName}</p>
                      <div className="flex items-center gap-3 text-slate-500 mt-1">
                        <div className="flex items-center gap-1 text-[10px] font-bold"><Mail size={10} /> {u.emailAddress}</div>
                        <div className="flex items-center gap-1 text-[10px] font-bold"><Phone size={10} /> {u.mobileNumber}</div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <ShieldCheck className="text-indigo-600" size={14} />
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">{u.role}</span>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 mt-1 ml-1 uppercase">ID: {u.userId}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                    <Calendar size={14} className="text-slate-300" /> {u.createdOn}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${u.status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                    <span className="text-[9px] font-black uppercase tracking-widest">{u.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm"><Edit2 size={16}/></button>
                    <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
