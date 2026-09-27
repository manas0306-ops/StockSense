import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
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
  Zap
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
  Legend,
  ComposedChart
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'];

export default function Analytics() {
  const [period, setPeriod] = useState('30D');
  const [warehouseId, setWarehouseId] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('trends'); // trends, velocity, warehouses, operations, accuracy

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getAnalytics({ period, warehouseId });
      setData(res.data);
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

  // Sample data fallbacks if API data loading
  const trends = data?.trends || [
    { date: 'Sep 01', stock: 11200, incoming: 450, outgoing: 320, value: 480000 },
    { date: 'Sep 05', stock: 11450, incoming: 620, outgoing: 370, value: 495000 },
    { date: 'Sep 10', stock: 11800, incoming: 800, outgoing: 450, value: 512000 },
    { date: 'Sep 15', stock: 11620, incoming: 310, outgoing: 490, value: 504000 },
    { date: 'Sep 20', stock: 12100, incoming: 950, outgoing: 470, value: 528000 },
    { date: 'Sep 25', stock: 12450, incoming: 720, outgoing: 370, value: 541000 },
    { date: 'Today', stock: 12680, incoming: 580, outgoing: 350, value: 552000 },
  ];

  const fastMoving = data?.fastMoving || [
    { name: 'M8 Hex Bolts Grade 8.8', sku: 'BLT-301', unitsMoved: 1450, turnover: '8.4x', trend: '+14%' },
    { name: 'Cold Rolled Steel Sheets', sku: 'STL-001', unitsMoved: 820, turnover: '6.2x', trend: '+9%' },
    { name: 'Flange Lock Nuts M10', sku: 'NUT-302', unitsMoved: 780, turnover: '5.8x', trend: '+12%' },
    { name: 'Poly Stretch Wrap 500m', sku: 'WRP-402', unitsMoved: 510, turnover: '5.1x', trend: '+4%' },
    { name: 'ESP32 Microcontroller Node', sku: 'MCU-202', unitsMoved: 430, turnover: '4.7x', trend: '+18%' },
  ];

  const slowMoving = data?.slowMoving || [
    { name: 'Robotic Articulated Gripper', sku: 'GRP-106', currentStock: 14, daysIdle: 42, tiedCapital: '$8,400' },
    { name: 'Precision Servo Drive Module', sku: 'SRV-103', currentStock: 4, daysIdle: 38, tiedCapital: '$3,200' },
    { name: 'Brass Round Bar 25mm', sku: 'BRS-007', currentStock: 140, daysIdle: 29, tiedCapital: '$4,900' },
    { name: 'Digital Flow Transmitter', sku: 'FLW-205', currentStock: 48, daysIdle: 26, tiedCapital: '$7,200' },
  ];

  const warehouseComparison = data?.warehouseComparison || [
    { name: 'Main Central', capacity: 15000, current: 6850, util: 46 },
    { name: 'West Coast Hub', capacity: 10000, current: 4200, util: 42 },
    { name: 'East Coast Terminal', capacity: 12000, current: 5100, util: 43 },
    { name: 'Great Lakes Logistics', capacity: 8000, current: 3400, util: 43 },
    { name: 'European Hub', capacity: 20000, current: 7900, util: 40 },
  ];

  const operationalMetrics = data?.operations || {
    avgReceiptHours: '2.4 hrs',
    avgDeliveryHours: '3.1 hrs',
    accuracyRate: '99.4%',
    discrepancyCount: 2,
    cycleCountVariance: '0.06%'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Analytics & Business Intelligence</h1>
          <p className="text-sm text-slate-500">Deep stock velocity, turnover ratios, and warehouse operational performance</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period selector */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-xs">
            {['7D', '30D', '3M', '6M', '1Y'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  period === p ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs cursor-pointer transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('trends')}
          className={`pb-3 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'trends' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Inventory Trends & Volume
        </button>
        <button
          onClick={() => setActiveTab('velocity')}
          className={`pb-3 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'velocity' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Product Velocity & Turnover
        </button>
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`pb-3 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'warehouses' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Warehouse Flow & Capacity
        </button>
        <button
          onClick={() => setActiveTab('operations')}
          className={`pb-3 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'operations' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Operational Efficiency & Accuracy
        </button>
      </div>

      {/* Tab: Trends */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          {/* Main Area Chart: Stock Volume & Valuation Over Time */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Network Inventory Volume & Valuation Curve</h3>
                <p className="text-xs text-slate-500">Aggregate physical stock units on hand across all facilities</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="h-3 w-3 rounded-full bg-emerald-500"></span> Total Units
                </span>
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="h-3 w-3 rounded-full bg-blue-500"></span> Total Value ($)
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trends}>
                  <defs>
                    <linearGradient id="colorStockCurve" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area yAxisId="left" type="monotone" dataKey="stock" fill="url(#colorStockCurve)" stroke="#10B981" strokeWidth={2.5} name="Units on Hand" />
                  <Line yAxisId="right" type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} name="Inventory Value ($)" dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Incoming vs Outgoing Flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm mb-1">Inbound vs Outbound Throughput</h4>
              <p className="text-xs text-slate-500 mb-4">Receipt volume vs customer fulfillment deliveries</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="incoming" name="Received Inbound" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="outgoing" name="Delivered Outbound" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">ABC Pareto Inventory Classification</h4>
                <p className="text-xs text-slate-500 mb-4">Capital concentration by product tier</p>
                <div className="space-y-4 pt-2">
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-900">Category A (High Value)</div>
                      <div className="text-xs text-emerald-700 mt-0.5">Top 20% products generate 70% inventory valuation</div>
                    </div>
                    <span className="text-lg font-bold text-emerald-800">70.2%</span>
                  </div>
                  <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-blue-900">Category B (Moderate Velocity)</div>
                      <div className="text-xs text-blue-700 mt-0.5">Next 30% products account for 20% valuation</div>
                    </div>
                    <span className="text-lg font-bold text-blue-800">21.4%</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Category C (High Volume / Bulk)</div>
                      <div className="text-xs text-slate-500 mt-0.5">Remaining 50% items account for 10% valuation</div>
                    </div>
                    <span className="text-lg font-bold text-slate-700">8.4%</span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 mt-4 text-center">
                Pareto optimal distribution recommended for automated reordering
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Velocity */}
      {activeTab === 'velocity' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fast Moving */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 bg-emerald-50/50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Top Fast-Moving Products</h4>
                <p className="text-xs text-slate-500">Ranked by shipment velocity & inventory turnover</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">High Velocity</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Item & SKU</th>
                    <th className="py-3 px-4 text-right">Units Shipped</th>
                    <th className="py-3 px-4 text-right">Annual Turnover</th>
                    <th className="py-3 px-4 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fastMoving.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-xs font-mono text-slate-400">{p.sku}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">{p.unitsMoved}</td>
                      <td className="py-3.5 px-4 text-right font-semibold text-emerald-600">{p.turnover}</td>
                      <td className="py-3.5 px-4 text-right font-medium text-emerald-600">{p.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Slow Moving */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 bg-amber-50/50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Slow-Moving & Dead Stock Warning</h4>
                <p className="text-xs text-slate-500">Inventory with lowest activity and idle capital</p>
              </div>
              <span className="text-xs font-bold text-amber-700 uppercase bg-amber-100 px-2 py-0.5 rounded">Review Holding</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Item & SKU</th>
                    <th className="py-3 px-4 text-right">Stock</th>
                    <th className="py-3 px-4 text-right">Days Inactive</th>
                    <th className="py-3 px-4 text-right">Tied Capital</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {slowMoving.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-xs font-mono text-slate-400">{p.sku}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-700">{p.currentStock}</td>
                      <td className="py-3.5 px-4 text-right font-semibold text-amber-600">{p.daysIdle} days</td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">{p.tiedCapital}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Warehouses */}
      {activeTab === 'warehouses' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-1">Warehouse Capacity vs Stored Inventory</h4>
            <p className="text-xs text-slate-500 mb-6">Cross-facility volume comparison and headroom</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={warehouseComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="capacity" name="Total Capacity (Units)" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="current" name="Stored Stock (Units)" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Operations */}
      {activeTab === 'operations' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase">Avg Receipt Turnaround</span>
              <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{operationalMetrics.avgReceiptHours}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">✓ 18% faster than SLA</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase">Avg Delivery Dispatch</span>
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{operationalMetrics.avgDeliveryHours}</div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">Same-day fulfillment</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase">Inventory Accuracy Rate</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-600">{operationalMetrics.accuracyRate}</div>
            <div className="text-[11px] text-slate-400 mt-1">Based on physical cycle counts</div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase">Audit Discrepancies</span>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-600">{operationalMetrics.discrepancyCount} items</div>
            <div className="text-[11px] text-slate-400 mt-1">{operationalMetrics.cycleCountVariance} total count variance</div>
          </div>
        </div>
      )}
    </div>
  );
}
