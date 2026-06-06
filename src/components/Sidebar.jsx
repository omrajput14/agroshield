import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CloudSun,
  ScrollText,
  FileWarning,
  BarChart3,
  Settings,
  Shield,
  Bell,
  ChevronLeft,
  ChevronRight,
  Leaf,
  BrainCircuit,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/forecasts', icon: CloudSun, label: 'Forecasts' },
  { to: '/events', icon: ScrollText, label: 'Events' },
  { to: '/damage-reports', icon: FileWarning, label: 'Damage Reports' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/ai-predictions', icon: BrainCircuit, label: 'AI Predictions' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <div className="lg:hidden fixed inset-0 z-40 pointer-events-none" />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 glass-sidebar flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800/40 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/30 flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-sm font-bold gradient-text leading-tight">AgroShield</h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Wind Protection AI</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                isActive ? 'nav-link-active' : 'nav-link'
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="animate-fade-in">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-slate-800/40 space-y-2">
          {/* System status */}
          {!collapsed && (
            <div className="px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 animate-fade-in">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-400">System Online</span>
              </div>
              <p className="text-[10px] text-slate-500">All 48 sensors active</p>
            </div>
          )}

          {collapsed && (
            <div className="flex justify-center" title="System Online">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          )}

          {/* Notification bell */}
          <button
            className="nav-link w-full relative"
            title={collapsed ? 'Notifications' : undefined}
          >
            <Bell className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Notifications</span>}
            <span className="absolute top-2.5 left-7 w-2 h-2 rounded-full bg-red-500 ring-2 ring-slate-950" />
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="nav-link w-full justify-center lg:justify-start"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 flex-shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50 safe-area-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-slate-500'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
