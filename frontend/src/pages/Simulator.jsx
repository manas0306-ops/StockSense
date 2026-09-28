import React, { useState, useEffect } from 'react';
import { advancedService } from '../services/advancedService';
import { 
  Sparkles, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Warehouse, 
  ShieldCheck, 
  Sliders, 
  Download, 
  FileText,
  Boxes,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

export default function Simulator() {
  const [demandDelta, setDemandDelta] = useState(25); // +25%
  const [supplierDelayDays, setSupplierDelayDays] = useState(7); // 7 days
  const [capacityMultiplier, setCapacityMultiplier] = useState(1.0);
  const [deliveryMultiplier, setDeliveryMultiplier] = useState(1.2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runSim = async () => {
    setLoading(true);
    try {
      const res = await advancedService.runSimulation({
        demandDelta,
        supplierDelayDays,
        capacityMultiplier,
        deliveryMultiplier
      });
      setResult(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSim();
  }, [demandDelta, supplierDelayDays, capacityMultiplier, deliveryMultiplier]);

  const handleReset = () => {
    setDemandDelta(0);
    setSupplierDelayDays(0);
    setCapacityMultiplier(1.0);
    setDeliveryMultiplier(1.0);
  };

  const chartData = result ? [
    {
      metric: 'Stock Units (/100)',
      Current: Math.round(result.current.stockUnits / 100),
      Simulated: Math.round(result.simulated.stockUnits / 100)
    },
    {
      metric: 'Asset Value ($k)',
      Current: Math.round(result.current.valuation / 1000),
      Simulated: Math.round(result.simulated.valuation / 1000)
    },
    {
      metric: 'Risk SKUs',
      Current: result.current.riskSKUs,
      Simulated: result.simulated.riskSKUs
    },
    {
      metric: 'Warehouse Util (%)',
      Current: result.current.capacityUtilization,
      Simulated: result.simulated.capacityUtilization
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header & Sandbox Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">What-If Inventory Simulator</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              VIRTUAL SANDBOX
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Test supply chain disruptions, demand spikes, and facility expansions in real time without modifying production stock.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Scenarios</span>
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs text-purple-900 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
          <span>
            <strong>Sandbox Guarantee:</strong> Simulations execute purely in virtual memory. Real inventory, database balances, and ledger logs remain 100% immutable.
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-purple-700 shrink-0">ISOLATED ENGINE</span>
      </div>

      {/* Main Grid: Controls vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario Knobs (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="h-4 w-4 text-purple-600" />
              <span>Simulation Variables</span>
            </h2>

            {/* Slider 1: Demand Shift */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Market Demand Shift</span>
                <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                  demandDelta > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-700'
                }`}>
                  {demandDelta > 0 ? `+${demandDelta}%` : `${demandDelta}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="100"
                step="5"
                value={demandDelta}
                onChange={(e) => setDemandDelta(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-50% Recession</span>
                <span>Normal (0%)</span>
                <span>+100% Surge</span>
              </div>
            </div>

            {/* Slider 2: Supplier Delay */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Supplier Lead-Time Delay</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-rose-50 text-rose-700 border border-rose-200">
                  +{supplierDelayDays} Days
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="21"
                step="1"
                value={supplierDelayDays}
                onChange={(e) => setSupplierDelayDays(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>On Time (0d)</span>
                <span>+7 Days</span>
                <span>+21 Days (Severe)</span>
              </div>
            </div>

            {/* Slider 3: Facility Capacity Adjustment */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Warehouse Capacity Scaling</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700 border border-blue-200">
                  {Math.round((capacityMultiplier - 1) * 100) > 0 ? `+${Math.round((capacityMultiplier - 1) * 100)}%` : `${Math.round((capacityMultiplier - 1) * 100)}%`}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={capacityMultiplier}
                onChange={(e) => setCapacityMultiplier(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-50% Downsize</span>
                <span>Rated Capacity</span>
                <span>+50% Expansion</span>
              </div>
            </div>

            {/* Slider 4: Outbound Delivery Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Outbound Dispatch Rate</span>
                <span className="font-mono font-bold px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {deliveryMultiplier.toFixed(1)}x Velocity
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={deliveryMultiplier}
                onChange={(e) => setDeliveryMultiplier(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.5x Slower</span>
                <span>1.0x Normal</span>
                <span>2.5x Overdrive</span>
              </div>
            </div>

            {/* Preset Scenarios */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Scenario Presets
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setDemandDelta(30); setSupplierDelayDays(5); setCapacityMultiplier(1.0); setDeliveryMultiplier(1.3); }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-left text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  ⚡ Holiday Rush (+30%)
                </button>
                <button
                  onClick={() => { setDemandDelta(10); setSupplierDelayDays(14); setCapacityMultiplier(1.0); setDeliveryMultiplier(1.0); }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-left text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  🚢 Port Congestion (+14d)
                </button>
                <button
                  onClick={() => { setDemandDelta(50); setSupplierDelayDays(10); setCapacityMultiplier(1.2); setDeliveryMultiplier(1.8); }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-left text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  🔥 Black Swan Spike
                </button>
                <button
                  onClick={() => { setDemandDelta(-25); setSupplierDelayDays(0); setCapacityMultiplier(1.0); setDeliveryMultiplier(0.8); }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-left text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  📉 Demand Slowdown
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Comparison (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Metric Comparison Cards */}
          {result && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Card 1: Stock Units */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simulated Stock</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black font-mono text-slate-900">{result.simulated.stockUnits.toLocaleString()}</span>
                  <span className="text-xs text-slate-400">units</span>
                </div>
                <div className="text-[11px] flex items-center gap-1 font-semibold pt-1">
                  {result.delta.stockUnits >= 0 ? (
                    <span className="text-emerald-600 font-mono">+{result.delta.stockUnits.toLocaleString()} vs live</span>
                  ) : (
                    <span className="text-rose-600 font-mono">{result.delta.stockUnits.toLocaleString()} vs live</span>
                  )}
                </div>
              </div>

              {/* Card 2: Asset Valuation */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simulated Valuation</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black font-mono text-slate-900">${(result.simulated.valuation / 1000).toFixed(0)}k</span>
                </div>
                <div className="text-[11px] flex items-center gap-1 font-semibold pt-1">
                  {result.delta.valuation >= 0 ? (
                    <span className="text-emerald-600 font-mono">+${(result.delta.valuation / 1000).toFixed(0)}k shift</span>
                  ) : (
                    <span className="text-rose-600 font-mono">-${Math.abs(result.delta.valuation / 1000).toFixed(0)}k tied</span>
                  )}
                </div>
              </div>

              {/* Card 3: Stockout Risk SKUs */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SKUs at Risk</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-black font-mono ${result.simulated.riskSKUs > 4 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {result.simulated.riskSKUs}
                  </span>
                  <span className="text-xs text-slate-400">items</span>
                </div>
                <div className="text-[11px] flex items-center gap-1 font-semibold pt-1 text-slate-500">
                  <span>Current: <strong>4 SKUs</strong></span>
                </div>
              </div>

              {/* Card 4: Warehouse Capacity */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Storage Capacity</span>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl font-black font-mono ${result.simulated.capacityUtilization >= 85 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {result.simulated.capacityUtilization}%
                  </span>
                  <span className="text-xs text-slate-400">utilized</span>
                </div>
                <div className="text-[11px] flex items-center gap-1 font-semibold pt-1 text-slate-500">
                  <span>Current: <strong>76%</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Recharts Bar Chart: Current vs Simulated */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Current vs. Simulated Impact Matrix</h3>
                <p className="text-xs text-slate-500">Comparison across units, value, risk SKUs, and capacity percentage</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">RECHARTS ENGINE</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Current" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Simulated" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Qualitative AI Impact Assessment */}
          {result && (
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                <Sparkles className="h-4 w-4" />
                <span>StockSense Simulator Executive Diagnosis</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {result.narrative}
              </p>
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-400">Recommended mitigation: Schedule buffer PO of <strong>+250 units</strong> to avoid downtime.</span>
                <a
                  href="/receipts?autoOpen=true"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Prepare Mitigation PO</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
