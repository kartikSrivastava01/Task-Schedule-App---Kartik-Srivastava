import React, { useEffect, useState } from 'react';
import Layout from '../layouts/Layout.tsx';
import api from '../api/axios.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  CheckSquare
} from 'lucide-react';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  project: { title: string };
  assignedTo: { name: string };
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId: string, status: string) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.project.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
              <CheckSquare className="mr-4 h-8 w-8 text-indigo-600" />
              Strategic Tasks
            </h2>
            <p className="text-sm font-medium text-slate-500 italic">Operational queue for assigned deployments</p>
          </div>
          <div className="flex gap-4">
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Units</p>
                <p className="text-2xl font-black text-indigo-600">{tasks.filter(t => t.status !== 'COMPLETED').length}</p>
             </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Query task logs or project nodes..." 
              className="glass-input w-full pl-12 pr-6 py-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center glass-card px-4 py-2 border-white/60">
              <Filter className="h-4 w-4 text-slate-400 mr-3" />
              <select 
                className="bg-transparent border-none outline-none font-bold text-xs text-slate-700 uppercase tracking-widest cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All States</option>
                <option value="TODO">Backlog</option>
                <option value="IN_PROGRESS">Active</option>
                <option value="COMPLETED">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/60">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descriptor</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin Node</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Threat Level</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Window</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-white/40 transition-all group">
                      <td className="px-8 py-6">
                        <p className={`text-sm font-bold tracking-tight mb-1 ${task.status === 'COMPLETED' ? 'text-slate-400 line-through decoration-indigo-500/50' : 'text-slate-900'}`}>
                          {task.title}
                        </p>
                        <p className={`text-[10px] sm:text-xs font-medium leading-relaxed max-w-xs line-clamp-1 ${task.status === 'COMPLETED' ? 'text-slate-300' : 'text-slate-500'}`}>
                          {task.description}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-600/10 px-3 py-1.5 rounded-xl uppercase tracking-tighter shadow-sm border border-indigo-600/5">
                          {task.project.title}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                          task.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                          task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                          'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {task.dueDate ? (
                          <div className={`flex items-center text-[10px] font-bold tracking-widest uppercase ${
                            new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED' ? 'text-rose-600' : 'text-slate-400'
                          }`}>
                            <Clock className="h-3 w-3 mr-2" />
                            {format(new Date(task.dueDate), 'MMM d, yyyy')}
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300 uppercase italic">Unbounded</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <select 
                          value={task.status}
                          onChange={(e) => updateStatus(task.id, e.target.value)}
                          className={`text-[10px] font-black uppercase tracking-widest rounded-xl border-none outline-none px-4 py-2 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm appearance-none ${
                            task.status === 'COMPLETED' ? 'bg-emerald-500 text-white shadow-emerald-200' :
                            task.status === 'IN_PROGRESS' ? 'bg-indigo-600 text-white shadow-indigo-200' :
                            'bg-slate-200/50 text-slate-600'
                          }`}
                        >
                          <option value="TODO">Backlog</option>
                          <option value="IN_PROGRESS">Active</option>
                          <option value="COMPLETED">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                       <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckSquare className="w-6 h-6 text-slate-300" />
                       </div>
                       <p className="text-slate-400 font-bold text-sm tracking-tight italic">Peripheral scan complete. No signals detected.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
