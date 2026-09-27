import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { warehouseService } from '../services/warehouseService';
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
  DollarSign
} from 'lucide-react';

export default function Warehouses() {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [locations, setLocations] = useState([]);
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
      const [whRes, locRes] = await Promise.all([
        warehouseService.getAll(),
        warehouseService.getLocations(),
      ]);
      setWarehouses(whRes.data || []);
      setLocations(locRes.data || []);
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

  const totalCapacity = warehouses.reduce((acc, w) => acc + (w.capacity || 10000), 0);
  const totalStored = warehouses.reduce((acc, w) => acc + (w.total_units || 0), 0);
  const overallUtil = totalCapacity > 0 ? Math.round((totalStored / totalCapacity) * 100) : 0;

  const filteredWarehouses = warehouses.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (w.city && w.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Multi-Warehouse Operations</h1>
          <p className="text-sm text-slate-500">Global logistics hubs, storage bays, and capacity utilization</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchWarehousesData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs cursor-pointer transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              if (warehouses.length > 0) setSelectedWhId(warehouses[0].id);
              setIsAddLocOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4 text-slate-500" />
            <span>Add Bay / Zone</span>
          </button>
          <button
            onClick={() => setIsAddWhOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Warehouse</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Facilities</span>
            <Warehouse className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{warehouses.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Multi-site logistics network</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Storage Zones / Bays</span>
            <Layers className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{locations.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Racks, cold storage, buffers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Stored Stock</span>
            <Boxes className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalStored.toLocaleString()} units</div>
          <div className="text-[11px] text-slate-400 mt-1">Across all enterprise depots</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Network Capacity Util.</span>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{overallUtil}%</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${overallUtil > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, overallUtil)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Warehouse Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-900 text-base">Logistics Warehouses</h3>
            <span className="text-xs text-slate-400">Real-time capacity tracking</span>
          </div>
          <div className="relative w-64">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search warehouses..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWarehouses.map((wh) => {
            const whLocs = locations.filter(l => l.warehouse_id === wh.id);
            const cap = wh.capacity || 10000;
            const units = wh.total_units || 0;
            const util = Math.round((units / cap) * 100);

            return (
              <div 
                key={wh.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                        <Warehouse className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{wh.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          <span>{wh.city || wh.address || 'Central Hub'}</span>
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500 font-medium">Capacity Utilization</span>
                        <span className="font-bold text-slate-800">{util}% ({units.toLocaleString()} / {cap.toLocaleString()} units)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            util > 90 ? 'bg-rose-500' : util > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, util)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-500">Storage Bays & Zones:</span>
                      <strong className="text-slate-800">{whLocs.length} Active</strong>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {whLocs.slice(0, 4).map(l => (
                        <span key={l.id} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {l.name}
                        </span>
                      ))}
                      {whLocs.length > 4 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                          +{whLocs.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedWhId(wh.id);
                      setIsAddLocOpen(true);
                    }}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    + Add Storage Bay
                  </button>
                  <button
                    onClick={() => navigate(`/products?warehouseId=${wh.id}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <span>View Stock</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Storage Locations / Zones Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Storage Locations & Zones Directory</h3>
            <p className="text-xs text-slate-500">Full physical mapping of internal warehouse storage bays</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{locations.length} Locations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="py-3 px-6">Location Name</th>
                <th className="py-3 px-6">Facility / Warehouse</th>
                <th className="py-3 px-6">Zone Type</th>
                <th className="py-3 px-6 text-right">Items Stored</th>
                <th className="py-3 px-6 text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {locations.map((loc) => (
                <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">{loc.name}</td>
                  <td className="py-3.5 px-6 text-slate-600 font-medium">{loc.warehouse_name || 'Main Warehouse'}</td>
                  <td className="py-3.5 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                      loc.type === 'scrap' ? 'bg-rose-100 text-rose-800' :
                      loc.type === 'qc' ? 'bg-amber-100 text-amber-800' :
                      loc.type === 'dispatch' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {loc.type ? loc.type.toUpperCase() : 'INTERNAL'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right font-mono text-xs text-slate-600">
                    {loc.total_units ? `${loc.total_units.toLocaleString()} units` : 'Operational'}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> Ready
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Warehouse Modal */}
      <Modal
        isOpen={isAddWhOpen}
        onClose={() => setIsAddWhOpen(false)}
        title="Add New Warehouse Facility"
      >
        {formError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {formError}
          </div>
        )}
        <form onSubmit={handleCreateWarehouse} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Warehouse Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Midwest Logistics Center"
              value={whName}
              onChange={(e) => setWhName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City / Region *</label>
            <input
              type="text"
              required
              placeholder="e.g. Chicago, IL"
              value={whCity}
              onChange={(e) => setWhCity(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Total Capacity (Units)</label>
            <input
              type="number"
              min="1000"
              value={whCapacity}
              onChange={(e) => setWhCapacity(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddWhOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
            >
              {formSubmitting ? 'Creating...' : 'Create Facility'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Location Modal */}
      <Modal
        isOpen={isAddLocOpen}
        onClose={() => setIsAddLocOpen(false)}
        title="Add Storage Bay / Zone"
      >
        {formError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {formError}
          </div>
        )}
        <form onSubmit={handleCreateLocation} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Warehouse *</label>
            <select
              value={selectedWhId}
              onChange={(e) => setSelectedWhId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-500"
            >
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.city || 'Facility'})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Zone Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rack C-04 High Bay"
              value={locName}
              onChange={(e) => setLocName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Zone Type</label>
            <select
              value={locType}
              onChange={(e) => setLocType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-emerald-500"
            >
              <option value="internal">Internal Bulk Storage</option>
              <option value="dispatch">Dispatch & Staging Bay</option>
              <option value="qc">Quality Inspection (QC)</option>
              <option value="cold">Cold Chain / Refrigerated</option>
              <option value="scrap">Scrap & Quarantine</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsAddLocOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
            >
              {formSubmitting ? 'Adding...' : 'Add Storage Location'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
