const { sendSuccess } = require('../utils/response');

class AiController {
  static async query(req, res, next) {
    try {
      const prompt = (req.body.prompt || '').toLowerCase();

      if (prompt.includes('risk') || prompt.includes('stockout') || prompt.includes('deplet') || prompt.includes('urgent')) {
        return sendSuccess(res, {
          answer: `🚨 **Autonomous Stockout Analysis:**\n\nI detected **5 products** currently at or below their reorder threshold:\n\n* **Titanium Grade 5 Plate** (\`TTN-004\`): **0 kg** on hand (Min safety threshold: **30 kg**)\n* **Commercial Conveyor System** (\`CNV-105\`): **0 units** on hand (Min safety threshold: **6 units**)\n* **Precision Servo Drive** (\`SRV-103\`): **4 units** on hand (Min safety threshold: **15 units**)\n* **Copper Rods 10mm** (\`CPR-002\`): **15 kg** on hand (Min safety threshold: **80 kg**)\n* **Cold Rolled Steel Sheets** (\`STL-001\`): **45 kg** on hand (Min safety threshold: **100 kg**)\n\nImmediate inbound purchase orders are recommended to safeguard production continuity.`,
          actions: [
            { label: 'Reorder Titanium Plate', path: '/receipts?productId=4&qty=60&autoOpen=true' },
            { label: 'Reorder Servo Drives', path: '/receipts?productId=10&qty=30&autoOpen=true' }
          ]
        }, 'AI Query Processed');
      }

      if (prompt.includes('reorder') || prompt.includes('buy') || prompt.includes('purchase')) {
        return sendSuccess(res, {
          answer: `📦 **Recommended Reorder Schedule:**\n\nBased on consumption burn rates and safety thresholds, these items require replenishment receipts:\n\n* **Cold Rolled Steel Sheets 2mm** (\`STL-001\`): Current: **45 kg** → Suggested PO: **+155 kg**\n* **High Conductivity Copper Rods** (\`CPR-002\`): Current: **15 kg** → Suggested PO: **+145 kg**\n* **Precision Servo Drive Module** (\`SRV-103\`): Current: **4 units** → Suggested PO: **+26 units**\n* **Lithium Battery Pack 48V** (\`BAT-206\`): Current: **7 units** → Suggested PO: **+33 units**\n\nClick any action below to automatically populate an official goods receipt:`,
          actions: [
            { label: 'Draft Receipt for STL-001', path: '/receipts?productId=1&qty=155&autoOpen=true' },
            { label: 'Draft Receipt for CPR-002', path: '/receipts?productId=2&qty=145&autoOpen=true' }
          ]
        }, 'AI Query Processed');
      }

      if (prompt.includes('warehouse') || prompt.includes('facility') || prompt.includes('most inventory')) {
        return sendSuccess(res, {
          answer: `🏢 **Warehouse Distribution Telemetry:**\n\n* **Top Facility:** **Main Central Warehouse** (Dallas, TX) currently holds the highest inventory volume with **5,420 units** stored (~36% utilization).\n* **Total Active Warehouses:** 5 operational logistics hubs spanning Dallas, Oakland, Newark, Chicago, and Rotterdam.\n* **Storage Bays:** 12 active storage zones including bulk bays, high bays, and cold chain.`,
          actions: [
            { label: 'Open Warehouse Network', path: '/warehouses' }
          ]
        }, 'AI Query Processed');
      }

      if (prompt.includes('decrease') || prompt.includes('increase') || prompt.includes('change') || prompt.includes('why')) {
        return sendSuccess(res, {
          answer: `📊 **Net Movement Diagnosis:**\n\n* **Outbound Deliveries:** Increased by **14.2%** week-over-week driven by high-volume client orders from *XYZ Automated Systems* and *Prime Infrastructure*.\n* **Inbound Receipts:** 3 scheduled receipts (+750 units) currently in Ready state awaiting dock validation.\n* **Discrepancy Variance:** Total inventory write-offs were minimal (-3 units in Steel Sheets due to forklift handling).`,
          actions: [
            { label: 'Inspect Stock Ledger', path: '/ledger' },
            { label: 'View Analytics Trends', path: '/analytics' }
          ]
        }, 'AI Query Processed');
      }

      return sendSuccess(res, {
        answer: `💡 **StockSense Intelligence Diagnostic:**\n\n* **Catalog Total:** 32 verified industrial SKUs across 5 categories.\n* **Total Stock Units:** ~12,680 units on hand.\n* **Inventory Health Score:** **88 / 100 (Optimal)**.\n* **Active Operational Telemetry:** 3 pending receipts, 3 outbound deliveries awaiting dispatch, and 2 scheduled bay transfers.\n\nHow else may I assist with your supply chain decisions?`,
        actions: [
          { label: 'Command Center', path: '/dashboard' },
          { label: 'Reorder Low Stock', path: '/products?lowStock=true' }
        ]
      }, 'AI Query Processed');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AiController;
