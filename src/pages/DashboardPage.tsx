import React, { useEffect, useState } from 'react';
import Layout from '../layouts/Layout.tsx';
import api from '../api/axios.ts';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  BarChart3,
  Users
} from 'lucide-react';
import { format } from 'date-fns';

interface Stats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionPercentage: number;
  recentTasks: any[];
  membersCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  const statCards = [
    { name: 'Total Projects', value: stats?.totalProjects, icon: Briefcase, color: 'bg-blue-500' },
    { name: 'Total Tasks', value: stats?.totalTasks, icon: BarChart3, color: 'bg-indigo-500' },
    { name: 'Completed', value: stats?.completedTasks, icon: CheckCircle2, color: 'bg-emerald-500' },
    { name: 'Overdue', value: stats?.overdueTasks, icon: AlertCircle, color: 'bg-rose-500' },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h2>
          <p className="text-sm text-slate-500 font-medium">Tracking your team's real-time productivity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.name} className="glass-card p-6 flex flex-col rounded-3xl hover:translate-y-[-4px] transition-all duration-300">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">{card.name}</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                <div className={`${card.color} p-2 rounded-xl shadow-lg shadow-indigo-100`}>
                   <card.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Stats Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Completion Chart-like area */}
            <div className="glass-card p-8 rounded-[2rem]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <TrendingUp className="mr-3 h-5 w-5 text-indigo-600" />
                  Efficiency Report
                </h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  {stats?.completionPercentage}% Goal
                </span>
              </div>
              <div className="w-full bg-slate-200/50 h-3 mb-6 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(79,70,229,0.3)]" 
                  style={{ width: `${stats?.completionPercentage}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pending</p>
                  <p className="text-2xl font-bold text-slate-800">{stats?.pendingTasks}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">In Progress</p>
                  <p className="text-2xl font-bold text-slate-800">{stats?.inProgressTasks}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Completed</p>
                  <p className="text-2xl font-bold text-slate-800">{stats?.completedTasks}</p>
                </div>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="glass-card rounded-[2rem] overflow-hidden flex flex-col">
              <div className="px-8 py-6 border-b border-white/60 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase text-slate-400 tracking-widest">
                      <th className="px-8 py-4">Task Name</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                    {stats?.recentTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-white/30 transition-colors group">
                        <td className="px-8 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{task.title}</span>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{task.project.title}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${
                            task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                            task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right text-[10px] font-bold text-slate-400">
                          {format(new Date(task.createdAt), 'MMM d, p')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {stats?.recentTasks.length === 0 && (
                  <div className="p-12 text-center text-slate-400 italic text-sm">No recent activity</div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                 <Users className="w-24 h-24" />
              </div>
              <h3 className="text-lg font-bold mb-6 flex items-center relative z-10">
                <Users className="mr-3 h-5 w-5" />
                Team Hub
              </h3>
              <div className="text-center py-6 relative z-10">
                <p className="text-5xl font-extrabold mb-1">{stats?.membersCount}</p>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Active Members</p>
              </div>
              <button className="w-full mt-6 bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-2xl transition-all text-xs relative z-10">
                Invite Collaborator
              </button>
            </div>

            <div className="glass-card rounded-[2rem] p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                <Clock className="mr-3 h-5 w-5 text-rose-500" />
                Attention
              </h3>
              <div className="flex items-center justify-between mb-2">
                 <p className="text-4xl font-extrabold text-rose-500">{stats?.overdueTasks}</p>
                 <AlertCircle className="w-8 h-8 text-rose-200" />
              </div>
              <p className="text-slate-500 text-xs font-medium">Overdue tasks require immediate review</p>
              <button className="w-full mt-8 bg-rose-500 text-white font-bold py-3 rounded-2xl transition-all hover:bg-rose-600 shadow-lg shadow-rose-100 text-xs uppercase tracking-widest">
                Resolve Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
