import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  name: string;
  value: string | number | undefined;
  icon: LucideIcon;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ name, value, icon: Icon, color }) => (
  <div className="glass-card p-6 flex flex-col rounded-3xl hover:translate-y-[-4px] transition-all duration-300">
    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">{name}</p>
    <div className="flex items-end justify-between">
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <div className={`${color} p-2 rounded-xl shadow-lg shadow-indigo-100`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  </div>
);
