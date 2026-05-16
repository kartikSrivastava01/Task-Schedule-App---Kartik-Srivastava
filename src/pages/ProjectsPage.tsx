import React, { useEffect, useState } from 'react';
import Layout from '../layouts/Layout.tsx';
import api from '../api/axios.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  ExternalLink, 
  Trash2, 
  Calendar,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tasks: any[];
  members: any[];
  creator: { name: string };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowCreateModal(false);
      setNewProject({ title: '', description: '' });
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project? All associated tasks will be removed.')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project', error);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Collective Hub</h2>
            <p className="text-sm font-medium text-slate-500 italic">Centralized workspace for tactical operations</p>
          </div>
          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] transition-all font-bold space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Initialize Workspace</span>
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Query project database..." 
            className="glass-input w-full pl-12 pr-6 py-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass-card rounded-[2rem] h-64 animate-pulse opacity-50"></div>
            ))
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              const completedTasks = project.tasks?.filter(t => t.status === 'COMPLETED').length || 0;
              const totalTasks = project.tasks?.length || 0;
              const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <div key={project.id} className="glass-card rounded-[2.5rem] flex flex-col p-8 group hover:translate-y-[-6px] transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                       <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors leading-tight mb-1">
                        {project.title}
                      </h3>
                      <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <Calendar className="w-3 h-3 mr-1.5" />
                         {format(new Date(project.createdAt), 'MMM yyyy')}
                      </div>
                    </div>
                    {user?.role === 'ADMIN' && (
                      <button 
                        onClick={(e) => { e.preventDefault(); handleDeleteProject(project.id); }}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <p className="text-slate-500 text-sm line-clamp-2 mb-8 flex-1 font-medium leading-relaxed">
                    {project.description || 'No operational parameters defined for this project.'}
                  </p>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Sync Progress</span>
                      <span className="text-indigo-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200/50 rounded-full h-2 overflow-hidden shadow-inner">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all shadow-[0_0_8px_rgba(79,70,229,0.3)]" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-white/60">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                           <div className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600">
                              {project.members?.length || 0}
                           </div>
                           <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                              +
                           </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           {totalTasks} Items
                        </span>
                      </div>
                      <Link 
                        to={`/projects/${project.id}`}
                        className="h-10 w-10 flex items-center justify-center bg-white/60 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all border border-white group/link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-32 text-center glass-card rounded-[3rem] bg-white/20">
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-slate-300" />
               </div>
              <p className="text-slate-500 font-bold tracking-tight">No intelligence found matching these criteria.</p>
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <div className="glass-card w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.1)]">
              <div className="px-10 py-8 border-b border-white/60 flex justify-between items-center bg-white/20">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Initialize Workspace</h3>
                <button onClick={() => setShowCreateModal(false)} className="bg-white/40 hover:bg-white p-2 rounded-2xl transition-all">
                  <X className="h-6 w-6 text-slate-600" />
                </button>
              </div>
              <form onSubmit={handleCreateProject} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Operational Label</label>
                  <input 
                    type="text" 
                    required
                    className="glass-input w-full px-5 py-4"
                    placeholder="e.g. Project Orion"
                    value={newProject.title}
                    onChange={e => setNewProject({...newProject, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Scope Definition</label>
                  <textarea 
                    rows={4}
                    className="glass-input w-full px-5 py-4 resize-none"
                    placeholder="Define operational boundaries..."
                    value={newProject.description}
                    onChange={e => setNewProject({...newProject, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-4 bg-white/40 text-slate-600 rounded-2xl font-bold hover:bg-white transition-all text-xs uppercase tracking-widest"
                  >
                    Abort
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 text-xs uppercase tracking-widest"
                  >
                    Deploy Node
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// Re-using some imports for better scannability
import { CheckCircle2, X } from 'lucide-react';
