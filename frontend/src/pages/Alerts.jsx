import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alertService } from '../services/alertService';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Search, 
  Filter, 
  RefreshCw, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Warehouse, 
  Package, 
  ArrowDownLeft, 
  CheckCheck,
  Trash2
} from 'lucide-react';

export default function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await alertService.getAll({ severity: severityFilter, search: searchTerm });
      setAlerts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [severityFilter, searchTerm]);

  const handleMarkRead = async (id) => {
    try {
      await alertService.markRead(id);
      setAlerts(alerts.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolve = async (id) => {
    try {
      await alertService.resolve(id);
      setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'resolved', is_read: true } : a));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResolveAll = async () => {
    try {
      await alertService.resolveAll();
      fetchAlerts();
    } catch (e) {
      console.error(e);
    }
  };

  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && a.status !== 'resolved').length;
  const infoCount = alerts.filter(a => a.severity === 'info' && a.status !== 'resolved').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Enterprise Alert Center</h1>
          <p className="text-sm text-slate-500">Autonomous monitoring for stockouts, capacity limits, and inventory discrepancies</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAlerts}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs cursor-pointer transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleResolveAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
          >
            <CheckCheck className="h-4 w-4 text-emerald-600" />
            <span>Mark All Resolved</span>
          </button>
        </div>
      </div>

      {/* Severity Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setSeverityFilter(severityFilter === 'critical' ? 'ALL' : 'critical')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            severityFilter === 'critical' 
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/20' 
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase text-rose-600">Critical Alerts</span>
            <AlertCircle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700">{criticalCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Requires immediate intervention</div>
        </button>

        <button
          onClick={() => setSeverityFilter(severityFilter === 'warning' ? 'ALL' : 'warning')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            severityFilter === 'warning' 
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20' 
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase text-amber-600">Warnings</span>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700">{warningCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Approaching thresholds</div>
        </button>

        <button
          onClick={() => setSeverityFilter(severityFilter === 'info' ? 'ALL' : 'info')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            severityFilter === 'info' 
              ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/20' 
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase text-blue-600">Informational</span>
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700">{infoCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Operational notifications</div>
        </button>

        <button
          onClick={() => setSeverityFilter(severityFilter === 'resolved' ? 'ALL' : 'resolved')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            severityFilter === 'resolved' 
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20' 
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase text-emerald-600">Resolved</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{resolvedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Cleared action items</div>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts by item, warehouse, or issue..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {severityFilter !== 'ALL' && (
            <button
              onClick={() => setSeverityFilter('ALL')}
              className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium cursor-pointer"
            >
              Clear Filter ({severityFilter})
            </button>
          )}
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="h-6 w-6 text-emerald-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-500">Checking system telemetry...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-slate-200">
            <ShieldCheck className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
            <p className="font-bold text-slate-800">All Systems Operational</p>
            <p className="text-xs text-slate-500 mt-1">No active alerts matching your current filter criteria.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';
            const isInfo = alert.severity === 'info';
            const isResolved = alert.status === 'resolved';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  isResolved 
                    ? 'bg-slate-50/80 border-slate-200 opacity-60' 
                    : isCritical 
                    ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300' 
                    : isWarning 
                    ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300' 
                    : 'bg-blue-50/50 border-blue-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    isResolved ? 'bg-slate-200 text-slate-600' :
                    isCritical ? 'bg-rose-100 text-rose-700' :
                    isWarning ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {isResolved ? <CheckCircle2 className="h-5 w-5" /> :
                     isCritical ? <AlertCircle className="h-5 w-5" /> :
                     isWarning ? <AlertTriangle className="h-5 w-5" /> :
                     <Info className="h-5 w-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{alert.title}</h4>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isResolved ? 'bg-slate-200 text-slate-700' :
                        isCritical ? 'bg-rose-100 text-rose-800' :
                        isWarning ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {isResolved ? 'RESOLVED' : alert.severity}
                      </span>
                      {alert.category && (
                        <span className="text-[10px] text-slate-500 bg-white/80 border border-slate-200 px-2 py-0.5 rounded">
                          {alert.category}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {alert.warehouse_name && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Warehouse className="h-3 w-3" />
                            {alert.warehouse_name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {/* Quick Action: e.g. Reorder */}
                  {alert.product_id && !isResolved && (
                    <button
                      onClick={() => navigate(`/receipts?productId=${alert.product_id}&qty=100&autoOpen=true`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <ArrowDownLeft className="h-3.5 w-3.5" />
                      <span>Reorder Now</span>
                    </button>
                  )}

                  {!isResolved ? (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-white border border-slate-200 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Resolve</span>
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-semibold px-2">✓ Resolved</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
