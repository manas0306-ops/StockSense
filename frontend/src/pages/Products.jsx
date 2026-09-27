import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { metaService } from '../services/operationServices';
import Modal from '../components/Modal';
import ProductIntelligenceModal from '../components/ProductIntelligenceModal';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Layers, 
  Warehouse, 
  Eye, 
  CheckCircle2, 
  RefreshCw,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Sliders,
  Sparkles,
  Zap
} from 'lucide-react';
import { exportToCSV } from '../utils/csvExport';

export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [stockStatusFilter, setStockStatusFilter] = useState(
    searchParams.get('outOfStock') === 'true' ? 'OUT_OF_STOCK' :
    searchParams.get('lowStock') === 'true' ? 'LOW_STOCK' : 'ALL'
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [unitOfMeasure, setUnitOfMeasure] = useState('Kg');
  const [reorderLevel, setReorderLevel] = useState(10);
  const [initialStock, setInitialStock] = useState('');
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getAll({
        search: searchTerm,
        categoryId: selectedCategory,
        lowStock: stockStatusFilter === 'LOW_STOCK',
      });
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await metaService.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, stockStatusFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);
    try {
      await productService.create({
        name,
        sku,
        category_id: categoryId ? parseInt(categoryId, 10) : null,
        unit_of_measure: unitOfMeasure,
        reorder_level: parseFloat(reorderLevel),
        initial_stock: initialStock ? parseFloat(initialStock) : 0,
      });
      setIsCreateOpen(false);
      setName('');
      setSku('');
      setCategoryId('');
      setReorderLevel(10);
      setInitialStock('');
      fetchProducts();
    } catch (err) {
      setFormError(err.message || 'Failed to create product');
    } finally {
      setFormSubmitting(false);
    }
  };

  const openProductIntelligence = async (prod) => {
    try {
      const res = await productService.getById(prod.id);
      setSelectedProduct(res.data || prod);
    } catch (err) {
      setSelectedProduct(prod);
    }
    setIsIntelligenceOpen(true);
  };

  const handleExportCSV = () => {
    if (!products || products.length === 0) return;
    const rows = products.map(p => ({
      'Product Name': p.name,
      'SKU': p.sku,
      'Category': p.category_name || 'General',
      'Available Stock': parseFloat(p.current_stock || 0),
      'UOM': p.unit_of_measure,
      'Reorder Level': parseFloat(p.reorder_level || 0),
      'Stock Status': parseFloat(p.current_stock) === 0 ? 'Out of Stock' :
                     parseFloat(p.current_stock) <= parseFloat(p.reorder_level) ? 'Low Stock' : 'In Stock'
    }));
    exportToCSV(rows, `StockSense_Products_${new Date().toISOString().slice(0, 10)}`);
  };

  // Filter products by stockStatusFilter
  const filteredProducts = products.filter((p) => {
    const stock = parseFloat(p.current_stock || 0);
    const reorder = parseFloat(p.reorder_level || 0);
    if (stockStatusFilter === 'OUT_OF_STOCK') return stock === 0;
    if (stockStatusFilter === 'LOW_STOCK') return stock > 0 && stock <= reorder;
    if (stockStatusFilter === 'OPTIMAL') return stock > reorder;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products Catalog & Intelligence</h1>
          <p className="text-sm text-slate-500">Manage SKU specifications, reorder safety thresholds, and inventory distribution</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={products.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-xs cursor-pointer transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export to CSV</span>
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product name, SKU, or category..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-emerald-500"
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="LOW_STOCK">Low Stock (Under Reorder)</option>
              <option value="OUT_OF_STOCK">Out of Stock (Zero)</option>
              <option value="OPTIMAL">In Stock (Healthy)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="h-6 w-6 text-emerald-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-500">Loading catalog items...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Package className="h-10 w-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No products found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting search filters or create a new SKU.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase">
                <tr>
                  <th className="py-3.5 px-6">Product & SKU</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6 text-right">Available Stock</th>
                  <th className="py-3.5 px-6 text-right">Reorder Level</th>
                  <th className="py-3.5 px-6 text-center">Stock Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const stock = parseFloat(p.current_stock || 0);
                  const reorder = parseFloat(p.reorder_level || 0);
                  const isOutOfStock = stock === 0;
                  const isLowStock = !isOutOfStock && stock <= reorder;

                  return (
                    <tr 
                      key={p.id} 
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => openProductIntelligence(p)}
                    >
                      <td className="py-4 px-6 font-medium text-slate-900">
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">{p.name}</div>
                        <div className="text-xs font-mono text-slate-400">{p.sku}</div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          <Layers className="h-3 w-3 text-slate-400" />
                          {p.category_name || 'General'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-slate-900">
                        {stock.toLocaleString()} <span className="text-xs font-normal text-slate-400">{p.unit_of_measure}</span>
                      </td>
                      <td className="py-4 px-6 text-right text-slate-600">
                        {reorder.toLocaleString()} <span className="text-xs text-slate-400">{p.unit_of_measure}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            Optimal
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openProductIntelligence(p)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            title="Open Intelligence & History"
                          >
                            <Zap className="h-3 w-3 text-emerald-600" />
                            <span>Intelligence</span>
                          </button>

                          <button
                            onClick={() => navigate(`/receipts?productId=${p.id}&qty=100&autoOpen=true`)}
                            className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Receive Stock (Receipt)"
                          >
                            <ArrowDownLeft className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => navigate(`/deliveries?productId=${p.id}&autoOpen=true`)}
                            className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Deliver Stock (Outbound)"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => navigate(`/transfers?productId=${p.id}&autoOpen=true`)}
                            className="p-1 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Transfer Internal"
                          >
                            <ArrowLeftRight className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => navigate(`/adjustments?productId=${p.id}&autoOpen=true`)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Adjust Inventory"
                          >
                            <Sliders className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Intelligence Modal */}
      <ProductIntelligenceModal
        isOpen={isIntelligenceOpen}
        onClose={() => setIsIntelligenceOpen(false)}
        product={selectedProduct}
        onRefresh={fetchProducts}
      />

      {/* Create Product Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Product SKU"
      >
        {formError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {formError}
          </div>
        )}
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cold Rolled Steel Sheets 2mm"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Unique SKU *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. STL-808"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 focus:outline-hidden focus:border-emerald-500 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500"
              >
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Unit of Measure *
              </label>
              <select
                value={unitOfMeasure}
                onChange={(e) => setUnitOfMeasure(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500"
              >
                <option value="units">units (Pieces)</option>
                <option value="kg">kg (Kilograms)</option>
                <option value="m">m (Meters)</option>
                <option value="rolls">rolls</option>
                <option value="sets">sets</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Reorder Level *
              </label>
              <input
                type="number"
                min="0"
                required
                value={reorderLevel}
                onChange={(e) => setReorderLevel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Initial Stock Quantity (Optional)
            </label>
            <input
              type="number"
              min="0"
              value={initialStock}
              onChange={(e) => setInitialStock(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {formSubmitting ? 'Creating...' : 'Create SKU'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
