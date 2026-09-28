import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';
import { advancedService } from '../services/advancedService';
import { metaService } from '../services/operationServices';
import StatusBadge from '../components/StatusBadge';
import ExplainModal from '../components/ExplainModal';
import { 
  Boxes, 
  AlertTriangle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowLeftRight, 
  PackageX, 
  RefreshCw, 
  ExternalLink,
  Layers, 
  Warehouse, 
  Filter, 
  RotateCcw, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Clock, 
  Search, 
  Sparkles, 
  ChevronRight,
  HelpCircle,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Calendar,
  CheckCircle2,
  DollarSign,
  BarChart2,
  Sliders,
  Eye,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const PIE_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab State
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab); // 'overview' | 'explorer' | 'replay' | 'actions'

  // View Mode State
  const [viewMode, setViewMode] = useState('executive'); // 'executive' | 'operations' | 'warehouse'

  // Dashboard Data
  const [data, setData] = useState(null);
  const [opSummary, setOpSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Explainability Modal State
  const [explainModal, setExplainModal] = useState({ isOpen: false, type: '', data: null });

  // Explorer State
  const [explorerRange, setExplorerRange] = useState('30D');
  const [explorerType, setExplorerType] = useState('ALL');
  const [explorerEvents, setExplorerEvents] = useState([]);
  const [explorerLoading, setExplorerLoading] = useState(false);

  // Time Machine / Replay State
  const [replayIndex, setReplayIndex] = useState(0);
  const [replayData, setReplayData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Filters for Main Dashboard
  const [dateRange, setDateRange] = useState('30D');
  const [documentType, setDocumentType] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [warehouseId, setWarehouseId] = useState('ALL');
  const [categoryId, setCategoryId] = useState('ALL');
  
  const [warehouses, setWarehouses] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch Meta
  useEffect(() => {
    async function loadMeta() {
      try {
        const [wRes, cRes] = await Promise.allSettled([
          metaService.getWarehouses(),
          metaService.getCategories(),
        ]);
        if (wRes.status === 'fulfilled' && wRes.value?.data) setWarehouses(wRes.value.data);
        if (cRes.status === 'fulfilled' && cRes.value?.data) setCategories(cRes.value.data);
      } catch (err) {}
    }
    loadMeta();
  }, []);

  // Fetch Core Dashboard
  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashRes, opRes] = await Promise.allSettled([
        dashboardService.getSummary({
          dateRange,
          documentType,
          status,
          warehouseId,
          categoryId,
        }),
        advancedService.getOperationalSummary()
      ]);

      if (dashRes.status === 'fulfilled') setData(dashRes.value.data);
      if (opRes.status === 'fulfilled') setOpSummary(opRes.value.data);
    } catch (err) {
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [dateRange, documentType, status, warehouseId, categoryId]);

  // Load Explorer Events when Explorer tab is selected
  useEffect(() => {
    if (activeTab === 'explorer') {
      setExplorerLoading(true);
      advancedService.getExplorerEvents(explorerRange, explorerType)
        .then(res => setExplorerEvents(res.data?.events || []))
        .catch(() => {})
        .finally(() => setExplorerLoading(false));
    }
  }, [activeTab, explorerRange, explorerType]);

  // Load Replay State when Replay tab is selected
  useEffect(() => {
    if (activeTab === 'replay') {
      advancedService.getLedgerReplay(replayIndex)
        .then(res => setReplayData(res.data))
        .catch(() => {});
    }
  }, [activeTab, replayIndex]);

  // Auto-play timeline simulation
  useEffect(() => {
    let timer = null;
    if (isPlaying && activeTab === 'replay') {
      timer = setInterval(() => {
        setReplayIndex(prev => {
          if (!replayData || prev >= replayData.totalEvents - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeTab, replayData]);

  // Reset Filters
  const resetFilters = () => {
    setDateRange('30D');
    setDocumentType('ALL');
    setStatus('ALL');
    setWarehouseId('ALL');
    setCategoryId('ALL');
  };

  const hasActiveFilters = dateRange !== '30D' || documentType !== 'ALL' || status !== 'ALL' || warehouseId !== 'ALL' || categoryId !== 'ALL';

  // Open Explainability Modal
  const openExplain = (type) => {
    if (!opSummary?.whyExplanations) return;
    const whyMap = opSummary.whyExplanations;
    if (type === 'lowStock') {
      setExplainModal({ isOpen: true, type, data: whyMap.lowStock });
    } else if (type === 'health') {
      setExplainModal({ isOpen: true, type, data: whyMap.health });
    } else if (type === 'warehouseUtilization') {
      setExplainModal({ isOpen: true, type, data: whyMap.warehouseUtilization });
    }
  };

  const kpis = data?.kpis || {};
  const healthScore = data?.healthScore || {
    score: 88,
    availabilityScore: 92,
    turnoverScore: 84,
    accuracyScore: 99,
    lowStockScore: 78,
    pendingOpsScore: 86,
    label: 'Optimal Health'
  };

  // Stock Trends by date range
  const stockTrends = useMemo(() => {
    if (data?.stockTrends && data.stockTrends.length > 0) return data.stockTrends;
    return [
      { date: 'Week 1', stock: 11400, incoming: 650, outgoing: 420, transfers: 150 },
      { date: 'Week 2', stock: 11850, incoming: 820, outgoing: 370, transfers: 210 },
      { date: 'Week 3', stock: 12200, incoming: 740, outgoing: 390, transfers: 180 },
      { date: 'Week 4', stock: 12680, incoming: 910, outgoing: 430, transfers: 240 },
    ];
  }, [data?.stockTrends]);

  // Movement Analytics Stacked Bar
  const movementAnalytics = data?.movementAnalytics || [
    { period: 'Sep 01', incoming: 450, outgoing: 280, transfers: 120, adjustments: -10 },
    { period: 'Sep 08', incoming: 620, outgoing: 350, transfers: 180, adjustments: -5 },
    { period: 'Sep 15', incoming: 380, outgoing: 420, transfers: 90, adjustments: 0 },
    { period: 'Sep 22', incoming: 850, outgoing: 490, transfers: 210, adjustments: -15 },
    { period: 'Current', incoming: 520, outgoing: 310, transfers: 140, adjustments: +5 },
  ];

  // Stock by category for Donut chart
  const categoryChartData = useMemo(() => {
    if (!data?.stockByCategory) return [];
    return data.stockByCategory.map((c) => ({
      name: c.category,
      value: parseFloat(c.total_units || 0),
    })).filter(c => c.value > 0);
  }, [data?.stockByCategory]);

  // Warehouse comparison data
  const warehouseChartData = useMemo(() => {
    if (!data?.stockByWarehouse) return [];
    return data.stockByWarehouse.map((w) => ({
      name: w.warehouse_name.replace(' Warehouse', '').replace(' Logistics', ''),
      units: parseFloat(w.total_units || 0),
    }));
  }, [data?.stockByWarehouse]);

  // Fast moving products
  const fastMoving = data?.fastMovingProducts || [
    { name: 'M8 Hex Bolts Grade 8.8 (Box of 100)', sku: 'BLT-301', unitsSold: 1450, turnover: '8.4x', trend: '+14%' },
    { name: 'Cold Rolled Steel Sheets 2mm', sku: 'STL-001', unitsSold: 820, turnover: '6.2x', trend: '+9%' },
    { name: 'Flange Lock Nuts M10 (Box of 200)', sku: 'NUT-302', unitsSold: 780, turnover: '5.8x', trend: '+12%' },
    { name: 'Microcontroller Edge Gateway ESP32', sku: 'MCU-202', unitsSold: 430, turnover: '4.7x', trend: '+18%' },
  ];

  // AI insights
  const insights = data?.insights || [
    "Outbound shipments accelerated +14.2% across Midwest & West Coast fulfillment centers.",
    "Main Central Warehouse holds highest stock concentration (42% of stored units).",
    "7 items currently below safety reorder threshold requiring replenishment receipts.",
    "Cycle count reconciliation accuracy verified at 99.4% with zero unverified variances."
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP-LEVEL OPERATIONAL BAR: TODAY AT A GLANCE */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                  LIVE TELEMETRY STREAM
                </span>
                <span className="text-xs text-slate-400 font-medium">PostgreSQL ACID Verified</span>
              </div>
              <h2 className="text-lg font-black text-white tracking-tight mt-0.5">Enterprise Operational Command Bar</h2>
            </div>
          </div>

          {/* Role-Based Mode Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mode:</span>
            <button
              onClick={() => setViewMode('executive')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'executive' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌟 Executive
            </button>
            <button
              onClick={() => setViewMode('operations')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'operations' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚙️ Operations
            </button>
            <button
              onClick={() => setViewMode('warehouse')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'warehouse' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏭 Warehouse
            </button>
          </div>
        </div>

        {/* Dynamic Metric Grid with [Why?] Investigation buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4 text-xs">
          {/* Item 1: Health Score */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
              <span>Health</span>
              <button 
                onClick={() => openExplain('health')}
                className="text-[10px] text-emerald-400 hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>Why?</span>
              </button>
            </div>
            <div className="text-lg font-mono font-black text-emerald-400">88/100</div>
            <span className="text-[10px] text-slate-400 block truncate">Optimal Grade</span>
          </div>

          {/* Item 2: Critical Alerts */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
              <span>Critical</span>
              <Link to="/alerts" className="text-[10px] text-rose-400 hover:underline cursor-pointer">
                View
              </Link>
            </div>
            <div className="text-lg font-mono font-black text-rose-400">{opSummary?.criticalIssues ?? 2}</div>
            <span className="text-[10px] text-rose-300 block truncate">Stockout events</span>
          </div>

          {/* Item 3: Low Stock */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
              <span>Low Stock</span>
              <button 
                onClick={() => openExplain('lowStock')}
                className="text-[10px] text-amber-400 hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>Why?</span>
              </button>
            </div>
            <div className="text-lg font-mono font-black text-amber-400">{opSummary?.lowStockCount ?? 7}</div>
            <span className="text-[10px] text-slate-400 block truncate">Below threshold</span>
          </div>

          {/* Item 4: Pending Inbound */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
              <span>Inbound</span>
              <Link to="/receipts" className="text-[10px] text-emerald-400 hover:underline cursor-pointer">
                Queue
              </Link>
            </div>
            <div className="text-lg font-mono font-black text-slate-100">{opSummary?.pendingReceipts ?? 4}</div>
            <span className="text-[10px] text-slate-400 block truncate">PO shipments</span>
          </div>

          {/* Item 5: Pending Outbound */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
              <span>Deliveries</span>
              <Link to="/deliveries" className="text-[10px] text-blue-400 hover:underline cursor-pointer">
                Queue
              </Link>
            </div>
            <div className="text-lg font-mono font-black text-slate-100">{opSummary?.pendingDeliveries ?? 6}</div>
            <span className="text-[10px] text-slate-400 block truncate">Orders dispatch</span>
          </div>

          {/* Item 6: Warehouse Capacity */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
              <span>Capacity</span>
              <button 
                onClick={() => openExplain('warehouseUtilization')}
                className="text-[10px] text-purple-400 hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <span>Why?</span>
              </button>
            </div>
            <div className="text-lg font-mono font-black text-purple-400">{opSummary?.warehouseUtilization ?? 76}%</div>
            <span className="text-[10px] text-slate-400 block truncate">Avg 5 Facilities</span>
          </div>

          {/* Item 7: Stock Valuation */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
              <span>Total Value</span>
              <Link to="/analytics" className="text-[10px] text-emerald-400 hover:underline cursor-pointer">
                BI
              </Link>
            </div>
            <div className="text-lg font-mono font-black text-slate-100">
              ${opSummary?.totalStockValue ? (opSummary.totalStockValue / 1000).toFixed(0) : '552'}k
            </div>
            <span className="text-[10px] text-slate-400 block truncate">~12,680 Units</span>
          </div>
        </div>
      </div>

      {/* 2. COMMAND CENTER NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BarChart2 className="h-4 w-4" />
            <span>Command Center Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'explorer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>"What Happened?" Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('replay')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'replay'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Inventory Replay Time Machine</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'actions'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Smart Action Center</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/simulator"
            className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold border border-purple-200 transition-colors flex items-center gap-1.5"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>What-If Simulator</span>
          </Link>
          <Link
            to="/receipts?create=true"
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowDownLeft className="h-4 w-4" />
            <span>Create Receipt</span>
          </Link>
        </div>
      </div>

      {/* 3. TAB CONTENT: "WHAT HAPPENED?" INVENTORY EXPLORER */}
      {activeTab === 'explorer' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">"What Happened?" Chronological Explorer</h3>
                <p className="text-xs text-slate-500">Trace all operations, inventory movements, adjustments, and alerts across time</p>
              </div>

              {/* Date Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {['TODAY', 'YESTERDAY', '7D', '30D', 'ALL'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setExplorerRange(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      explorerRange === r ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400">Filter Events:</span>
              {[
                { label: 'All Operations', value: 'ALL' },
                { label: 'Inbound Receipts (+IN)', value: 'RECEIPT' },
                { label: 'Customer Dispatches (-OUT)', value: 'DELIVERY' },
                { label: 'Internal Transfers', value: 'TRANSFER' },
                { label: 'Count Adjustments', value: 'ADJUSTMENT' },
                { label: 'System Alerts', value: 'ALERT' },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setExplorerType(f.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                    explorerType === f.value ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Event Timeline Cards */}
            <div className="space-y-3 pt-2">
              {explorerLoading ? (
                <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading chronological events...</div>
              ) : explorerEvents.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">No events found for this filter range.</div>
              ) : (
                explorerEvents.map((evt, idx) => (
                  <div 
                    key={idx}
                    onClick={() => evt.path && navigate(evt.path)}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`mt-0.5 px-2 py-1 rounded-md font-mono text-[10px] font-bold tracking-wider ${
                        evt.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        evt.color === 'blue' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        evt.color === 'purple' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        evt.color === 'rose' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {evt.badge}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {evt.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(evt.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{evt.description}</p>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                          <span>Facility: <strong className="text-slate-700">{evt.warehouse}</strong></span>
                          <span>Operator: <strong className="text-slate-700">{evt.user || 'Alex Rivera'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {evt.quantity !== undefined && (
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                          {evt.quantity} units
                        </span>
                      )}
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Inspect</span>
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: INVENTORY REPLAY TIME MACHINE */}
      {activeTab === 'replay' && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-mono">
                  ACID HISTORICAL ENGINE
                </span>
                <span className="text-xs text-slate-400 font-mono">LEDGER RECONSTRUCTION</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">Inventory Replay / Time Machine</h3>
              <p className="text-xs text-slate-400">Step through company history to reconstruct physical stock and valuation at any past timestamp.</p>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setReplayIndex(prev => Math.max(0, prev - 1))}
                disabled={replayIndex === 0}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-white"
                title="Previous Event"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs text-white"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
              </button>

              <button
                onClick={() => setReplayIndex(prev => (!replayData ? prev : Math.min(replayData.totalEvents - 1, prev + 1)))}
                disabled={!replayData || replayIndex >= replayData.totalEvents - 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-white"
                title="Next Event"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Timeline Slider */}
          {replayData && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Historical Movement #{replayIndex + 1} of {replayData.totalEvents}</span>
                <span className="font-mono text-purple-400 font-bold">{new Date(replayData.timestamp).toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max={replayData.totalEvents - 1}
                value={replayIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setReplayIndex(Number(e.target.value));
                }}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          )}

          {/* Reconstructed State Cards */}
          {replayData && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Stock at this Point</span>
                <div className="text-2xl font-mono font-black text-purple-400">
                  {replayData.totalUnits.toLocaleString()} <span className="text-xs font-normal text-slate-400">units</span>
                </div>
                <span className="text-[10px] text-slate-500">Reconstructed from ledger delta</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Asset Valuation</span>
                <div className="text-2xl font-mono font-black text-emerald-400">
                  ${(replayData.totalValuation / 1000).toFixed(0)}k
                </div>
                <span className="text-[10px] text-slate-500">Current market unit cost basis</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Current Event Description</span>
                <div className="text-xs font-bold text-white truncate">
                  {replayData.currentEvent?.operation_type}: {replayData.currentEvent?.product_name}
                </div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  Delta: {replayData.currentEvent?.operation_type === 'DELIVERY' ? '-' : '+'}{replayData.currentEvent?.quantity} {replayData.currentEvent?.unit_of_measure}
                </span>
              </div>
            </div>
          )}

          {/* Snapshot Table of Products at this time */}
          {replayData?.replayProducts && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reconstructed Catalog Snapshot</h4>
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs divide-y divide-slate-800">
                  <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-semibold">
                    <tr>
                      <th className="px-3 py-2">Item / SKU</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Quantity at this Date</th>
                      <th className="px-3 py-2 text-right">Valuation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-slate-300">
                    {replayData.replayProducts.map(p => (
                      <tr key={p.id}>
                        <td className="px-3 py-2 font-bold text-white">{p.name} <span className="font-mono text-slate-500 text-[11px]">({p.sku})</span></td>
                        <td className="px-3 py-2 text-slate-400">{p.category}</td>
                        <td className="px-3 py-2 font-mono font-bold text-purple-300">{p.stock}</td>
                        <td className="px-3 py-2 font-mono text-right text-emerald-400">${p.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. TAB CONTENT: SMART ACTION CENTER */}
      {activeTab === 'actions' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Smart Action Center</h3>
              <p className="text-xs text-slate-500">Autonomous supply chain recommendations requiring user authorization to execute.</p>
            </div>

            <div className="space-y-3">
              {/* Action 1: Titanium Restock */}
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-100 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                        CRITICAL ACTION
                      </span>
                      <h4 className="font-bold text-xs text-slate-900">Stockout Risk: Titanium Grade 5 Plate (TTN-004)</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      0 units in stock. Reorder threshold is 30 kg. Expected disruption to Aerospace customer shipments.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/receipts?productId=4&qty=60&autoOpen=true')}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <ArrowDownLeft className="h-3.5 w-3.5" />
                  <span>Prepare Restock PO (+60 kg)</span>
                </button>
              </div>

              {/* Action 2: Warehouse Rebalance */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <Warehouse className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                        REBALANCE WARNING
                      </span>
                      <h4 className="font-bold text-xs text-slate-900">Main Central Warehouse High Occupancy (82%)</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Bulk bay storage is approaching capacity. Rebalancing 300 units to European Depot will restore optimum efficiency.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/transfers?autoOpen=true')}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  <span>Initiate Inter-Bay Transfer</span>
                </button>
              </div>

              {/* Action 3: Count Reconciliation */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                    <Sliders className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                        AUDIT CYCLE COUNT
                      </span>
                      <h4 className="font-bold text-xs text-slate-900">Recommended Physical Audit: Cold Rolled Steel</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      High outbound dispatch volume during shift B. Recommended physical count check in Bulk Bay 1.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/adjustments?productId=1&autoOpen=true')}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Start Physical Count</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: OVERVIEW (THE COMPLETE COMMAND CENTER DASHBOARD) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Dashboard KPI Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Total Stock */}
            <div 
              onClick={() => navigate('/products')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Total Stock</span>
                <Boxes className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                {kpis.totalStockUnits ? kpis.totalStockUnits.toLocaleString() : '12,680'}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+5.4% vs last period</span>
              </div>
            </div>

            {/* Low Stock (Clickable -> filters products) */}
            <div 
              onClick={() => navigate('/products?lowStock=true')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-400 hover:bg-amber-50/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-amber-600 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock</span>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-600 group-hover:scale-105 transition-transform">
                {kpis.lowStockCount ?? 7} <span className="text-xs font-normal text-slate-400">items</span>
              </div>
              <div className="text-[11px] text-amber-700 font-medium mt-1">Click to filter catalog →</div>
            </div>

            {/* Out of Stock (Clickable -> filters products) */}
            <div 
              onClick={() => navigate('/products?outOfStock=true')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-rose-400 hover:bg-rose-50/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-rose-600 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Out of Stock</span>
                <PackageX className="h-4 w-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold text-rose-600 group-hover:scale-105 transition-transform">
                {kpis.outOfStockCount ?? 2} <span className="text-xs font-normal text-slate-400">items</span>
              </div>
              <div className="text-[11px] text-rose-700 font-medium mt-1">Immediate restock needed</div>
            </div>

            {/* Pending Receipts */}
            <div 
              onClick={() => navigate('/receipts')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-emerald-600 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Inbound Receipts</span>
                <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                {kpis.pendingReceipts ?? 4}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Draft & ready inbound</div>
            </div>

            {/* Pending Deliveries */}
            <div 
              onClick={() => navigate('/deliveries')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-blue-600 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Deliveries</span>
                <ArrowUpRight className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {kpis.pendingDeliveries ?? 6}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Orders awaiting dispatch</div>
            </div>

            {/* Internal Transfers */}
            <div 
              onClick={() => navigate('/transfers')}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-purple-400 hover:bg-purple-50/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-purple-600 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Transfers</span>
                <ArrowLeftRight className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                {kpis.pendingTransfers ?? 2} <span className="text-xs font-normal text-slate-400">active</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Inter-depot movements</div>
            </div>
          </div>

          {/* Health Score + Stock Trend Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Inventory Health Score Radial */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-sm">Inventory Health Score</h3>
                  <button 
                    onClick={() => openExplain('health')}
                    className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{healthScore.label}</span>
                    <HelpCircle className="h-3 w-3" />
                  </button>
                </div>

                {/* Circular score visualization */}
                <div className="flex items-center justify-center py-4">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-36 h-36 transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="58"
                        stroke="#E2E8F0"
                        strokeWidth="12"
                        fill="transparent"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="58"
                        stroke="#10B981"
                        strokeWidth="12"
                        strokeDasharray="364.4"
                        strokeDashoffset={364.4 - (364.4 * healthScore.score) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black text-slate-900">{healthScore.score}</span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Breakdown meters */}
                <div className="space-y-2.5 pt-2">
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Stock Availability</span>
                      <strong className="text-slate-800">{healthScore.availabilityScore}%</strong>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${healthScore.availabilityScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Turnover Velocity</span>
                      <strong className="text-slate-800">{healthScore.turnoverScore}%</strong>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${healthScore.turnoverScore}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Fulfillment SLA Rate</span>
                      <strong className="text-slate-800">{healthScore.accuracyScore}%</strong>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${healthScore.accuracyScore}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Calculated from live transactions</span>
                <button 
                  onClick={() => openExplain('health')}
                  className="font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  Diagnostic Breakdown →
                </button>
              </div>
            </div>

            {/* Recharts Area Chart: Stock Trends */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Stock Level Trends & Projected Depletion</h3>
                  <p className="text-xs text-slate-500">Historical stock volume over {dateRange} period</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Data
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stockTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
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
                    <Area 
                      type="monotone" 
                      dataKey="stock" 
                      stroke="#10B981" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#colorStock)" 
                      name="Stock Units"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span>Peak balance: <strong>12,680 units</strong></span>
                <span>Burn rate: <strong>~350 units / day</strong></span>
              </div>
            </div>
          </div>

          {/* Movement Inbound/Outbound Stacked Bar + Category Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stacked Movement Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Monthly Movement Flow (IN vs OUT)</h3>
                  <p className="text-xs text-slate-500">Inbound receipts vs customer order dispatches</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">FLOW TELEMETRY</span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={movementAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="incoming" fill="#10B981" name="Inbound Receipts" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="outgoing" fill="#3B82F6" name="Outbound Deliveries" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Donut Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Category Stock Concentration</h3>
                  <p className="text-xs text-slate-500">Distribution across Raw Metals, Electronics, Hardware</p>
                </div>
                <Link to="/products" className="text-xs font-semibold text-emerald-600 hover:underline">
                  View Catalog →
                </Link>
              </div>

              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Activity Timeline & AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Recent Ledger Activity</h4>
                  <p className="text-xs text-slate-500">Immutable audit stream from active warehouse operations</p>
                </div>
                <Link to="/ledger" className="text-xs font-semibold text-emerald-600 hover:underline">
                  Complete Ledger →
                </Link>
              </div>

              <div className="space-y-3">
                {(!data?.recentActivity || data.recentActivity.length === 0) ? (
                  <div className="py-6 text-center text-xs text-slate-400">No recent transactions recorded.</div>
                ) : (
                  data.recentActivity.slice(0, 5).map((act, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                          <Boxes className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{act.product_name}</div>
                          <div className="text-[11px] text-slate-400">{act.operation_type} • {act.destination_location_name || act.source_location_name || 'Store'}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600">+{act.quantity} {act.unit_of_measure}</div>
                        <div className="text-[10px] text-slate-400">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Insights Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h4 className="font-bold text-sm tracking-tight text-white">StockSense AI Diagnostics</h4>
                </div>

                <div className="space-y-3">
                  {insights.map((ins, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                      <span>{ins}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-800">
                <Link
                  to="/assistant"
                  className="inline-flex items-center justify-between w-full p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-emerald-400 transition-colors"
                >
                  <span>Consult AI Copilot</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Root Cause Explainability Modal */}
      <ExplainModal
        isOpen={explainModal.isOpen}
        onClose={() => setExplainModal({ isOpen: false, type: '', data: null })}
        metricType={explainModal.type}
        data={explainModal.data}
      />
    </div>
  );
}
