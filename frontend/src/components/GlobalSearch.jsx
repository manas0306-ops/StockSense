import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowLeftRight, 
  Warehouse, 
  BarChart3, 
  Bot, 
  FileText, 
  X, 
  Sliders,
  Layers,
  ArrowRight
} from 'lucide-react';
import { productService } from '../services/productService';
import { warehouseService } from '../services/warehouseService';
import { receiptService, deliveryService, transferService } from '../services/operationServices';

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const quickLinks = [
    { type: 'Navigation', title: 'Inventory Command Center', subtitle: 'View real-time stock KPIs & alerts', path: '/dashboard', icon: BarChart3 },
    { type: 'Navigation', title: 'Product Catalog', subtitle: 'Search & manage all 32 items', path: '/products', icon: Package },
    { type: 'Action', title: 'Create Goods Receipt', subtitle: 'Receive inbound stock from suppliers', path: '/receipts?create=true', icon: ArrowDownLeft },
    { type: 'Action', title: 'Create Delivery Order', subtitle: 'Dispatch outbound goods to customers', path: '/deliveries?create=true', icon: ArrowUpRight },
    { type: 'Action', title: 'Schedule Internal Transfer', subtitle: 'Move items between warehouse bays', path: '/transfers?create=true', icon: ArrowLeftRight },
    { type: 'Navigation', title: 'Warehouse Network', subtitle: 'Manage 5 facilities & 12 storage zones', path: '/warehouses', icon: Warehouse },
    { type: 'Navigation', title: 'AI Assistant (Ask StockSense)', subtitle: 'Chat with inventory intelligence engine', path: '/assistant', icon: Bot },
    { type: 'Navigation', title: 'Audit Stock Ledger', subtitle: 'Immutable transaction movements', path: '/ledger', icon: Sliders },
    { type: 'Navigation', title: 'Enterprise Reports', subtitle: 'Export CSV & print audit PDFs', path: '/reports', icon: FileText },
  ];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle trigger handled by parent or toggle
      }
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, (results.length || quickLinks.length)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + Math.max(1, (results.length || quickLinks.length))) % Math.max(1, (results.length || quickLinks.length)));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeList = query.trim() ? results : quickLinks;
        if (activeList[selectedIndex]) {
          handleSelect(activeList[selectedIndex]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, quickLinks, selectedIndex, query]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [prodRes, whRes, recRes, delRes, trfRes] = await Promise.allSettled([
          productService.getAll({ search: query.trim() }),
          warehouseService.getAll(),
          receiptService.getAll(),
          deliveryService.getAll(),
          transferService.getAll(),
        ]);

        const matches = [];
        const q = query.toLowerCase();

        // Products
        if (prodRes.status === 'fulfilled' && prodRes.value?.data) {
          prodRes.value.data.forEach((p) => {
            if (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.category_name && p.category_name.toLowerCase().includes(q))) {
              matches.push({
                type: 'Product',
                title: p.name,
                subtitle: `SKU: ${p.sku} • Stock: ${p.current_stock} ${p.unit_of_measure} • Category: ${p.category_name || 'General'}`,
                path: `/products?search=${encodeURIComponent(p.sku)}`,
                icon: Package,
              });
            }
          });
        }

        // Warehouses
        if (whRes.status === 'fulfilled' && whRes.value?.data) {
          whRes.value.data.forEach((w) => {
            if (w.name.toLowerCase().includes(q) || (w.city && w.city.toLowerCase().includes(q))) {
              matches.push({
                type: 'Warehouse',
                title: w.name,
                subtitle: `${w.city || 'Facility'} • ${w.total_units || 0} units stored`,
                path: `/warehouses?id=${w.id}`,
                icon: Warehouse,
              });
            }
          });
        }

        // Receipts
        if (recRes.status === 'fulfilled' && recRes.value?.data) {
          recRes.value.data.forEach((r) => {
            if (r.reference_no.toLowerCase().includes(q) || (r.supplier_name && r.supplier_name.toLowerCase().includes(q))) {
              matches.push({
                type: 'Receipt',
                title: r.reference_no,
                subtitle: `Supplier: ${r.supplier_name || 'N/A'} • Status: ${r.status.toUpperCase()}`,
                path: `/receipts`,
                icon: ArrowDownLeft,
              });
            }
          });
        }

        // Deliveries
        if (delRes.status === 'fulfilled' && delRes.value?.data) {
          delRes.value.data.forEach((d) => {
            if (d.reference_no.toLowerCase().includes(q) || (d.customer_name && d.customer_name.toLowerCase().includes(q))) {
              matches.push({
                type: 'Delivery',
                title: d.reference_no,
                subtitle: `Customer: ${d.customer_name || 'N/A'} • Status: ${d.status.toUpperCase()}`,
                path: `/deliveries`,
                icon: ArrowUpRight,
              });
            }
          });
        }

        // Transfers
        if (trfRes.status === 'fulfilled' && trfRes.value?.data) {
          trfRes.value.data.forEach((t) => {
            if (t.reference_no.toLowerCase().includes(q)) {
              matches.push({
                type: 'Transfer',
                title: t.reference_no,
                subtitle: `Internal transfer • Status: ${t.status.toUpperCase()}`,
                path: `/transfers`,
                icon: ArrowLeftRight,
              });
            }
          });
        }

        setResults(matches.slice(0, 10));
        setSelectedIndex(0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    onClose();
    navigate(item.path);
  };

  if (!isOpen) return null;

  const displayList = query.trim() ? results : quickLinks;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-2xl transform divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all">
        <div className="relative flex items-center px-4 py-3">
          <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, SKUs, warehouses, receipts, deliveries... (Ctrl + K)"
            className="h-10 w-full border-0 bg-transparent pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          {query ? (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              ESC
            </kbd>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {query.trim() ? `Search Results (${results.length})` : 'Suggested Quick Access & Actions'}
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Searching enterprise inventory...
            </div>
          ) : displayList.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              <Package className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">No matching items found</p>
              <p className="text-xs text-slate-400 mt-0.5">Try searching with a SKU code, warehouse name, or transaction reference.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {displayList.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60' : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm truncate">{item.title}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            item.type === 'Product' ? 'bg-blue-100 text-blue-800' :
                            item.type === 'Warehouse' ? 'bg-purple-100 text-purple-800' :
                            item.type === 'Receipt' ? 'bg-emerald-100 text-emerald-800' :
                            item.type === 'Delivery' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</div>
                      </div>
                    </div>
                    <ArrowRight className={`h-4 w-4 shrink-0 transition-transform ${
                      isSelected ? 'text-emerald-600 translate-x-1' : 'text-slate-300'
                    }`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 text-[11px] text-slate-400 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span><kbd className="font-semibold text-slate-600">↑↓</kbd> Navigate</span>
            <span><kbd className="font-semibold text-slate-600">Enter</kbd> Select</span>
            <span><kbd className="font-semibold text-slate-600">Esc</kbd> Close</span>
          </div>
          <span className="font-mono text-emerald-600 font-medium">StockSense Global Index</span>
        </div>
      </div>
    </div>
  );
}
