import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  LogOut, 
  User as UserIcon,
  Menu,
  X,
  Users
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Team', path: '/users', icon: Users });
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white/40 backdrop-blur-xl border-r border-white/40 p-6">
        <div className="mb-10 px-2 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
             <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">TeamTask</span>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-700 shadow-sm" 
                  : "text-slate-500 hover:bg-white/50 hover:text-slate-900"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="pt-6 mt-6 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-semibold text-slate-500 rounded-xl hover:bg-rose-50 hover:text-rose-700 transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-slate-600 bg-white/50 backdrop-blur rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:block">
               <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
               <p className="text-xs text-slate-500">Welcome back, {user?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="relative group hidden sm:block">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-white/50 backdrop-blur border border-white/60 rounded-full px-5 py-2 text-sm w-48 focus:w-64 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
             </div>
            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md p-1.5 pr-4 rounded-full border border-white/60">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {user?.name.charAt(0)}
              </div>
              <div className="text-right hidden xs:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full glass h-full">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button 
                className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 border border-white/40 outline-none"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="p-8">
               <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                   <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">TaskFlow</span>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all",
                      isActive 
                        ? "bg-indigo-600 text-white shadow-lg" 
                        : "text-slate-500 hover:bg-white/50"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </NavLink>
                ))}
                <div className="pt-6 mt-6 border-t border-white/20">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-semibold text-slate-500 rounded-xl hover:bg-rose-50 hover:text-rose-700"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
