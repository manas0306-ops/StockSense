import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { warehouseService } from '../services/warehouseService';
import { 
  X, 
  ArrowLeftRight, 
  Package, 
  Warehouse, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Layers 
} from 'lucide-react';

export default function CompareModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('products'); // 'products' or 'warehouses'
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [idA, setIdA] = useState('');
  const [idB, setIdB] = useState('');

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        productService.getAll(),
        warehouseService.getAll()
      ]).then(([pRes, wRes]) => {
        const pList = pRes.data || [];
        const wList = wRes.data || [];
        setProducts(pList);
        setWarehouses(wList);
        if (pList.length >= 2) {
          setIdA(pList[0].id);
          setIdB(pList[1].id);
        }
      }).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const itemA = mode === 'products' ? products.find(p => p.id === Number(idA)) : warehouses.find(w => w.id === Number(idA));
  const itemB = mode === 'products' ? products.find(p => p.id === Number(idB)) : warehouses.find(w => w.id === Number(idB));

  const getStockA = () => itemA ? ((itemA.locations || []).reduce((acc, l) => acc + (parseFloat(l.quantity) || 0), 0) || itemA.total_units || 0) : 0;
  const getStockB = () => itemB ? ((itemB.locations || []).reduce((acc, l) => acc + (parseFloat(l.quantity) || 0), 0) || itemB.total_units || 0) : 0;

  const stockA = getStockA();
  const stockB = getStockB();
  const maxStock = Math.max(stockA, stockB, 1);

  const valueA = mode === 'products' && itemA ? (stockA * (itemA.unit_cost || 0)) : (stockA * 45);
  const valueB = mode === 'products' && itemB ? (stockB * (itemB.unit_cost || 0)) : (stockB * 45);
  const maxValue = Math.max(valueA, valueB, 1);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                  Dual-Entity Comparison
                </span>
                <span className="text-xs text-slate-400 font-mono">DIAGNOSTIC MATRIX</span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">Side-by-Side Inventory Compare Mode</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Mode Switcher */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                setMode('products');
                if (products.length >= 2) {
                  setIdA(products[0].id);
                  setIdB(products[1].id);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                mode === 'products' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Product vs Product</span>
            </button>
            <button
              onClick={() => {
                setMode('warehouses');
                if (warehouses.length >= 2) {
                  setIdA(warehouses[0].id);
                  setIdB(warehouses[1].id);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                mode === 'warehouses' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Warehouse className="h-4 w-4" />
              <span>Warehouse vs Warehouse</span>
            </button>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Entity A
              </label>
              <select
                value={idA}
                onChange={(e) => setIdA(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-emerald-500"
              >
                {mode === 'products' ? products.map(p => (
                  <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>
                )) : warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name} ({w.city})</option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Entity B
              </label>
              <select
                value={idB}
                onChange={(e) => setIdB(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500"
              >
                {mode === 'products' ? products.map(p => (
                  <option key={p.id} value={p.id}>{p.sku} — {p.name}</option>
                )) : warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name} ({w.city})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Cards & Relative Bars */}
          {itemA && itemB && (
            <div className="space-y-4">
              {/* Metric 1: Stock Quantity */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider">
                    {mode === 'products' ? 'Physical Stock on Hand' : 'Total Units Stored'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Delta: <strong className="font-mono text-slate-700">{Math.abs(stockA - stockB).toLocaleString()} units</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-emerald-700">{itemA.name?.slice(0, 22)}</span>
                      <strong className="text-emerald-700">{stockA.toLocaleString()}</strong>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(stockA / maxStock) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-blue-700">{itemB.name?.slice(0, 22)}</span>
                      <strong className="text-blue-700">{stockB.toLocaleString()}</strong>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stockB / maxStock) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric 2: Asset Valuation */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider">Asset Valuation</span>
                  <span className="text-[11px] text-slate-400">
                    Difference: <strong className="font-mono text-slate-700">${Math.abs(valueA - valueB).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500">Valuation A</span>
                      <strong className="text-emerald-700">${valueA.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(valueA / maxValue) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500">Valuation B</span>
                      <strong className="text-blue-700">${valueB.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(valueB / maxValue) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric 3: Parameters breakdown */}
              {mode === 'products' ? (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Unit Cost</span>
                    <p className="font-mono font-bold text-slate-800">${itemA.unit_cost?.toFixed(2)} / {itemA.unit_of_measure}</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase pt-1 block">Reorder Buffer</span>
                    <p className="font-mono font-bold text-slate-800">{itemA.reorder_level} units</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Unit Cost</span>
                    <p className="font-mono font-bold text-slate-800">${itemB.unit_cost?.toFixed(2)} / {itemB.unit_of_measure}</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase pt-1 block">Reorder Buffer</span>
                    <p className="font-mono font-bold text-slate-800">{itemB.reorder_level} units</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Rated Capacity</span>
                    <p className="font-mono font-bold text-slate-800">{itemA.capacity?.toLocaleString()} units</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase pt-1 block">Facility Utilization</span>
                    <p className="font-mono font-bold text-emerald-600">{Math.round((stockA / (itemA.capacity || 10000)) * 100)}%</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Rated Capacity</span>
                    <p className="font-mono font-bold text-slate-800">{itemB.capacity?.toLocaleString()} units</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase pt-1 block">Facility Utilization</span>
                    <p className="font-mono font-bold text-blue-600">{Math.round((stockB / (itemB.capacity || 10000)) * 100)}%</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
