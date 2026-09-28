import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowLeftRight, 
  Sliders, 
  ClipboardList, 
  Warehouse,
  BarChart3,
  AlertTriangle,
  Bot,
  FileText,
  Settings, 
  User, 
  Boxes,
  X,
  Sparkles,
  Cpu,
  ShieldCheck
} from 'lucide-react';

const operationsNav = [
  { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products Catalog', href: '/products', icon: Package },
  { name: 'Receipts', href: '/receipts', icon: ArrowDownLeft, badge: 'IN' },
  { name: 'Deliveries', href: '/deliveries', icon: ArrowUpRight, badge: 'OUT' },
  { name: 'Internal Transfers', href: '/transfers', icon: ArrowLeftRight, badge: 'MOVE' },
  { name: 'Stock Adjustments', href: '/adjustments', icon: Sliders },
  { name: 'Stock Ledger', href: '/ledger', icon: ClipboardList },
];

const intelligenceNav = [
  { name: 'Warehouses', href: '/warehouses', icon: Warehouse },
  { name: 'Analytics & BI', href: '/analytics', icon: BarChart3 },
  { name: 'What-If Simulator', href: '/simulator', icon: Cpu, badge: 'SIM' },
  { name: 'Data Quality & Audit', href: '/quality', icon: ShieldCheck, badge: '98%' },
  { name: 'Alert Center', href: '/alerts', icon: AlertTriangle },
  { name: 'AI Assistant', href: '/assistant', icon: Bot, isAi: true },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const location = useLocation();

  const isItemActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300 w-64 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xs">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-white text-base tracking-tight leading-none">StockSense</h1>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                PRO
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Enterprise Inventory</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto custom-scrollbar">
        {/* Operations Group */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Core Operations
          </div>
          <div className="space-y-0.5">
            {operationsNav.map((item) => {
              const active = isItemActive(item.href);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Intelligence Group */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Intelligence & Control
          </div>
          <div className="space-y-0.5">
            {intelligenceNav.map((item) => {
              const active = isItemActive(item.href);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-emerald-400' : item.isAi ? 'text-purple-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.isAi && (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse">
                      <Sparkles className="h-2.5 w-2.5" /> AI
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Profile & Status */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
        <NavLink
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/80 transition-colors text-xs text-slate-300"
        >
          <div className="h-7 w-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-slate-200 truncate">Alex Rivera</div>
            <div className="text-[10px] text-slate-400 truncate">Inventory Manager</div>
          </div>
          <User className="h-4 w-4 text-slate-400" />
        </NavLink>

        <div className="px-2 py-1 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Telemetry Connected</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400">Odoo IMS</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block shrink-0 min-h-screen">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" 
            onClick={onClose}
          />
          <div className="relative z-50 flex-1 flex max-w-xs w-full">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
