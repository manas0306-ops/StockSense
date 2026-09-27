const { sendSuccess } = require('../utils/response');

class ReportController {
  static async generate(req, res, next) {
    try {
      const template = req.body.template || 'inventory_summary';

      if (template === 'low_stock') {
        return sendSuccess(res, {
          title: 'Critical Low Stock & Replenishment Schedule',
          report_id: `RPT-LOW-${Date.now().toString().slice(-6)}`,
          headers: ['SKU', 'Product Name', 'Category', 'Available Stock', 'Reorder Level', 'Deficit / Shortfall', 'Recommended PO Qty', 'Urgency'],
          rows: [
            { SKU: 'TTN-004', 'Product Name': 'Titanium Grade 5 Plate 5mm', Category: 'Raw Materials', 'Available Stock': 0, 'Reorder Level': 30, 'Deficit / Shortfall': 30, 'Recommended PO Qty': 60, Urgency: 'CRITICAL' },
            { SKU: 'CNV-105', 'Product Name': 'Modular Conveyor System 6m Unit', Category: 'Finished Goods', 'Available Stock': 0, 'Reorder Level': 6, 'Deficit / Shortfall': 6, 'Recommended PO Qty': 12, Urgency: 'CRITICAL' },
            { SKU: 'SRV-103', 'Product Name': 'Precision Servo Drive Module 750W', Category: 'Finished Goods', 'Available Stock': 4, 'Reorder Level': 15, 'Deficit / Shortfall': 11, 'Recommended PO Qty': 26, Urgency: 'HIGH' },
            { SKU: 'CPR-002', 'Product Name': 'High Conductivity Copper Rods 10mm', Category: 'Raw Materials', 'Available Stock': 15, 'Reorder Level': 80, 'Deficit / Shortfall': 65, 'Recommended PO Qty': 145, Urgency: 'HIGH' },
            { SKU: 'STL-001', 'Product Name': 'Cold Rolled Steel Sheets 2mm', Category: 'Raw Materials', 'Available Stock': 45, 'Reorder Level': 100, 'Deficit / Shortfall': 55, 'Recommended PO Qty': 155, Urgency: 'HIGH' },
          ]
        }, 'Report compiled successfully');
      }

      return sendSuccess(res, {
        title: 'Comprehensive Inventory Valuation & Stock Summary',
        report_id: `RPT-VAL-${Date.now().toString().slice(-6)}`,
        headers: ['SKU', 'Product Name', 'Category', 'Stock', 'UOM', 'Unit Cost', 'Total Valuation', 'Status'],
        rows: [
          { SKU: 'STL-001', 'Product Name': 'Cold Rolled Steel Sheets 2mm', Category: 'Raw Materials', Stock: 45, UOM: 'kg', 'Unit Cost': '$14.50', 'Total Valuation': '$652.50', Status: 'Low Stock' },
          { SKU: 'CPR-002', 'Product Name': 'High Conductivity Copper Rods 10mm', Category: 'Raw Materials', Stock: 15, UOM: 'kg', 'Unit Cost': '$28.00', 'Total Valuation': '$420.00', Status: 'Low Stock' },
          { SKU: 'ALU-003', 'Product Name': 'Aluminum Extrusion Profile 4040', Category: 'Raw Materials', Stock: 120, UOM: 'm', 'Unit Cost': '$18.20', 'Total Valuation': '$2,184.00', Status: 'Optimal' },
          { SKU: 'TTN-004', 'Product Name': 'Titanium Grade 5 Plate 5mm', Category: 'Raw Materials', Stock: 0, UOM: 'kg', 'Unit Cost': '$95.00', 'Total Valuation': '$0.00', Status: 'Out of Stock' },
          { SKU: 'PLC-101', 'Product Name': 'Automated PLC Distribution Panel', Category: 'Finished Goods', Stock: 18, UOM: 'units', 'Unit Cost': '$1,450.00', 'Total Valuation': '$26,100.00', Status: 'Optimal' },
          { SKU: 'BLT-301', 'Product Name': 'M8 Hex Bolts Grade 8.8 (Box of 100)', Category: 'Hardware & Fasteners', Stock: 4200, UOM: 'units', 'Unit Cost': '$8.50', 'Total Valuation': '$35,700.00', Status: 'Optimal' },
        ]
      }, 'Report compiled successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReportController;
