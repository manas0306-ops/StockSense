const { sendSuccess } = require('../utils/response');

// Active alerts state
let memoryAlerts = [
  {
    id: 1,
    severity: 'critical',
    title: 'Titanium Grade 5 Plate (TTN-004) Out of Stock',
    message: 'Zero stock detected at Main Central Warehouse. Safety stock depleted.',
    product_id: 4,
    warehouse_id: 1,
    warehouse_name: 'Main Central Warehouse',
    category: 'Stockout',
    is_read: false,
    status: 'active',
    created_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 2,
    severity: 'critical',
    title: 'Commercial Conveyor Unit (CNV-105) Depleted',
    message: 'East Coast Terminal has 0 inventory remaining. Pending order fulfillment at risk.',
    product_id: 12,
    warehouse_id: 3,
    warehouse_name: 'East Coast Terminal',
    category: 'Stockout',
    is_read: false,
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 3,
    severity: 'warning',
    title: 'High Conductivity Copper Rods (CPR-002) Critical Buffer',
    message: 'Current stock (15 kg) is 81% below reorder threshold (80 kg).',
    product_id: 2,
    warehouse_id: 1,
    warehouse_name: 'Main Central Warehouse',
    category: 'Reorder Buffer',
    is_read: false,
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 4,
    severity: 'warning',
    title: 'Precision Servo Drive (SRV-103) Below Reorder Level',
    message: 'Only 4 units available in Production Buffer. Threshold is 15 units.',
    product_id: 10,
    warehouse_id: 1,
    warehouse_name: 'Main Central Warehouse',
    category: 'Reorder Buffer',
    is_read: false,
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 5,
    severity: 'warning',
    title: 'Main Central Warehouse Approaching High Utilization',
    message: 'Bulk Bay storage volume is at 82% capacity. Consider transfer to West Coast Hub.',
    product_id: null,
    warehouse_id: 1,
    warehouse_name: 'Main Central Warehouse',
    category: 'Capacity',
    is_read: false,
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 6,
    severity: 'info',
    title: 'Scheduled Inbound Receipt Ready (REC-2026-0891)',
    message: '200 kg Cold Rolled Steel Sheets awaiting dock validation.',
    product_id: 1,
    warehouse_id: 1,
    warehouse_name: 'Main Central Warehouse',
    category: 'Operations',
    is_read: true,
    status: 'active',
    created_at: new Date(Date.now() - 3600000 * 16).toISOString()
  }
];

class AlertController {
  static async getAll(req, res, next) {
    try {
      const { severity, search } = req.query;
      let list = memoryAlerts;
      if (severity && severity !== 'ALL') {
        list = list.filter(a => a.severity === severity);
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(a => a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q));
      }
      return sendSuccess(res, list, 'Alerts fetched');
    } catch (err) {
      next(err);
    }
  }

  static async markRead(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const alert = memoryAlerts.find(a => a.id === id);
      if (alert) alert.is_read = true;
      return sendSuccess(res, alert, 'Alert marked read');
    } catch (err) {
      next(err);
    }
  }

  static async resolve(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const alert = memoryAlerts.find(a => a.id === id);
      if (alert) {
        alert.status = 'resolved';
        alert.is_read = true;
      }
      return sendSuccess(res, alert, 'Alert marked resolved');
    } catch (err) {
      next(err);
    }
  }

  static async resolveAll(req, res, next) {
    try {
      memoryAlerts.forEach(a => {
        a.status = 'resolved';
        a.is_read = true;
      });
      return sendSuccess(res, null, 'All alerts marked resolved');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AlertController;
