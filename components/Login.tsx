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
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#020617] items-center justify-center p-6 selection:bg-cyan-500/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/5 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-800/20 blur-[150px]"></div>
      </div>

      <div className="w-full max-w-lg relative">
        <div className="bg-slate-950/60 backdrop-blur-3xl border border-white/10 p-12 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] space-y-12 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center space-y-5">
            <div className="bg-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(8,145,178,0.4)]">
              <Activity className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">ARKFLOW</h1>
              <p className="text-slate-600 font-black text-[10px] uppercase tracking-[0.4em] mt-2">Core Access System</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-500 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-1">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Secure Credential ID</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-14 pr-6 py-4.5 text-white focus:outline-none focus:border-cyan-500/40 focus:bg-slate-800 transition-all font-black text-[11px] uppercase tracking-widest placeholder:text-slate-700"
                  placeholder="ID@ARKFLOW.SYSTEM"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Encrypted Access Token</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-14 pr-6 py-4.5 text-white focus:outline-none focus:border-cyan-500/40 focus:bg-slate-800 transition-all font-black text-[11px] uppercase tracking-widest placeholder:text-slate-700"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-black py-5 rounded-2xl shadow-2xl hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 transition-all flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Initiating Core...
                </>
              ) : 'Establish Connection'}
            </button>
          </form>

          <div className="pt-8 border-t border-white/5 flex items-center justify-center gap-8 text-[9px] font-black text-slate-700 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-emerald-600" /> Secure Node
            </span>
            <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
            <span>Support Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
