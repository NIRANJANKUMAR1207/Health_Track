import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Activity, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  ShieldCheck
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '../types';

export const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link
      to={to}
      onClick={() => setIsSidebarOpen(false)}
      className={`flex items-center space-x-3 px-6 py-3 transition-colors ${
        isActive(to) 
          ? 'bg-teal-50 text-teal-600 border-r-4 border-teal-600' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-teal-500'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <Activity className="text-teal-600 mr-2" size={28} />
            <h1 className="text-xl font-bold text-slate-800">SmartHealth</h1>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center space-x-3">
              <img 
                src={user?.avatar || 'https://picsum.photos/200'} 
                alt="User" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role.toLowerCase()}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
            
            {user?.role === UserRole.USER && (
              <>
                <NavItem to="/tracker" icon={Activity} label="Health Tracker" />
                <NavItem to="/assistant" icon={MessageSquare} label="AI Assistant" />
                <NavItem to="/reports" icon={FileText} label="Reports" />
              </>
            )}

            {user?.role === UserRole.DOCTOR && (
              <>
                <NavItem to="/patients" icon={User} label="Patients" />
                <NavItem to="/assistant" icon={MessageSquare} label="AI Assistant" />
              </>
            )}

            {user?.role === UserRole.ADMIN && (
              <>
                <NavItem to="/admin/users" icon={User} label="Manage Users" />
                <NavItem to="/admin/system" icon={ShieldCheck} label="System Status" />
              </>
            )}
            
            <NavItem to="/profile" icon={Settings} label="Profile" />
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={logout}
              className="flex items-center justify-center w-full space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <button onClick={toggleSidebar} className="text-slate-600 p-2">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-slate-800">SmartHealth</span>
          <div className="w-8" /> {/* Spacer */}
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};