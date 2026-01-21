
import React, { useState } from 'react';
import { Lock, Mail, Loader2, AlertCircle, Car } from 'lucide-react';
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

    // Simulated API call
    setTimeout(() => {
      if (email === 'admin@arkshipping.com' && password === 'admin123') {
        onLogin({
          id: 'u-1',
          name: 'Vikram Singh',
          email: 'admin@arkshipping.com',
          role: 'ADMIN',
          isAuthenticated: true,
          lastLogin: new Date().toISOString()
        });
      } else {
        setError('Invalid credentials. Please check your email and password.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-amber-900/20">
      <div className="w-full max-w-md p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="bg-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30 mb-4">
              <Car className="text-slate-900 w-8 h-8" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">ArkFlow CRMS</h1>
            <p className="text-slate-400 text-sm">Sign in to manage fleet operations</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 text-red-400 text-xs font-medium">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 disabled:text-amber-500/50 text-slate-900 font-bold py-4 rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Authenticating...
                </>
              ) : 'Enter CRMS Dashboard'}
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500">
              Forgot password? Contact <span className="text-amber-500/80 cursor-pointer">System Admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
