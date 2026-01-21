
import React, { useState } from 'react';
import { Lock, Mail, Loader2, AlertCircle, Car, ShieldCheck } from 'lucide-react';
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

    // Simulated Secure Authentication
    setTimeout(() => {
      if (email === 'admin@arkshipping.com' && password === 'admin123') {
        const authUser: User = {
          id: 'u-1',
          name: 'Vikram Singh',
          email: 'admin@arkshipping.com',
          role: 'ADMIN',
          isAuthenticated: true,
          lastLogin: new Date().toISOString()
        };
        onLogin(authUser);
      } else {
        setError('Unauthorized access attempt. Please check credentials.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden">
      {/* Brand Side */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-900 p-12 text-white relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-amber-500 p-2 rounded-xl">
              <Car className="text-slate-900 w-8 h-8" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic">ARKFLOW</span>
          </div>
          <div className="max-w-md">
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Next-Gen <br/><span className="text-amber-500">Fleet Control</span> Center.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Managing OLA/UBER integration, driver settlements, and vehicle master data in one centralized hub.
            </p>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-4 text-sm text-slate-500">
          <ShieldCheck className="text-green-500" size={18} />
          <span>Enterprise Grade Security Enabled</span>
        </div>
      </div>

      {/* Login Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">CRMS Portal Login</h2>
            <p className="text-slate-500 font-medium">Please enter your staff credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-semibold animate-pulse">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all shadow-sm"
                  placeholder="admin@arkshipping.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
                <span className="text-sm text-slate-600 font-medium">Remember for 30 days</span>
              </label>
              <button type="button" className="text-sm font-bold text-amber-600 hover:text-amber-700">Forgot password?</button>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Verifying Identity...
                </>
              ) : 'Sign In to Dashboard'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm font-medium">
            New staff member? <span className="text-amber-600 font-bold cursor-pointer">Request Access</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
