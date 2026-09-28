import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { warehouseService } from '../services/warehouseService';
import { advancedService } from '../services/advancedService';
import Modal from '../components/Modal';
import { 
  Warehouse, 
  Plus, 
  MapPin, 
  Layers, 
  Boxes, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Search,
  ExternalLink,
  Sliders,
  DollarSign,
  Grid,
  GitBranch,
  ArrowRight,
  Eye,
  Package
} from 'lucide-react';

export default function Warehouses() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('facilities'); // 'facilities' | 'digitalTwin' | 'flow'

  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [digitalTwin, setDigitalTwin] = useState(null);
  const [selectedTwinWh, setSelectedTwinWh] = useState(null);
  const [selectedRack, setSelectedRack] = useState(null);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isAddWhOpen, setIsAddWhOpen] = useState(false);
  const [isAddLocOpen, setIsAddLocOpen] = useState(false);
  const [selectedWhId, setSelectedWhId] = useState('');

  // Form states
  const [whName, setWhName] = useState('');
  const [whCity, setWhCity] = useState('');
  const [whCapacity, setWhCapacity] = useState(10000);
  const [locName, setLocName] = useState('');
  const [locType, setLocType] = useState('internal');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchWarehousesData = async () => {
    setLoading(true);
    try {
      const [whRes, locRes, twinRes] = await Promise.allSettled([
        warehouseService.getAll(),
        warehouseService.getLocations(),
        advancedService.getDigitalTwin()
      ]);

      if (whRes.status === 'fulfilled') setWarehouses(whRes.value.data || []);
      if (locRes.status === 'fulfilled') setLocations(locRes.value.data || []);
      if (twinRes.status === 'fulfilled' && twinRes.value.data) {
        setDigitalTwin(twinRes.value.data);
        if (twinRes.value.data.warehouses?.length > 0) {
          setSelectedTwinWh(twinRes.value.data.warehouses[0]);
          setSelectedRack(twinRes.value.data.warehouses[0].racks[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehousesData();
  }, []);

  const handleCreateWarehouse = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);
    try {
      await warehouseService.create({
        name: whName,
        city: whCity,
        capacity: parseInt(whCapacity, 10) || 10000,
        active: true
      });
      setIsAddWhOpen(false);
      setWhName('');
      setWhCity('');
      fetchWarehousesData();
    } catch (err) {
      setFormError(err.message || 'Failed to create warehouse');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleCreateLocation = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);
    try {
      await warehouseService.createLocation({
        warehouse_id: parseInt(selectedWhId, 10),
        name: locName,
        type: locType,
        active: true
      });
      setIsAddLocOpen(false);
      setLocName('');
      fetchWarehousesData();
    } catch (err) {
      setFormError(err.message || 'Failed to create storage location');
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredWarehouses = warehouses.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (w.city && w.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Multi-Warehouse & Facility Command</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              5 HUBS ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time occupancy monitoring, 2D Digital Twin rack layouts, and inventory movement flow.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddWhOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Warehouse</span>
          </button>
        </div>
      </div>

      {/* Feature Tabs: Facilities vs Digital Twin vs Movement Flow */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('facilities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'facilities'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Warehouse className="h-4 w-4" />
          <span>Facility Network ({warehouses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('digitalTwin')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'digitalTwin'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Grid className="h-4 w-4" />
          <span>Warehouse Digital Twin (Racks & Bays)</span>
        </button>

        <button
          onClick={() => setActiveTab('flow')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'flow'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GitBranch className="h-4 w-4" />
          <span>Inventory Movement Flow (Sankey Pipeline)</span>
        </button>
      </div>

      {/* TAB 1: FACILITY NETWORK */}
      {activeTab === 'facilities' && (
        <div className="space-y-6">
          {/* Quick Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter warehouses by name or city..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 shadow-2xs"
            />
          </div>

          {/* Warehouses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWarehouses.map((wh) => {
              const cap = wh.capacity || 10000;
              const stored = wh.total_units || 3000;
              const pct = Math.round((stored / cap) * 100);
              const whLocs = locations.filter(l => l.warehouse_id === wh.id);

              return (
                <div key={wh.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{wh.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{wh.city || wh.address || 'Logistics Center'}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pct >= 80 ? 'bg-red-50 text-red-700 border border-red-200' :
                      pct >= 50 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {pct}% Utilized
                    </span>
                  </div>

                  {/* Utilization Meter */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 80 ? 'bg-red-500' : pct >= 50 ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Stored: <strong>{stored.toLocaleString()} units</strong></span>
                      <span>Capacity: <strong>{cap.toLocaleString()} units</strong></span>
                    </div>
                  </div>

                  {/* Sub-locations count & action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      <strong>{whLocs.length}</strong> Storage Bays & Racks
                    </span>
                    <button
                      onClick={() => {
                        setSelectedWhId(wh.id);
                        setIsAddLocOpen(true);
                      }}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                    >
                      + Add Location
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: WAREHOUSE DIGITAL TWIN */}
      {activeTab === 'digitalTwin' && digitalTwin && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">2D Warehouse Digital Twin View</h3>
                <p className="text-xs text-slate-500">Interactive visual representation of storage aisles, high-bay racks, and stored SKUs</p>
              </div>

              {/* Warehouse selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Select Hub:</span>
                <select
                  value={selectedTwinWh?.id}
                  onChange={(e) => {
                    const found = digitalTwin.warehouses.find(w => w.id === Number(e.target.value));
                    if (found) {
                      setSelectedTwinWh(found);
                      setSelectedRack(found.racks[0]);
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden"
                >
                  {digitalTwin.warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.city})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Twin Layout: Racks Grid + Rack Inspector Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Visual Racks Grid (8 Cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">FLOOR MATRIX</span>
                    <h4 className="text-sm font-bold text-white">{selectedTwinWh?.name}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-800 px-3 py-1 rounded-lg">
                    {selectedTwinWh?.utilizationPct}% Stored Volume
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(selectedTwinWh?.racks || []).map((rack) => (
                    <div
                      key={rack.id}
                      onClick={() => setSelectedRack(rack)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                        selectedRack?.id === rack.id 
                          ? 'border-purple-600 bg-purple-50/40 shadow-sm' 
                          : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-900">{rack.id}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          rack.occupancy >= 85 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {rack.occupancy}% Occupied
                        </span>
                      </div>

                      {/* Visual Rack Slots */}
                      <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-100 rounded-xl">
                        {[1, 2, 3, 4, 5, 6].map((slot) => (
                          <div 
                            key={slot} 
                            className={`h-7 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                              slot <= Math.round((rack.occupancy / 100) * 6) 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-white border border-slate-200 text-slate-300'
                            }`}
                          >
                            {slot <= Math.round((rack.occupancy / 100) * 6) ? 'BOX' : 'EMPTY'}
                          </div>
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-600 space-y-0.5">
                        <span className="font-bold block text-slate-800">{rack.name}</span>
                        <span className="text-[10px] text-slate-400 block">{rack.zone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stored SKU Inspector (4 Cols) */}
              <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Rack Inspector</span>
                    <h4 className="text-sm font-bold text-slate-900">{selectedRack?.name}</h4>
                  </div>
                  <Package className="h-5 w-5 text-purple-600" />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Zone:</span>
                    <strong className="text-slate-900">{selectedRack?.zone}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Rated Capacity:</span>
                    <strong className="text-slate-900">{selectedRack?.capacity.toLocaleString()} units</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Stored Units:</span>
                    <strong className="text-purple-600 font-bold">{selectedRack?.storedUnits.toLocaleString()} units</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
                    Stored Products in this Rack
                  </span>
                  <div className="space-y-2">
                    {(selectedRack?.skus || []).map((p, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                        <div>
                          <span className="font-bold text-slate-800 block truncate max-w-[140px]">{p.name}</span>
                          <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {p.units} units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/transfers?autoOpen=true')}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Transfer Stock From Rack</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY MOVEMENT FLOW (SANKEY PIPELINE) */}
      {activeTab === 'flow' && digitalTwin?.flowPipeline && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Inventory Movement Pipeline & Flow</h3>
              <p className="text-xs text-slate-500">Live operational trajectory from Supplier Ingestion to Regional Warehouses to Customer Dispatch</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              PIPELINE TELEMETRY
            </span>
          </div>

          {/* Visual Sankey-Style Flow Pipeline Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Step 1: Suppliers */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">1. Suppliers</span>
              <div className="space-y-2">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800 block">ABC Steel & Apex</span>
                  <span className="text-[10px] text-emerald-600 font-mono font-bold">1,850 units</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800 block">Global Fasteners</span>
                  <span className="text-[10px] text-emerald-600 font-mono font-bold">2,400 units</span>
                </div>
              </div>
            </div>

            {/* Step 2: Inbound Ingestion */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">2. Inbound Receiving</span>
              <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs space-y-1">
                <span className="font-bold text-slate-800 block">Dock QC & Intake</span>
                <span className="text-xs font-mono font-black text-emerald-600 block">4,250 units</span>
                <span className="text-[10px] text-slate-400">Validated via Receipts</span>
              </div>
            </div>

            {/* Step 3: Warehouse Storage */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">3. Regional Warehouses</span>
              <div className="space-y-2">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800 block">Dallas Central (WH-01)</span>
                  <span className="text-[10px] text-purple-600 font-mono font-bold">5,420 units</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800 block">West Coast Hub (WH-02)</span>
                  <span className="text-[10px] text-purple-600 font-mono font-bold">3,240 units</span>
                </div>
              </div>
            </div>

            {/* Step 4: Dispatch Staging */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">4. Outbound Staging</span>
              <div className="p-3 bg-white rounded-lg border border-blue-200 text-xs space-y-1">
                <span className="font-bold text-slate-800 block">Packaging & Slips</span>
                <span className="text-xs font-mono font-black text-blue-600 block">3,800 units</span>
                <span className="text-[10px] text-slate-400">Zero-Negative Verified</span>
              </div>
            </div>

            {/* Step 5: Customers */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">5. Final Customers</span>
              <div className="space-y-2">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800 block">XYZ Systems & Metro</span>
                  <span className="text-[10px] text-blue-600 font-mono font-bold">2,100 units</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800 block">Prime Infrastructure</span>
                  <span className="text-[10px] text-blue-600 font-mono font-bold">1,700 units</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <span>Every single movement through this pipeline writes an immutable record to the double-entry Stock Ledger.</span>
            <button
              onClick={() => navigate('/ledger')}
              className="font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              Inspect Movement Ledger →
            </button>
          </div>
        </div>
      )}

      {/* Add Warehouse Modal */}
      <Modal isOpen={isAddWhOpen} onClose={() => setIsAddWhOpen(false)} title="Add New Warehouse Facility">
        <form onSubmit={handleCreateWarehouse} className="space-y-4">
          {formError && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs">{formError}</div>}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Name *</label>
            <input
              type="text"
              required
              value={whName}
              onChange={(e) => setWhName(e.target.value)}
              placeholder="e.g. Asia-Pacific Fulfillment Hub"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City / Region *</label>
            <input
              type="text"
              required
              value={whCity}
              onChange={(e) => setWhCity(e.target.value)}
              placeholder="e.g. Singapore, SG"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Rated Storage Capacity (Units) *</label>
            <input
              type="number"
              required
              value={whCapacity}
              onChange={(e) => setWhCapacity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsAddWhOpen(false)} className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs">
              Cancel
            </button>
            <button type="submit" disabled={formSubmitting} className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold">
              {formSubmitting ? 'Saving...' : 'Create Warehouse'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Location Modal */}
      <Modal isOpen={isAddLocOpen} onClose={() => setIsAddLocOpen(false)} title="Add Storage Bay / Rack">
        <form onSubmit={handleCreateLocation} className="space-y-4">
          {formError && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs">{formError}</div>}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bay / Rack Name *</label>
            <input
              type="text"
              required
              value={locName}
              onChange={(e) => setLocName(e.target.value)}
              placeholder="e.g. High-Bay Rack 04B"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location Type *</label>
            <select
              value={locType}
              onChange={(e) => setLocType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            >
              <option value="internal">Internal Storage</option>
              <option value="dispatch">Dispatch & Staging</option>
              <option value="qc">Quality Inspection (QC)</option>
              <option value="scrap">Scrap & Quarantine</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsAddLocOpen(false)} className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs">
              Cancel
            </button>
            <button type="submit" disabled={formSubmitting} className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold">
              {formSubmitting ? 'Saving...' : 'Add Storage Location'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
