import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Droplets, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Fish, 
  User as UserIcon 
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'petambak'],
    },
    {
      name: 'Kualitas Air',
      path: '/water-quality',
      icon: Droplets,
      roles: ['admin', 'petambak'],
    },
    {
      name: 'Kelola User',
      path: '/users',
      icon: Users,
      roles: ['admin'],
    },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => item.roles.includes(user?.role)
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col fixed h-full glass border-r border-slate-800/80 z-20">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-800/80">
          <Fish className="h-8 w-8 text-cyan-400 animate-pulse-cyan" />
          <div>
            <h1 className="font-bold text-lg tracking-wider text-cyan-400">F-RISK</h1>
            <p className="text-[10px] text-slate-400 -mt-1 tracking-widest font-mono">WATER MONITOR</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950 to-slate-900 text-cyan-400 border-l-4 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:bg-slate-900/50 hover:text-cyan-300'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all duration-300"
          >
            <LogOut className="h-5 w-5" />
            Keluar Sesi
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 h-16 flex items-center justify-between px-6 z-10 glass border-b border-slate-800/60">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-900"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Page title placeholder or welcome message */}
          <div className="hidden sm:block text-sm text-slate-400">
            Selamat datang, <span className="font-semibold text-cyan-300">{user?.name}</span>!
          </div>

          {/* User info dropdown/badge */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-slate-200">{user?.name}</span>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full mt-0.5 tracking-wider ${
                user?.role === 'admin' 
                  ? 'bg-purple-950/60 text-purple-300 border border-purple-800/60' 
                  : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60'
              }`}>
                {user?.role}
              </span>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center border border-cyan-400/30">
              <UserIcon className="h-5 w-5 text-slate-100" />
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 flex">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60" onClick={() => setIsMobileMenuOpen(false)}></div>

            <aside className="relative flex w-64 flex-col bg-slate-950 border-r border-slate-800 h-full p-4 z-40">
              <div className="flex items-center gap-2 pb-6 border-b border-slate-800 mb-6">
                <Fish className="h-7 w-7 text-cyan-400" />
                <span className="font-bold text-lg text-cyan-400 tracking-wider">F-RISK</span>
              </div>

              <nav className="flex-1 space-y-1">
                {filteredMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-950 text-cyan-400 border-l-4 border-cyan-400'
                          : 'text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/20 mt-auto border-t border-slate-800 pt-4"
              >
                <LogOut className="h-5 w-5" />
                Keluar Sesi
              </button>
            </aside>
          </div>
        )}

        {/* Inner Content Outlet */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 text-center border-t border-slate-900 bg-slate-950/20 text-xs text-slate-500 font-mono">
          &copy; {new Date().getFullYear()} F-RISK Water Monitoring System. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
