import React from 'react';
import { LucideIcon, Search } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  icon?: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "No intelligence found matching these criteria.", 
  icon: Icon = Search 
}) => (
  <div className="col-span-full py-32 text-center glass-card rounded-[3rem] bg-white/20 w-full">
    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <Icon className="w-8 h-8 text-slate-300" />
    </div>
    <p className="text-slate-500 font-bold tracking-tight italic">{message}</p>
  </div>
);
