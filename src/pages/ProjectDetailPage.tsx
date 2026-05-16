import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { getProjectById, saveProject, getTasks, saveTask, deleteTask as storageDeleteTask, getUsers, generateId } from '../utils/storage.ts';
import { Task, Project, TaskStatus, TaskPriority } from '../types.ts';
import { 
  Plus, 
  ArrowLeft, 
  Users, 
  CheckCircle2, 
  Clock, 
  Calendar,
  AlertCircle,
  MoreVertical,
  Trash2,
  Settings,
  UserPlus,
  Filter,
  X
} from 'lucide-react';
import { format } from 'date-fns';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as TaskPriority,
    status: 'TODO' as TaskStatus,
    dueDate: '',
    assignedToId: '',
  });

  const [selectedUserForProject, setSelectedUserForProject] = useState('');

  useEffect(() => {
    fetchProject();
    if (currentUser?.role === 'ADMIN') {
      setAllUsers(getUsers());
    }
  }, [id]);

  const fetchProject = () => {
    setLoading(true);
    if (!id) return;
    const targetProject = getProjectById(id);
    if (!targetProject) {
      navigate('/projects');
      return;
    }

    const allTasks = getTasks().filter(t => t.projectId === id);
    const allRegisteredUsers = getUsers();

    const enhancedProject = {
      ...targetProject,
      tasks: allTasks.map(t => ({
        ...t,
        assignedTo: allRegisteredUsers.find(u => u.id === t.assignedTo) || { id: '', name: 'Unassigned' }
      })),
      members: targetProject.members.map(mid => ({
        userId: mid,
        user: allRegisteredUsers.find(u => u.id === mid) || { id: mid, name: 'Unknown', email: '' }
      })),
      creator: allRegisteredUsers.find(u => u.id === targetProject.createdBy) || { name: 'System' }
    };

    setProject(enhancedProject);
    setLoading(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !currentUser) return;

    const task: Task = {
      id: generateId(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: newTask.status,
      dueDate: newTask.dueDate,
      projectId: id,
      assignedTo: newTask.assignedToId,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveTask(task);
    setShowTaskModal(false);
    setNewTask({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', dueDate: '', assignedToId: '' });
    fetchProject();
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !id) return;

    const updatedMembers = [...project.members.map((m: any) => m.userId), selectedUserForProject];
    const updatedProject: Project = {
      id: project.id,
      title: project.title,
      description: project.description,
      createdBy: project.createdBy,
      members: updatedMembers,
      createdAt: project.createdAt,
      updatedAt: new Date().toISOString(),
    };

    saveProject(updatedProject);
    setShowMemberModal(false);
    setSelectedUserForProject('');
    fetchProject();
  };

  const handleRemoveMember = (userId: string) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    if (!project || !id) return;

    const updatedMembers = project.members
      .map((m: any) => m.userId)
      .filter((mid: string) => mid !== userId);
    
    const updatedProject: Project = {
      id: project.id,
      title: project.title,
      description: project.description,
      createdBy: project.createdBy,
      members: updatedMembers,
      createdAt: project.createdAt,
      updatedAt: new Date().toISOString(),
    };

    saveProject(updatedProject);
    fetchProject();
  };

  const updateTaskStatus = (taskId: string, status: string) => {
    const allTasks = getTasks();
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = {
        ...task,
        status: status as TaskStatus,
        updatedAt: new Date().toISOString()
      };
      saveTask(updatedTask);
      fetchProject();
    }
  };

  const deleteTask = (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    storageDeleteTask(taskId);
    fetchProject();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!project) return null;

  const completedCount = project.tasks.filter(t => t.status === 'COMPLETED').length;
  const progress = project.tasks.length > 0 ? Math.round((completedCount / project.tasks.length) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Breadcrumbs / Back */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/projects" className="hover:text-indigo-600 flex items-center transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Projects
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{project.title}</h2>
            <p className="text-gray-600 max-w-2xl leading-relaxed italic">{project.description}</p>
            <div className="flex items-center space-x-4 pt-2">
              <span className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1.5" />
                Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
              </span>
              <span className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1.5" />
                {project.members.length} Members
              </span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm w-full lg:w-72 space-y-4">
            <div className="flex items-center justify-between text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              <span>Overall Progress</span>
              <span className="text-indigo-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-700" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center pt-2">
              <div>
                <p className="text-lg font-bold text-gray-900">{project.tasks.length}</p>
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Total Tasks</p>
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-600">{completedCount}</p>
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Finished</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Tasks List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Project Tasks</h3>
              {currentUser?.role === 'ADMIN' && (
                <button 
                  onClick={() => setShowTaskModal(true)}
                  className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Task
                </button>
              )}
            </div>

            <div className="bg-white shadow rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
              {project.tasks.length > 0 ? (
                project.tasks.map((task) => (
                  <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className={`font-bold ${task.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {task.title}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            task.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                            task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className={`text-sm ${task.status === 'COMPLETED' ? 'text-gray-300' : 'text-gray-500'} italic`}>
                          {task.description}
                        </p>
                        <div className="flex items-center pt-3 space-x-4">
                          <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                            <Users className="h-3.5 w-3.5 mr-1.5" />
                            {task.assignedTo?.name || 'Unassigned'}
                          </div>
                          {task.dueDate && (
                            <div className={`flex items-center text-xs px-2 py-1 rounded-lg ${
                              new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED'
                                ? 'bg-rose-50 text-rose-600'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              <Clock className="h-3.5 w-3.5 mr-1.5" />
                              {format(new Date(task.dueDate), 'MMM d, yyyy')}
                              {new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED' && (
                                <span className="ml-1.5 font-bold uppercase text-[9px]">Overdue</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <select 
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          className={`text-xs font-bold rounded-lg border-none focus:ring-2 focus:ring-indigo-600 px-3 py-1.5 appearance-none cursor-pointer transition-all ${
                            task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                            task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="TODO">TODO</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                        
                        {currentUser?.role === 'ADMIN' && (
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all bg-white shadow-sm rounded-lg border border-gray-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center text-gray-500 italic">
                  No tasks created for this project yet.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Team List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-gray-900">Project Team</h3>
              {currentUser?.role === 'ADMIN' && (
                <button 
                  onClick={() => setShowMemberModal(true)}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <UserPlus className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <div className="bg-white shadow rounded-2xl border border-gray-100 p-4 space-y-4">
              {project.members.map((member) => (
                <div key={member.userId} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-sm">
                      {member.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{member.user.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Member</p>
                    </div>
                  </div>
                  {currentUser?.role === 'ADMIN' && member.userId !== project.creator.name && (
                    <button 
                      onClick={() => handleRemoveMember(member.userId)}
                      className="p-1 text-gray-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Modal */}
        {showTaskModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 italic font-serif uppercase tracking-widest">New Task</h3>
                <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                  <Plus className="h-6 w-6 rotate-45" />
                </button>
              </div>
              <form onSubmit={handleCreateTask} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-tighter mb-1">Task Title</label>
                    <input 
                      type="text" required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                      value={newTask.title}
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-tighter mb-1">Description</label>
                    <textarea rows={2}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all resize-none"
                      value={newTask.description}
                      onChange={e => setNewTask({...newTask, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-tighter mb-1">Priority</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                      value={newTask.priority}
                      onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-tighter mb-1">Assign To</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                      value={newTask.assignedToId}
                      onChange={e => setNewTask({...newTask, assignedToId: e.target.value})}
                    >
                      <option value="">Select Member</option>
                      {project.members.map(m => (
                        <option key={m.userId} value={m.userId}>{m.user.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-tighter mb-1">Due Date</label>
                    <input 
                      type="date"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                      value={newTask.dueDate}
                      onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-6 border-t border-gray-50">
                  <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-colors">Create Task</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Member Modal */}
        {showMemberModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 italic font-serif">Add Team Member</h3>
              </div>
              <form onSubmit={handleAddMember} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select User</label>
                  <select 
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none"
                    value={selectedUserForProject}
                    onChange={e => setSelectedUserForProject(e.target.value)}
                  >
                    <option value="">Choose User...</option>
                    {allUsers
                      .filter(u => !project.members.some(m => m.userId === u.id))
                      .map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={() => setShowMemberModal(false)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Add</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
