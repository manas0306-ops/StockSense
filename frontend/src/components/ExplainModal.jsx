import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  HelpCircle, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  Warehouse, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Zap 
} from 'lucide-react';

export default function ExplainModal({ isOpen, onClose, metricType, data }) {
  const navigate = useNavigate();

  if (!isOpen || !data) return null;

  const handleAction = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  Root Cause Diagnosis
                </span>
                <span className="text-xs text-slate-400 font-mono">EXPLAINABILITY ENGINE</span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">{data.title || 'Metric Investigation'}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Executive Summary Callout */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
            {data.summary || 'Below is the data-driven breakdown explaining the current metric calculation and underlying operational causes.'}
          </div>

          {/* Breakdown Categories if available */}
          {data.breakdown && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-slate-500" />
                <span>Primary Contributing Factors</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {data.breakdown.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-800">{item.reason}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        {item.count} SKUs
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-normal">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Health Score Components if metricType is health */}
          {data.components && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Score Breakdown Matrix</span>
              </h3>
              <div className="space-y-2">
                {data.components.map((comp, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{comp.name}</span>
                      <p className="text-[11px] text-slate-500">{comp.notes}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-600 text-sm">{comp.score}</span>
                      <span className="text-[10px] text-slate-400 block">Weight: {comp.weight}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deductions if present */}
          {data.deductions && (
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs">
              <h4 className="font-bold text-rose-800 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                Active Score Penalties (-12 pts)
              </h4>
              <ul className="space-y-1 text-rose-700 text-[11px]">
                {data.deductions.map((d, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>• {d.label}</span>
                    <strong className="font-mono font-bold">{d.penalty}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warehouse Breakdown if metricType is warehouseUtilization */}
          {data.warehouses && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Warehouse className="h-3.5 w-3.5 text-blue-600" />
                <span>Regional Capacity Distribution</span>
              </h3>
              <div className="space-y-2.5">
                {data.warehouses.map((w) => (
                  <div key={w.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{w.name} ({w.city})</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        w.status === 'HIGH' ? 'bg-red-50 text-red-700 border border-red-200' :
                        w.status === 'OPTIMAL' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {w.utilization}% Capacity
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${w.utilization >= 80 ? 'bg-red-500' : w.utilization >= 50 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                        style={{ width: `${w.utilization}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Stored: {w.occupied.toLocaleString()} units</span>
                      <span>Total Rated: {w.capacity.toLocaleString()} units</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Affected Products Table if present */}
          {data.affectedProducts && data.affectedProducts.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Affected Inventory Items</span>
                <span className="text-[10px] text-slate-500 font-normal">Click item to open Product X-Ray</span>
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-slate-500 font-semibold text-[10px] uppercase">
                    <tr>
                      <th className="px-3 py-2">Item / SKU</th>
                      <th className="px-3 py-2">On Hand</th>
                      <th className="px-3 py-2">Threshold</th>
                      <th className="px-3 py-2">Deficit</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {data.affectedProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-2">
                          <button
                            onClick={() => handleAction(`/products?search=${p.sku}`)}
                            className="font-bold text-slate-900 hover:text-emerald-600 text-left block cursor-pointer"
                          >
                            {p.name}
                          </button>
                          <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                        </td>
                        <td className="px-3 py-2 font-mono font-bold text-rose-600">{p.current}</td>
                        <td className="px-3 py-2 font-mono text-slate-500">{p.reorderLevel}</td>
                        <td className="px-3 py-2 font-mono text-rose-600 font-semibold">-{p.deficit}</td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => handleAction(`/receipts?productId=${p.id}&qty=${p.suggestedPO}&autoOpen=true`)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[10px] border border-emerald-200 cursor-pointer"
                          >
                            <span>Reorder</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
          <span className="text-[11px] text-slate-400">All metrics are verified from PostgreSQL immutable ledger logs.</span>
          <div className="flex items-center gap-2">
            {(data.quickActions || []).map((qa, idx) => (
              <button
                key={idx}
                onClick={() => handleAction(qa.path)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{qa.label}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ))}
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
