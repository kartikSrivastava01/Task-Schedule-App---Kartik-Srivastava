import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import api from '../api/axios.ts';
import { User, Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/20 rounded-full blur-[120px] -z-10"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-200 group hover:rotate-6 transition-transform">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-slate-900 tracking-tighter">
          TeamSync
        </h2>
        <p className="mt-2 text-center text-sm font-semibold text-slate-500 uppercase tracking-widest">
          Unified Workflow Engine
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="glass-card py-10 px-8 sm:px-12 rounded-[2.5rem]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl animate-shake">
                <p className="text-xs font-bold text-rose-600 text-center uppercase tracking-wider">{error}</p>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Email Identity</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input block w-full pl-11 pr-4 py-4 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Secure Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input block w-full pl-11 pr-4 py-4 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-200 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'AUTHENTICATE'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs font-semibold text-slate-500">
              New to TeamSync?{' '}
              <Link to="/signup" className="text-indigo-600 hover:underline font-bold">
                Deploy Account
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 glass-card p-6 rounded-3xl border-indigo-100/30">
          <p className="text-[10px] font-bold text-indigo-600/60 uppercase tracking-widest mb-4 text-center">Sandbox Credentials</p>
          <div className="grid grid-cols-2 gap-6 text-[10px]">
            <div className="bg-white/30 p-3 rounded-2xl border border-white/40">
              <p className="font-extrabold text-slate-900 mb-1">ADMIN_ROOT</p>
              <p className="text-slate-500">admin@example.com</p>
              <p className="text-slate-400 font-mono">admin123</p>
            </div>
            <div className="bg-white/30 p-3 rounded-2xl border border-white/40">
              <p className="font-extrabold text-slate-900 mb-1">MEMBER_USER</p>
              <p className="text-slate-500">member1@example.com</p>
              <p className="text-slate-400 font-mono">member123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
