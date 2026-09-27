import React, { useState } from 'react';
import { reportService } from '../services/reportService';
import { exportToCSV } from '../utils/csvExport';
import { 
  FileText, 
  Download, 
  Printer, 
  RefreshCw, 
  CheckCircle2, 
  Filter, 
  Calendar, 
  Warehouse, 
  Package, 
  Sliders, 
  ArrowDownLeft, 
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Table
} from 'lucide-react';

const REPORT_TEMPLATES = [
  {
    id: 'inventory_summary',
    title: 'Inventory Valuation & Stock Summary',
    description: 'Complete stock quantities, unit valuation, and location distribution across catalog.',
    icon: Package,
    category: 'Inventory',
  },
  {
    id: 'stock_movement',
    title: 'Stock Movement & Ledger Audit',
    description: 'Detailed chronological movement history including receipts, deliveries, and transfers.',
    icon: FileText,
    category: 'Compliance',
  },
  {
    id: 'low_stock',
    title: 'Critical Low Stock & Replenishment Schedule',
    description: 'Products at or below safety reorder threshold with recommended purchase quantities.',
    icon: ArrowDownLeft,
    category: 'Procurement',
  },
  {
    id: 'warehouse_capacity',
    title: 'Warehouse Capacity & Utilization Report',
    description: 'Facility storage capacity breakdown, active storage bays, and percentage headroom.',
    icon: Warehouse,
    category: 'Facilities',
  },
  {
    id: 'product_velocity',
    title: 'Product Velocity & ABC Classification',
    description: 'Shipment frequency, inventory turnover velocity, and Pareto capital allocation.',
    icon: ArrowUpRight,
    category: 'Analytics',
  },
  {
    id: 'discrepancy_audit',
    title: 'Physical Adjustment & Discrepancy Audit',
    description: 'Inventory reconciliation records, count variances, and variance justifications.',
    icon: Sliders,
    category: 'Audit',
  },
];

export default function Reports() {
  const [selectedTemplate, setSelectedTemplate] = useState('inventory_summary');
  const [period, setPeriod] = useState('30D');
  const [warehouseFilter, setWarehouseFilter] = useState('ALL');
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setReportData(null);
    try {
      const res = await reportService.generate({
        template: selectedTemplate,
        period,
        warehouse: warehouseFilter,
      });
      setReportData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportCSV = () => {
    if (!reportData || !reportData.rows) return;
    exportToCSV(reportData.rows, `StockSense_${selectedTemplate}_${period}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentTemplate = REPORT_TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Enterprise Report Center</h1>
          <p className="text-sm text-slate-500">Generate executive summaries, regulatory compliance audits, and CSV datasets</p>
        </div>
      </div>

      {/* Template Selection Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">1. Select Report Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            const isSelected = selectedTemplate === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => {
                  setSelectedTemplate(tmpl.id);
                  setReportData(null);
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs' 
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {tmpl.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{tmpl.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tmpl.description}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={isSelected ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                    {isSelected ? '✓ Selected' : 'Click to select'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parameters & Generate Action */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">2. Configure Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Time Horizon</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="7D">Last 7 Days</option>
              <option value="30D">Last 30 Days (Current Month)</option>
              <option value="90D">Last Quarter (90 Days)</option>
              <option value="1Y">Year to Date (YTD)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Facility / Warehouse</label>
            <select
              value={warehouseFilter}
              onChange={(e) => setWarehouseFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="ALL">All Warehouses (Global Consolidation)</option>
              <option value="1">Main Central Warehouse (Dallas, TX)</option>
              <option value="2">West Coast Hub (Oakland, CA)</option>
              <option value="3">East Coast Terminal (Newark, NJ)</option>
              <option value="4">Great Lakes Logistics (Chicago, IL)</option>
              <option value="5">European Distribution Hub (Rotterdam)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors cursor-pointer disabled:bg-emerald-300"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Compiling Dataset...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Report Preview Area */}
      {reportData && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6 printable-report">
          {/* Corporate Report Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-6 w-6 text-emerald-600" />
                <span className="text-xl font-bold tracking-tight text-slate-900">StockSense Enterprise</span>
              </div>
              <h2 className="text-base font-bold text-slate-800">{reportData.title || currentTemplate?.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Parameters: {period} • Scope: {warehouseFilter === 'ALL' ? 'Global Consolidation' : 'Selected Facility'}</p>
            </div>

            <div className="flex flex-col items-start sm:items-end text-xs text-slate-500">
              <span className="font-mono">Doc ID: {reportData.report_id || `RPT-${Date.now().toString().slice(-6)}`}</span>
              <span>Generated: {new Date().toLocaleString()}</span>
              <span>Authorized By: System Controller (Admin)</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between no-print pt-2">
            <span className="text-xs font-medium text-slate-600">
              Showing <strong>{reportData.rows?.length || 0}</strong> records compiled from immutable ledger
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Official PDF</span>
              </button>
            </div>
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                <tr>
                  {reportData.headers?.map((h, i) => (
                    <th key={i} className="py-2.5 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.rows?.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/70">
                    {Object.values(row).map((val, cIdx) => (
                      <td key={cIdx} className="py-2.5 px-4 font-medium text-slate-800">
                        {typeof val === 'number' ? val.toLocaleString() : val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Compliance Signature Block */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-slate-500">
            <div>
              <div className="font-semibold text-slate-700 mb-6">Prepared By:</div>
              <div className="border-b border-slate-300 w-36 mb-1"></div>
              <div className="text-[11px]">Alex Rivera (Inventory Manager)</div>
            </div>
            <div>
              <div className="font-semibold text-slate-700 mb-6">Verified By:</div>
              <div className="border-b border-slate-300 w-36 mb-1"></div>
              <div className="text-[11px]">Internal Audit & Compliance</div>
            </div>
            <div>
              <div className="font-semibold text-slate-700 mb-6">Audit Status:</div>
              <div className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Ledger Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
