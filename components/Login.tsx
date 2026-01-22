import React, { useState } from 'react';
import { Lock, Mail, Loader2, AlertCircle, ShieldCheck, Activity } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@arkshipping.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      if (email === 'admin@arkshipping.com' && password === 'admin123') {
        // Updated to match the User interface from types.ts
        onLogin({
          id: 'u-1',
          userId: 'ADM-001',
          firstName: 'Vikram',
          lastName: 'Singh',
          emailAddress: 'admin@arkshipping.com',
          mobileNumber: '9876543210',
          role: 'ADMIN',
          isAuthenticated: true,
          status: 'ACTIVE',
          createdOn: new Date().toISOString(),
          createdBy: 'SYSTEM'
        });
      } else {
        setError('Verification failed. Invalid operational credentials.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0a0c10] items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-lg relative">
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-12 rounded-[3rem] shadow-2xl space-y-10">
          <div className="text-center space-y-4">
            <div className="bg-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-indigo-600/30">
              <Activity className="text-white w-10 h-10" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter italic">ARKFLOW <span className="text-indigo-500">v2</span></h1>
              <p className="text-slate-400 font-medium text-sm mt-2">Fleet Management Operations Center</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold uppercase tracking-wider">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Secure Access ID</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                  placeholder="admin@arkflow.io"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Master Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-black py-5 rounded-2xl shadow-2xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-[0.1em]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Initiating System...
                </>
              ) : 'Authenticate Access'}
            </button>
          </form>

          <div className="pt-8 border-t border-white/5 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-green-500" /> AES-256 Validated
            </span>
            <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
            <span>Support: ops@arkflow.io</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;