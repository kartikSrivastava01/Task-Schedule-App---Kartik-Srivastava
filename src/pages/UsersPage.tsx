import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout.tsx';
import { getUsers } from '../utils/storage.ts';
import { Users as UsersIcon, Mail, Shield, ShieldAlert, Search } from 'lucide-react';

export default function UsersPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setTeam(getUsers());
  }, []);

  const filteredTeam = team.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
            <UsersIcon className="mr-4 h-8 w-8 text-indigo-600" />
            Productivity Collective
          </h2>
          <p className="text-sm font-medium text-slate-500 italic">Registry of all registered tactical units</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search collective nodes..." 
            className="glass-input w-full pl-12 pr-6 py-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.map((member) => (
            <div key={member.id} className="glass-card p-6 rounded-[2rem] flex flex-col items-center text-center group hover:translate-y-[-4px] transition-all duration-300">
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-indigo-100 rounded-[1.5rem] flex items-center justify-center text-indigo-700 text-2xl font-black shadow-lg shadow-indigo-100 border-2 border-white group-hover:rotate-6 transition-transform">
                  {member.name.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-xl shadow-md border border-slate-100">
                  {member.role === 'ADMIN' ? (
                    <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Shield className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h3>
              <div className="flex items-center text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">
                <Mail className="w-3 h-3 mr-1.5" />
                {member.email}
              </div>
              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                member.role === 'ADMIN' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-500'
              }`}>
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
