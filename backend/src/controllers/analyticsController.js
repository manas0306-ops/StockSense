const { query } = require('../config/db');
const { sendSuccess } = require('../utils/response');

class AnalyticsController {
  static async getAnalytics(req, res, next) {
    try {
      const trends = [
        { date: 'Sep 01', stock: 11200, incoming: 450, outgoing: 320, value: 480000 },
        { date: 'Sep 05', stock: 11450, incoming: 620, outgoing: 370, value: 495000 },
        { date: 'Sep 10', stock: 11800, incoming: 800, outgoing: 450, value: 512000 },
        { date: 'Sep 15', stock: 11620, incoming: 310, outgoing: 490, value: 504000 },
        { date: 'Sep 20', stock: 12100, incoming: 950, outgoing: 470, value: 528000 },
        { date: 'Sep 25', stock: 12450, incoming: 720, outgoing: 370, value: 541000 },
        { date: 'Today', stock: 12680, incoming: 580, outgoing: 350, value: 552000 },
      ];

      const fastMoving = [
        { name: 'M8 Hex Bolts Grade 8.8 (Box of 100)', sku: 'BLT-301', unitsMoved: 1450, turnover: '8.4x', trend: '+14%' },
        { name: 'Cold Rolled Steel Sheets 2mm', sku: 'STL-001', unitsMoved: 820, turnover: '6.2x', trend: '+9%' },
        { name: 'Flange Lock Nuts M10 (Box of 200)', sku: 'NUT-302', unitsMoved: 780, turnover: '5.8x', trend: '+12%' },
        { name: 'Poly Stretch Wrap 500m Roll', sku: 'WRP-402', unitsMoved: 510, turnover: '5.1x', trend: '+4%' },
        { name: 'Microcontroller Edge Gateway ESP32', sku: 'MCU-202', unitsMoved: 430, turnover: '4.7x', trend: '+18%' },
      ];

      const slowMoving = [
        { name: 'Robotic 3-Finger Articulated Gripper', sku: 'GRP-106', currentStock: 14, daysIdle: 42, tiedCapital: '$16,100' },
        { name: 'Precision Servo Drive Module 750W', sku: 'SRV-103', currentStock: 4, daysIdle: 38, tiedCapital: '$1,640' },
        { name: 'Brass Round Bar 25mm Free-Cutting', sku: 'BRS-007', currentStock: 140, daysIdle: 29, tiedCapital: '$3,150' },
        { name: 'Digital Electromagnetic Flowmeter 50mm', sku: 'FLW-205', currentStock: 48, daysIdle: 26, tiedCapital: '$15,360' },
      ];

      const warehouseComparison = [
        { name: 'Main Central', capacity: 15000, current: 5420, util: 36 },
        { name: 'West Coast Hub', capacity: 10000, current: 3240, util: 32 },
        { name: 'East Coast Terminal', capacity: 12000, current: 2450, util: 20 },
        { name: 'Great Lakes Logistics', capacity: 8000, current: 1120, util: 14 },
        { name: 'European Hub', capacity: 20000, current: 450, util: 2 },
      ];

      return sendSuccess(res, {
        trends,
        fastMoving,
        slowMoving,
        warehouseComparison,
        operations: {
          avgReceiptHours: '2.4 hrs',
          avgDeliveryHours: '3.1 hrs',
          accuracyRate: '99.4%',
          discrepancyCount: 1,
          cycleCountVariance: '0.06%'
        }
      }, 'Analytics retrieved successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AnalyticsController;
