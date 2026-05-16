import React from 'react';
import Layout from '../layouts/Layout.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Shield, Mail, Calendar, RotateCcw, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const handleResetData = () => {
    if (window.confirm('CRITICAL: This will wipe all current data and re-seed defaults. Proceed?')) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">User Identity</h2>
          <p className="text-sm font-medium text-slate-500 italic">Core profile parameters and system configuration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="glass-card p-10 rounded-[3rem] w-full flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-indigo-200 mb-6">
                {user.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{user.name}</h3>
              <span className="px-4 py-1.5 bg-indigo-600/10 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-600/10">
                {user.role}
              </span>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network ID</p>
                  <p className="text-sm font-bold text-slate-700">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Authorization</p>
                  <p className="text-sm font-bold text-slate-700">{user.role} Privilege Level</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registration Date</p>
                  <p className="text-sm font-bold text-slate-700">{format(new Date(user.createdAt), 'MMMM d, yyyy')}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] border-rose-100/50">
              <h4 className="text-sm font-bold text-rose-600 uppercase tracking-widest mb-4 flex items-center">
                <RotateCcw className="w-4 h-4 mr-2" />
                Danger Zone
              </h4>
              <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">
                Resetting demo data will clear all local storage records (Users, Projects, Tasks) and restore the system to its factory default state. This action is irreversible.
              </p>
              <button 
                onClick={handleResetData}
                className="px-6 py-3 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
              >
                Reset Factory Defaults
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
