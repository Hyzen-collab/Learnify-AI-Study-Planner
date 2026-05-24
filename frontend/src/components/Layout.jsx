import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, CheckSquare, Sparkles,
  MessageSquare, Timer, LogOut, GraduationCap
} from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/plans', icon: BookOpen, label: 'Study Plans' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/generate', icon: Sparkles, label: 'AI Generator' },
  { to: '/chat', icon: MessageSquare, label: 'AI Chat' },
  { to: '/timer', icon: Timer, label: 'Study Timer' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out!');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-paper overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-ink flex flex-col py-6 px-4 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-9 h-9 bg-sage rounded-xl flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span className="font-display font-bold text-white text-lg">Learnify</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-sage text-white shadow-md'
                    : 'text-white/50 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-white/10 pt-4">
          <div className="px-3 mb-3">
            <p className="text-white font-display font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-white/40 text-xs font-mono truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
