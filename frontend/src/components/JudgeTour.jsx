import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2 
} from 'lucide-react';

const TOUR_STEPS = [
  {
    step: 1,
    title: '1. Executive Command Center',
    path: '/dashboard',
    badge: 'HEALTH SCORE',
    desc: 'Notice the live 88/100 Health Score, dynamic KPI cards, and Recharts asset valuation trends computed straight from PostgreSQL ledger logs.',
    actionLabel: 'Go to Dashboard'
  },
  {
    step: 2,
    title: '2. "Why?" Root Cause Explainability',
    path: '/dashboard',
    badge: 'EXPLAINABILITY',
    desc: 'Click any [ Why? ] button on the dashboard KPIs to see a granular breakdown of contributing causes (velocity spikes, supplier delays, regional imbalances).',
    actionLabel: 'Inspect Why Modal'
  },
  {
    step: 3,
    title: '3. "What Happened?" Explorer',
    path: '/dashboard?tab=explorer',
    badge: 'TIMELINE',
    desc: 'Investigate receipts, deliveries, transfers, adjustments, and alerts in an interactive chronological timeline with date filters.',
    actionLabel: 'Open Explorer Tab'
  },
  {
    step: 4,
    title: '4. Inventory Replay Time Machine',
    path: '/dashboard?tab=replay',
    badge: 'TIME MACHINE',
    desc: 'Drag the timeline slider or press Play to reconstruct historical stock counts and asset valuation at any previous movement in company history.',
    actionLabel: 'Test Time Machine'
  },
  {
    step: 5,
    title: '5. Product X-Ray Telemetry',
    path: '/products',
    badge: 'PRODUCT X-RAY',
    desc: 'Click on any product row (e.g. Steel Sheets) to reveal 30-day depletion curves, consumption run-rates, and multi-warehouse allocation donuts.',
    actionLabel: 'Open Product Catalog'
  },
  {
    step: 6,
    title: '6. 1-Click Restock Workflow',
    path: '/receipts?productId=1&qty=75&autoOpen=true',
    badge: 'ZERO DEAD ENDS',
    desc: 'Zero dead buttons: clicking Reorder pre-fills supplier forms with optimal batch quantities. Click Validate to increment stock and append ledger.',
    actionLabel: 'Test 1-Click Receipt'
  },
  {
    step: 7,
    title: '7. Zero-Negative-Stock Concurrency Guard',
    path: '/deliveries',
    badge: 'ACID INVARIANT',
    desc: 'Dispatch is strictly verified against available stock. Attempting to deliver 50,000 units is blocked immediately at the database transaction level.',
    actionLabel: 'Verify Deliveries Guard'
  },
  {
    step: 8,
    title: '8. Warehouse Digital Twin & Flow',
    path: '/warehouses',
    badge: 'DIGITAL TWIN',
    desc: 'Inspect interactive high-bay racks, occupancy levels, stored SKUs, and the Sankey-style movement flow from Suppliers to Warehouses to Customers.',
    actionLabel: 'View Digital Twin'
  },
  {
    step: 9,
    title: '9. What-If Inventory Simulator',
    path: '/simulator',
    badge: 'SIMULATION',
    desc: 'Test hypothetical demand surges (+25%) and supplier delays (+7 days) in a completely sandboxed virtual engine without affecting real stock.',
    actionLabel: 'Run What-If Simulation'
  },
  {
    step: 10,
    title: '10. Ask StockSense AI Copilot',
    path: '/assistant',
    badge: 'AI COPILOT',
    desc: 'Ask conversational natural language questions ("Which items need restock?") to receive live telemetry audits with actionable deep links.',
    actionLabel: 'Ask AI Copilot'
  }
];

export default function JudgeTour() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const step = TOUR_STEPS[currentIdx];

  const handleNext = () => {
    if (currentIdx < TOUR_STEPS.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      navigate(TOUR_STEPS[nextIdx].path);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      navigate(TOUR_STEPS[prevIdx].path);
    }
  };

  const handleNavigateCurrent = () => {
    navigate(step.path);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => {
            setIsOpen(true);
            navigate(step.path);
          }}
          className="flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full font-bold text-xs shadow-lg shadow-amber-500/25 border border-amber-400/40 transition-all hover:scale-105 cursor-pointer group"
        >
          <Trophy className="h-4 w-4 animate-bounce" />
          <span>🏆 Start Judge Demo Tour</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono">10 Steps</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm sm:max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-4 text-white space-y-3 relative overflow-hidden backdrop-blur-md">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-blue-500" />

        {/* Top controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              Judge Evaluation Tour • Step {step.step} / {TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Title & Badge */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-sm text-white">{step.title}</h4>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {step.badge}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">{step.desc}</p>
        </div>

        {/* Bottom action row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <button
            onClick={handleNavigateCurrent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <span>{step.actionLabel}</span>
            <ArrowRight className="h-3 w-3" />
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white cursor-pointer"
              title="Previous Step"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-400 px-1">{currentIdx + 1}/{TOUR_STEPS.length}</span>
            <button
              onClick={handleNext}
              disabled={currentIdx === TOUR_STEPS.length - 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white cursor-pointer"
              title="Next Step"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
