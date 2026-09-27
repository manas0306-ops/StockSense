const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

async function seed() {
  const client = await pool.connect();
  try {
    console.log('[Seed] Starting database seeding...');
    await client.query('BEGIN');

    // 1. Users
    const managerPassword = await bcrypt.hash('admin123', 10);
    const staffPassword = await bcrypt.hash('staff123', 10);

    await client.query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES 
        ('Alex Rivera (Manager)', 'manager@stocksense.com', $1, 'Inventory Manager'),
        ('Sam Patel (Staff)', 'staff@stocksense.com', $2, 'Warehouse Staff')
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role;
    `, [managerPassword, staffPassword]);

    // 2. Categories
    const categories = ['Raw Materials', 'Finished Goods', 'Electronics', 'Hardware & Fasteners', 'Packaging & Supplies'];
    for (const cat of categories) {
      await client.query(`
        INSERT INTO categories (name) VALUES ($1)
        ON CONFLICT (name) DO NOTHING;
      `, [cat]);
    }

    // 3. Warehouses
    const warehouses = [
      'Main Central Warehouse',
      'West Coast Distribution Hub',
      'East Coast Terminal',
      'Great Lakes Logistics Center',
      'European Distribution Hub'
    ];
    for (const w of warehouses) {
      await client.query(`
        INSERT INTO warehouses (name, active) VALUES ($1, true)
        ON CONFLICT (name) DO NOTHING;
      `, [w]);
    }

    // Fetch warehouse IDs
    const whRes = await client.query('SELECT id, name FROM warehouses');
    const whMap = {};
    whRes.rows.forEach(r => whMap[r.name] = r.id);

    // 4. Locations
    const locations = [
      { warehouse: 'Main Central Warehouse', name: 'Main Store Bulk Bay' },
      { warehouse: 'Main Central Warehouse', name: 'Production Assembly Buffer' },
      { warehouse: 'Main Central Warehouse', name: 'Quality Inspection Bay (QC)' },
      { warehouse: 'Main Central Warehouse', name: 'Quarantine & Scrap Bin' },
      { warehouse: 'West Coast Distribution Hub', name: 'Rack A - High Bay Storage' },
      { warehouse: 'West Coast Distribution Hub', name: 'Dispatch Staging Bay West' },
      { warehouse: 'East Coast Terminal', name: 'East Inbound Dock A' },
      { warehouse: 'East Coast Terminal', name: 'East High-Density Staging' },
      { warehouse: 'Great Lakes Logistics Center', name: 'Cold Chain / Refrigerated Unit' },
      { warehouse: 'Great Lakes Logistics Center', name: 'Fast Pick Automated Zone' },
      { warehouse: 'European Distribution Hub', name: 'Euro Staging Depot 01' },
      { warehouse: 'European Distribution Hub', name: 'Euro Rapid Transit Bay' }
    ];

    for (const loc of locations) {
      const whId = whMap[loc.warehouse];
      if (whId) {
        await client.query(`
          INSERT INTO locations (warehouse_id, name, active)
          VALUES ($1, $2, true)
          ON CONFLICT (warehouse_id, name) DO NOTHING;
        `, [whId, loc.name]);
      }
    }

    // 5. Suppliers
    const suppliers = [
      { name: 'ABC Steel & Metallurgy Corp', contact: 'sales@abcsteel.com | +1-800-STEEL-01' },
      { name: 'Apex Electronics & Sensors Ltd', contact: 'orders@apexsensors.com | +1-800-APEX-02' },
      { name: 'Global Industrial Fasteners Inc', contact: 'support@globalfasteners.com | +1-800-FAST-03' },
      { name: 'Polymer Synthetics Global', contact: 'supply@polymersynth.com | +1-800-POLY-04' },
      { name: 'Precision Motors & Robotics AG', contact: 'sales@precisionrobotics.ch | +41-44-800-05' }
    ];
    for (const s of suppliers) {
      await client.query(`
        INSERT INTO suppliers (name, contact) VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `, [s.name, s.contact]);
    }

    // 6. Customers
    const customers = [
      { name: 'XYZ Automated Systems Inc', contact: 'procurement@xyzsystems.com | +1-888-XYZ-MFG1' },
      { name: 'Prime Infrastructure & Construction', contact: 'orders@primebuilds.com | +1-888-PRIME-02' },
      { name: 'Metro Robotics & Logistics Corp', contact: 'supply@metrorobotics.com | +1-888-METRO-03' },
      { name: 'NexGen Energy & Battery Corp', contact: 'batteries@nexgenenergy.com | +1-888-NEXGEN-4' },
      { name: 'Delta Aerospace Components', contact: 'procure@deltaaerospace.com | +1-888-DELTA-05' }
    ];
    for (const c of customers) {
      await client.query(`
        INSERT INTO customers (name, contact) VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `, [c.name, c.contact]);
    }

    // Fetch Category IDs
    const catRes = await client.query('SELECT id, name FROM categories');
    const catMap = {};
    catRes.rows.forEach(r => catMap[r.name] = r.id);

    // 7. 32 Products
    const products = [
      { name: 'Cold Rolled Steel Sheets 2mm', sku: 'STL-001', category: 'Raw Materials', unit: 'kg', reorder_level: 100 },
      { name: 'High Conductivity Copper Rods 10mm', sku: 'CPR-002', category: 'Raw Materials', unit: 'kg', reorder_level: 80 },
      { name: 'Aluminum Extrusion Profile 4040', sku: 'ALU-003', category: 'Raw Materials', unit: 'm', reorder_level: 50 },
      { name: 'Titanium Grade 5 Plate 5mm', sku: 'TTN-004', category: 'Raw Materials', unit: 'kg', reorder_level: 30 },
      { name: 'Industrial Polymer Pellets HDPE', sku: 'PLM-005', category: 'Raw Materials', unit: 'kg', reorder_level: 200 },
      { name: 'Carbon Fiber Prepreg Fabric', sku: 'CBF-006', category: 'Raw Materials', unit: 'sq.m', reorder_level: 40 },
      { name: 'Brass Round Bar 25mm Free-Cutting', sku: 'BRS-007', category: 'Raw Materials', unit: 'kg', reorder_level: 60 },
      { name: 'Automated PLC Distribution Panel', sku: 'PLC-101', category: 'Finished Goods', unit: 'units', reorder_level: 10 },
      { name: 'Heavy Duty Hydraulic Actuator 100kN', sku: 'ACT-102', category: 'Finished Goods', unit: 'units', reorder_level: 8 },
      { name: 'Precision Servo Drive Module 750W', sku: 'SRV-103', category: 'Finished Goods', unit: 'units', reorder_level: 15 },
      { name: 'Industrial Rotary Air Compressor 15HP', sku: 'CMP-104', category: 'Finished Goods', unit: 'units', reorder_level: 5 },
      { name: 'Modular Conveyor System 6m Unit', sku: 'CNV-105', category: 'Finished Goods', unit: 'units', reorder_level: 6 },
      { name: 'Robotic 3-Finger Articulated Gripper', sku: 'GRP-106', category: 'Finished Goods', unit: 'units', reorder_level: 8 },
      { name: 'High-Torque Inline Gearmotor 2.2kW', sku: 'MTR-107', category: 'Finished Goods', unit: 'units', reorder_level: 12 },
      { name: 'Electromechanical Relay 24V DC DPDT', sku: 'RLY-201', category: 'Electronics', unit: 'units', reorder_level: 150 },
      { name: 'Microcontroller Edge Gateway ESP32', sku: 'MCU-202', category: 'Electronics', unit: 'units', reorder_level: 200 },
      { name: 'Optical Laser Distance Sensor 50m', sku: 'SNS-203', category: 'Electronics', unit: 'units', reorder_level: 40 },
      { name: 'High-Power Three-Phase Inverter 10kW', sku: 'INV-204', category: 'Electronics', unit: 'units', reorder_level: 50 },
      { name: 'Digital Electromagnetic Flowmeter 50mm', sku: 'FLW-205', category: 'Electronics', unit: 'units', reorder_level: 25 },
      { name: 'Lithium Battery Pack 48V 100Ah LiFePO4', sku: 'BAT-206', category: 'Electronics', unit: 'units', reorder_level: 20 },
      { name: 'Industrial SMPS Power Supply 24V 20A', sku: 'PWR-207', category: 'Electronics', unit: 'units', reorder_level: 35 },
      { name: 'Industrial Ethernet Switch 8-Port PoE', sku: 'GTW-208', category: 'Electronics', unit: 'units', reorder_level: 15 },
      { name: 'M8 Hex Bolts Grade 8.8 (Box of 100)', sku: 'BLT-301', category: 'Hardware & Fasteners', unit: 'units', reorder_level: 1000 },
      { name: 'Flange Lock Nuts M10 (Box of 200)', sku: 'NUT-302', category: 'Hardware & Fasteners', unit: 'units', reorder_level: 1200 },
      { name: 'Deep Groove Ball Bearing 6205-2RS', sku: 'BRG-303', category: 'Hardware & Fasteners', unit: 'units', reorder_level: 100 },
      { name: 'Stainless Steel Hose Clamps 40-60mm', sku: 'CLP-304', category: 'Hardware & Fasteners', unit: 'units', reorder_level: 300 },
      { name: 'Pneumatic Quick Connect Fitting 8mm', sku: 'PNT-305', category: 'Hardware & Fasteners', unit: 'units', reorder_level: 250 },
      { name: 'Viton Fluoropolymer O-Ring Kit 400pc', sku: 'RNG-306', category: 'Hardware & Fasteners', unit: 'sets', reorder_level: 50 },
      { name: 'Heavy Duty Corrugated Boxes 40x30x30cm', sku: 'BOX-401', category: 'Packaging & Supplies', unit: 'units', reorder_level: 500 },
      { name: 'Cast Industrial Stretch Wrap 500m Roll', sku: 'WRP-402', category: 'Packaging & Supplies', unit: 'rolls', reorder_level: 80 },
      { name: 'Direct Thermal Shipping Labels 4x6 inch', sku: 'LBL-403', category: 'Packaging & Supplies', unit: 'rolls', reorder_level: 100 },
      { name: 'Tamper-Evident Security Cable Seals', sku: 'SEL-404', category: 'Packaging & Supplies', unit: 'units', reorder_level: 1000 }
    ];

    for (const p of products) {
      const cId = catMap[p.category] || null;
      await client.query(`
        INSERT INTO products (name, sku, category_id, unit_of_measure, reorder_level)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (sku) DO UPDATE
        SET name = EXCLUDED.name,
            category_id = EXCLUDED.category_id,
            unit_of_measure = EXCLUDED.unit_of_measure,
            reorder_level = EXCLUDED.reorder_level;
      `, [p.name, p.sku, cId, p.unit, p.reorder_level]);
    }

    // 8. Stocks & Ledger
    const prodRes = await client.query('SELECT id, sku FROM products');
    const prodMap = {};
    prodRes.rows.forEach(r => prodMap[r.sku] = r.id);

    const locRes = await client.query('SELECT id, name FROM locations');
    const locMap = {};
    locRes.rows.forEach(r => locMap[r.name] = r.id);

    const userRes = await client.query('SELECT id FROM users WHERE email = $1', ['manager@stocksense.com']);
    const managerId = userRes.rows[0]?.id;

    const initialStockMap = [
      { sku: 'STL-001', loc: 'Main Store Bulk Bay', qty: 45 },
      { sku: 'CPR-002', loc: 'Main Store Bulk Bay', qty: 15 },
      { sku: 'ALU-003', loc: 'Rack A - High Bay Storage', qty: 120 },
      { sku: 'PLM-005', loc: 'East Inbound Dock A', qty: 850 },
      { sku: 'PLC-101', loc: 'Production Assembly Buffer', qty: 18 },
      { sku: 'SRV-103', loc: 'Production Assembly Buffer', qty: 4 },
      { sku: 'RLY-201', loc: 'Main Store Bulk Bay', qty: 420 },
      { sku: 'BLT-301', loc: 'Main Store Bulk Bay', qty: 4200 },
      { sku: 'NUT-302', loc: 'Rack A - High Bay Storage', qty: 5800 },
      { sku: 'BOX-401', loc: 'East Inbound Dock A', qty: 1850 }
    ];

    for (const item of initialStockMap) {
      const pId = prodMap[item.sku];
      const lId = locMap[item.loc];
      if (pId && lId) {
        await client.query(`
          INSERT INTO stocks (product_id, location_id, quantity)
          VALUES ($1, $2, $3)
          ON CONFLICT (product_id, location_id) DO UPDATE SET quantity = $3;
        `, [pId, lId, item.qty]);

        await client.query(`
          INSERT INTO stock_ledger (product_id, operation_type, destination_location, quantity, user_id, previous_stock, new_stock, reference_type, reference_id)
          VALUES ($1, 'RECEIPT', $2, $3, $4, 0, $3, 'INITIAL_SEED', NULL);
        `, [pId, lId, item.qty, managerId]);
      }
    }

    await client.query('COMMIT');
    console.log('[Seed] Database seeded successfully with 32 products, 5 warehouses, 12 locations!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[Seed] Seeding failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
