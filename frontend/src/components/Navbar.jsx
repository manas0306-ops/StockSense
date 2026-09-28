import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlobalSearch from './GlobalSearch';
import ScannerModal from './ScannerModal';
import CompareModal from './CompareModal';
import { 
  LogOut, 
  ShieldCheck, 
  Menu, 
  Boxes, 
  Search, 
  Bell, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  X,
  Scan,
  ArrowLeftRight
} from 'lucide-react';
import { alertService } from '../services/alertService';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setScannerOpen(prev => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setCompareOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await alertService.getAll({ severity: 'ALL' });
        setAlerts((res.data || []).slice(0, 5));
      } catch (e) {
      }
    }
    loadAlerts();
  }, [notificationsOpen]);

  const handleResetDemo = () => {
    setResetting(true);
    try {
      localStorage.removeItem('stocksense_demo_db_v1');
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (e) {
      setResetting(false);
    }
  };

  const unreadCount = alerts.filter(a => !a.is_read && a.status !== 'resolved').length;

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <Boxes className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900 text-sm tracking-tight">StockSense</span>
          </div>

          {/* Global Search Bar Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-3 px-3 py-1.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer w-64 lg:w-80 justify-between group"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
              <span className="text-slate-500 font-medium">Search items, orders, bays...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 shadow-2xs">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Scanner Action */}
          <button
            onClick={() => setScannerOpen(true)}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition-colors cursor-pointer"
            title="Hardware Scanner Emulator (Ctrl+Shift+S)"
          >
            <Scan className="h-3.5 w-3.5 text-emerald-600" />
            <span>Scan</span>
          </button>

          {/* Compare Action */}
          <button
            onClick={() => setCompareOpen(true)}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 transition-colors cursor-pointer"
            title="Dual Entity Compare Matrix (Ctrl+Shift+C)"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-purple-600" />
            <span>Compare</span>
          </button>

          {/* Demo Mode Badge & Quick Reset */}
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden sm:inline">Demo Mode</span>
            <button
              onClick={handleResetDemo}
              disabled={resetting}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline ml-1 cursor-pointer flex items-center gap-0.5"
              title="Reset sample inventory scenario"
            >
              <RotateCcw className={`h-3 w-3 ${resetting ? 'animate-spin' : ''}`} />
              <span>{resetSuccess ? 'Reloading...' : 'Reset'}</span>
            </button>
          </div>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Operational Alerts"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 space-y-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Bell className="h-4 w-4 text-slate-700" />
                    <span className="font-bold text-sm text-slate-900">Telemetry Notifications</span>
                  </div>
                  <button 
                    onClick={() => setNotificationsOpen(false)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {alerts.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No new telemetry notifications.
                    </div>
                  ) : (
                    alerts.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          setNotificationsOpen(false);
                          navigate('/alerts');
                        }}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-900 truncate">{a.title}</span>
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            a.severity === 'critical' ? 'bg-rose-100 text-rose-800' :
                            a.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {a.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{a.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <Link
                    to="/alerts"
                    onClick={() => setNotificationsOpen(false)}
                    className="font-bold text-emerald-600 hover:underline"
                  >
                    Open Alert Center →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-2.5 pr-2 sm:pr-4 border-r border-slate-200 hover:opacity-80 transition-opacity cursor-pointer"
              title="View Profile"
            >
              <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {(user.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span>{user.role}</span>
                </div>
              </div>
            </Link>
          )}

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Global Search Command Palette */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Scanner Hardware Emulator Modal */}
      <ScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />

      {/* Dual Entity Comparison Modal */}
      <CompareModal isOpen={compareOpen} onClose={() => setCompareOpen(false)} />
    </>
  );
}
