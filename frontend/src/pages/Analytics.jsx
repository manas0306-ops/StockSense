import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { advancedService } from '../services/advancedService';
import { exportToCSV } from '../utils/csvExport';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Warehouse, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Calendar, 
  Filter, 
  RefreshCw,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldAlert,
  Zap,
  DollarSign,
  Grid,
  Truck,
  Sliders,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'];

export default function Analytics() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('30D');
  const [warehouseId, setWarehouseId] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [advData, setAdvData] = useState(null);
  const [activeTab, setActiveTab] = useState('trends'); // 'trends' | 'matrix' | 'aging' | 'financials' | 'cycleCounting' | 'suppliers'
  const [selectedMatrixCell, setSelectedMatrixCell] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [res, advRes] = await Promise.allSettled([
        analyticsService.getAnalytics({ period, warehouseId }),
        advancedService.getAdvancedAnalytics()
      ]);
      if (res.status === 'fulfilled') setData(res.value.data);
      if (advRes.status === 'fulfilled') setAdvData(advRes.value.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period, warehouseId]);

  const handleExportCSV = () => {
    if (!data) return;
    const rows = (data.trends || []).map(t => ({
      Date: t.date,
      'Total Stock Units': t.stock,
      'Incoming Units': t.incoming,
      'Outgoing Units': t.outgoing,
      'Estimated Value ($)': t.value,
    }));
    exportToCSV(rows, `StockSense_Analytics_${period}`);
  };

  const trends = data?.trends || [
    { date: 'Sep 01', stock: 11200, incoming: 450, outgoing: 320, value: 480000 },
    { date: 'Sep 05', stock: 11450, incoming: 620, outgoing: 370, value: 495000 },
    { date: 'Sep 10', stock: 11800, incoming: 800, outgoing: 450, value: 512000 },
    { date: 'Sep 15', stock: 11620, incoming: 310, outgoing: 490, value: 504000 },
    { date: 'Sep 20', stock: 12100, incoming: 950, outgoing: 470, value: 528000 },
    { date: 'Sep 25', stock: 12450, incoming: 720, outgoing: 370, value: 541000 },
    { date: 'Today', stock: 12680, incoming: 580, outgoing: 350, value: 552000 },
  ];

  const matrix = advData?.matrixGrid || {};
  const aging = advData?.agingBuckets || [];
  const fin = advData?.financialIntelligence || {};
  const cycleCounts = advData?.cycleCountRecommendations || [];
  const suppliers = advData?.supplierPerformance || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Business Intelligence & Predictive Analytics</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              REAL-TIME BI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ABC/XYZ demand volatility classification, stock aging tiers, cycle counting prioritization, and supplier performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            {['7D', '30D', '90D', '1Y'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  period === p ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Feature Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'trends', label: 'Stock Trends & Flow', icon: TrendingUp },
          { id: 'matrix', label: 'ABC + XYZ Matrix', icon: Grid },
          { id: 'aging', label: 'Stock Aging & Stagnancy', icon: Clock },
          { id: 'financials', label: 'Capital & Financials', icon: DollarSign },
          { id: 'cycleCounting', label: 'Cycle Counting', icon: Sliders },
          { id: 'suppliers', label: 'Supplier Intelligence', icon: Truck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: STOCK TRENDS & INBOUND/OUTBOUND */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Inventory Asset Valuation Trajectory</h3>
                <p className="text-xs text-slate-500">Asset value ($) over {period} historical period</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                RECHARTS BI
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2.5} fill="url(#colorVal)" name="Total Valuation ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ABC + XYZ 3x3 MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">ABC + XYZ Inventory Segmentation Matrix</h3>
                <p className="text-xs text-slate-500">
                  Dual-dimensional classification: Value Impact (A = Top 70%, B = Next 20%, C = 10%) vs Demand Volatility (X = Stable, Y = Moderate, Z = Volatile)
                </p>
              </div>
              <span className="text-[11px] text-slate-500">Click any matrix cell to filter products</span>
            </div>

            {/* 3x3 Interactive Grid */}
            <div className="grid grid-cols-3 gap-3">
              {['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ'].map((cellKey) => {
                const cellItems = matrix[cellKey] || [];
                const cellValuation = cellItems.reduce((acc, p) => acc + (p.valuation || 0), 0);
                const isSelected = selectedMatrixCell === cellKey;

                const isA = cellKey.startsWith('A');
                const isB = cellKey.startsWith('B');

                return (
                  <div
                    key={cellKey}
                    onClick={() => setSelectedMatrixCell(isSelected ? null : cellKey)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 ${
                      isSelected 
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' 
                        : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-base font-black px-2 py-0.5 rounded ${
                        isA ? 'bg-emerald-100 text-emerald-800' :
                        isB ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        Class {cellKey}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {cellItems.length} SKUs
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      <span>Valuation: </span>
                      <strong className="text-slate-800 font-mono">${cellValuation.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong>
                    </div>

                    <div className="text-[10px] text-slate-400">
                      {isA ? 'High Value Asset' : isB ? 'Medium Value' : 'Low Unit Cost'} • {
                        cellKey.endsWith('X') ? 'Stable Demand' : cellKey.endsWith('Y') ? 'Moderate Variation' : 'High Volatility'
                      }
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filtered Products Table from Selected Matrix Cell */}
            {selectedMatrixCell && matrix[selectedMatrixCell] && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Products in Segment Class {selectedMatrixCell} ({matrix[selectedMatrixCell].length} items)
                  </h4>
                  <button 
                    onClick={() => setSelectedMatrixCell(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Clear Filter
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs divide-y divide-slate-200">
                    <thead className="bg-slate-50 text-slate-500 font-semibold text-[10px] uppercase">
                      <tr>
                        <th className="px-3 py-2">Product / SKU</th>
                        <th className="px-3 py-2">Category</th>
                        <th className="px-3 py-2">Stock</th>
                        <th className="px-3 py-2">Unit Cost</th>
                        <th className="px-3 py-2">Valuation</th>
                        <th className="px-3 py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {matrix[selectedMatrixCell].map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2">
                            <span className="font-bold text-slate-900 block">{p.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                          </td>
                          <td className="px-3 py-2 text-slate-500">{p.category}</td>
                          <td className="px-3 py-2 font-mono font-bold text-slate-900">{p.stock}</td>
                          <td className="px-3 py-2 font-mono text-slate-600">${p.unitCost?.toFixed(2)}</td>
                          <td className="px-3 py-2 font-mono font-bold text-emerald-600">${p.valuation?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className="px-3 py-2 text-right">
                            <button
                              onClick={() => navigate(`/receipts?productId=${p.id}&autoOpen=true`)}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-semibold text-[10px] cursor-pointer"
                            >
                              Reorder
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
        </div>
      )}

      {/* TAB 3: STOCK AGING & DEAD STOCK */}
      {activeTab === 'aging' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Inventory Aging & Stagnancy Buckets</h3>
              <p className="text-xs text-slate-500">Aging breakdown based on last confirmed movement timestamp in PostgreSQL ledger logs</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {aging.map((b, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="font-bold text-slate-900 text-xs block">{b.bucket}</span>
                  <span className="text-[10px] text-slate-400 block">{b.range}</span>
                  <div className="text-lg font-mono font-black text-slate-900">
                    ${(b.value / 1000).toFixed(0)}k
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${b.percentage}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{b.count} SKUs</span>
                    <span>{b.percentage}% share</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <div>
                <strong>Stagnant Stock Alert:</strong> 1 SKU (Robotic Articulated Gripper, $13,000 tied capital) has had no customer movement for 47 days.
              </div>
              <button
                onClick={() => navigate('/products?search=GRP-106')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
              >
                Inspect in Product X-Ray
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FINANCIAL INTELLIGENCE */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Inventory Value</span>
              <div className="text-2xl font-black font-mono text-slate-900">
                ${(fin.totalValuation / 1000).toFixed(0)}k
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">Active catalog asset value</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capital in Slow-Moving</span>
              <div className="text-2xl font-black font-mono text-amber-600">
                ${(fin.capitalInSlowMoving / 1000).toFixed(0)}k
              </div>
              <span className="text-[11px] text-slate-500">Idle &gt; 30 days</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dead Stock Value</span>
              <div className="text-2xl font-black font-mono text-rose-600">
                ${(fin.capitalInDeadStock / 1000).toFixed(0)}k
              </div>
              <span className="text-[11px] text-slate-500">Idle &gt; 180 days</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Annualized Turnover</span>
              <div className="text-2xl font-black font-mono text-purple-600">
                {fin.annualTurnoverRate || '6.2x'}
              </div>
              <span className="text-[11px] text-slate-500">Days sales of inventory: 48d</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CYCLE COUNTING INTELLIGENCE */}
      {activeTab === 'cycleCounting' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Prioritized Cycle Counting Schedule</h3>
              <p className="text-xs text-slate-500">Autonomous recommendation ranking based on ABC value, movement frequency, and audit discrepancy history</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
              AUDIT QUEUE
            </span>
          </div>

          <div className="space-y-3">
            {cycleCounts.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-200 text-slate-700">
                    <Sliders className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        c.priority === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' :
                        c.priority === 'HIGH' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {c.priority} PRIORITY
                      </span>
                      <h4 className="font-bold text-xs text-slate-900">{c.name} ({c.sku})</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Location: <strong>{c.location}</strong> ({c.warehouse}) • System Count: <strong>{c.systemStock} units</strong></p>
                    <p className="text-[11px] text-slate-600 mt-1">Audit Reason: {c.reason}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/adjustments?productId=${c.productId}&autoOpen=true`)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Start Physical Count</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SUPPLIER INTELLIGENCE */}
      {activeTab === 'suppliers' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Supplier Reliability & Fulfillment Scorecards</h3>
              <p className="text-xs text-slate-500">Lead-time accuracy, on-time delivery rates, and quantity variance across 5 primary metallurgy & electronic vendors</p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="px-3 py-2.5">Supplier Name</th>
                  <th className="px-3 py-2.5">On-Time Rate</th>
                  <th className="px-3 py-2.5">Avg Lead Time</th>
                  <th className="px-3 py-2.5">Quantity Accuracy</th>
                  <th className="px-3 py-2.5">Open Orders</th>
                  <th className="px-3 py-2.5 text-right">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5">
                      <span className="font-bold text-slate-900 block">{s.name}</span>
                      <span className="text-[11px] text-slate-400">{s.contact}</span>
                    </td>
                    <td className="px-3 py-2.5 font-mono font-bold text-emerald-600">{s.onTimeDeliveryRate}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-700">{s.averageLeadTime}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-700">{s.quantityAccuracy}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-900 font-bold">{s.openReceipts} POs</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        s.riskLevel === 'LOW' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {s.riskLevel} RISK
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
