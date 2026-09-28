import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { 
  Scan, 
  X, 
  Search, 
  Package, 
  Warehouse, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowDownLeft, 
  ArrowUpRight, 
  ArrowLeftRight, 
  Sliders,
  Zap,
  Barcode
} from 'lucide-react';

export default function ScannerModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      productService.getAll().then(res => {
        setProducts(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedProduct(res.data[0]);
        }
      }).catch(() => {});
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScanMatch = (skuOrName) => {
    setQuery(skuOrName);
    const found = products.find(p => 
      p.sku.toLowerCase() === skuOrName.toLowerCase() || 
      p.name.toLowerCase().includes(skuOrName.toLowerCase())
    );
    if (found) {
      setSelectedProduct(found);
      setIsScanning(false);
    }
  };

  const currentStock = selectedProduct ? (selectedProduct.locations || []).reduce(
    (acc, loc) => acc + (parseFloat(loc.quantity) || 0), 0
  ) : 0;

  const handleAction = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-3xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Scanner Top Bar */}
        <div className="px-6 py-4 bg-slate-950 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scan className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Hardware Scanner Terminal
                </span>
                <span className="text-xs text-slate-500 font-mono">OPTICAL & RFID READY</span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">Warehouse Mobile Scanner Lookup</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Virtual Scanner Viewport */}
          <div className="relative h-44 rounded-2xl bg-slate-950 border-2 border-emerald-500/30 overflow-hidden flex flex-col items-center justify-center shadow-inner">
            {/* Corner Crosshairs */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-md" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-md" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-md" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-md" />

            {/* Scanning Laser Line */}
            <div className="absolute left-8 right-8 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce top-1/2 -translate-y-1/2 opacity-75" />

            {/* Reticle center info */}
            <Barcode className="h-16 w-16 text-slate-700/60 mb-2" />
            <p className="text-xs text-slate-400 font-mono">AIM AT BARCODE / QR / RFID TAG OR TYPE SKU BELOW</p>
          </div>

          {/* Input & Quick Chips */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleScanMatch(e.target.value)}
                placeholder="Scan barcode or enter SKU code (e.g. STL-001, CPR-002, BLT-301)..."
                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono tracking-wide"
              />
            </div>

            {/* Quick Demo Scan Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              <span className="font-semibold text-slate-500">Fast Scan Emulators:</span>
              {['STL-001', 'CPR-002', 'ALU-003', 'BAT-206', 'BLT-301'].map((sku) => (
                <button
                  key={sku}
                  onClick={() => handleScanMatch(sku)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono border border-slate-700 cursor-pointer text-xs"
                >
                  {sku}
                </button>
              ))}
            </div>
          </div>

          {/* Active Product Telemetry */}
          {selectedProduct && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                      {selectedProduct.sku}
                    </span>
                    <span className="text-xs text-slate-400">{selectedProduct.category_name}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{selectedProduct.name}</h3>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total On Hand</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-2xl font-mono font-black ${currentStock <= selectedProduct.reorder_level ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {currentStock}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{selectedProduct.unit_of_measure}</span>
                  </div>
                </div>
              </div>

              {/* Warehouse & Rack locations */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Storage Locations & Racks
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(selectedProduct.locations || []).map((loc, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-200 block">{loc.warehouse_name}</span>
                        <span className="text-[11px] text-slate-400">{loc.location_name}</span>
                      </div>
                      <span className="font-mono font-bold text-white bg-slate-800 px-2 py-1 rounded">
                        {loc.quantity} {selectedProduct.unit_of_measure}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instant Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={() => handleAction(`/receipts?productId=${selectedProduct.id}&autoOpen=true`)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <ArrowDownLeft className="h-3.5 w-3.5" />
                  <span>Receive (+IN)</span>
                </button>
                <button
                  onClick={() => handleAction(`/deliveries?productId=${selectedProduct.id}&autoOpen=true`)}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>Dispatch (-OUT)</span>
                </button>
                <button
                  onClick={() => handleAction(`/transfers?productId=${selectedProduct.id}&autoOpen=true`)}
                  className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  <span>Transfer</span>
                </button>
                <button
                  onClick={() => handleAction(`/adjustments?productId=${selectedProduct.id}&autoOpen=true`)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Count Audit</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
