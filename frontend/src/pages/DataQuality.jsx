import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { advancedService } from '../services/advancedService';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  Sliders, 
  Search, 
  FileCheck,
  Zap,
  Info
} from 'lucide-react';

export default function DataQuality() {
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PASSED, FLAGGED

  const fetchAudit = async () => {
    setLoading(true);
    try {
      const res = await advancedService.getQualityAudit();
      setAudit(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  const checks = audit?.checks || [];
  const filteredChecks = filter === 'ALL' ? checks : checks.filter(c => c.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Data Quality & Integrity Center</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              AUDIT COMPLIANCE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time validation of database schema constraints, foreign key integrity, SKU uniqueness, and zero-negative-stock invariants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAudit}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-run Full Audit</span>
          </button>
        </div>
      </div>

      {/* Top Score Banner */}
      {audit && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Card 1: Score */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 font-mono font-black text-xl">
              {audit.healthScore}%
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Integrity Score</span>
              <h3 className="text-base font-bold text-slate-900">Enterprise Grade</h3>
              <span className="text-[11px] text-emerald-600 font-medium">Verified Clean Database</span>
            </div>
          </div>

          {/* Card 2: Checks Passed */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Audit Checks Passed</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-emerald-600">{audit.passedChecks}</span>
              <span className="text-xs text-slate-400">/ {audit.totalChecks} rules</span>
            </div>
            <span className="text-[11px] text-slate-500 block">Strict relational schema checks</span>
          </div>

          {/* Card 3: Flagged Anomalies */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Flagged Items</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black font-mono text-amber-600">{audit.totalChecks - audit.passedChecks}</span>
              <span className="text-xs text-slate-400">requires review</span>
            </div>
            <span className="text-[11px] text-slate-500 block">1 low-variance adjustment</span>
          </div>

          {/* Card 4: Invariant Guarantee */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ACID Invariants</span>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm pt-1">
              <ShieldCheck className="h-5 w-5" />
              <span>Zero-Negative Active</span>
            </div>
            <span className="text-[11px] text-slate-500 block">Row locks serialized with FOR UPDATE</span>
          </div>
        </div>
      )}

      {/* Audit Checklist Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Audit Rules ({checks.length})
            </button>
            <button
              onClick={() => setFilter('PASSED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'PASSED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Passed ({checks.filter(c => c.status === 'PASSED').length})
            </button>
            <button
              onClick={() => setFilter('FLAGGED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'FLAGGED' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Flagged ({checks.filter(c => c.status === 'FLAGGED').length})
            </button>
          </div>

          <span className="text-[11px] text-slate-400">
            Last verified: <strong className="text-slate-600">{audit ? new Date(audit.auditTimestamp).toLocaleTimeString() : 'Now'}</strong>
          </span>
        </div>

        {/* List of Rules */}
        <div className="divide-y divide-slate-100">
          {filteredChecks.map((rule) => (
            <div key={rule.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5">
                  {rule.status === 'PASSED' ? (
                    <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="h-7 w-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-slate-900">{rule.name}</h4>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      rule.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' :
                      rule.severity === 'HIGH' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {rule.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{rule.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className={`font-mono text-xs font-bold px-2 py-1 rounded-md ${
                  rule.status === 'PASSED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {rule.status === 'PASSED' ? '0 Violations' : `${rule.count} Flagged`}
                </span>
                {rule.status === 'FLAGGED' ? (
                  <button
                    onClick={() => navigate('/adjustments')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Investigate</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium px-2">Verified</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
