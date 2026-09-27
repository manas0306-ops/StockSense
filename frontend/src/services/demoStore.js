const STORAGE_KEY = 'stocksense_demo_db_v1';

// Seed data with 32 realistic products across 5 categories, 5 warehouses, 12 locations, 5 suppliers, 5 customers
const defaultSeed = {
  warehouses: [
    { id: 1, name: 'Main Central Warehouse', city: 'Dallas, TX', address: '1200 Logistics Blvd, Dallas, TX', capacity: 15000, active: true, total_units: 5420 },
    { id: 2, name: 'West Coast Distribution Hub', city: 'Oakland, CA', address: '450 Harbor Way, Oakland, CA', capacity: 10000, active: true, total_units: 3240 },
    { id: 3, name: 'East Coast Terminal', city: 'Newark, NJ', address: '88 Turnpike Rd, Newark, NJ', capacity: 12000, active: true, total_units: 2450 },
    { id: 4, name: 'Great Lakes Logistics Center', city: 'Chicago, IL', address: '500 Calumet Expwy, Chicago, IL', capacity: 8000, active: true, total_units: 1120 },
    { id: 5, name: 'European Distribution Hub', city: 'Rotterdam, NL', address: 'Maasvlakte 2, Rotterdam', capacity: 20000, active: true, total_units: 450 }
  ],
  locations: [
    { id: 1, name: 'Main Store Bulk Bay', warehouse_id: 1, warehouse_name: 'Main Central Warehouse', type: 'internal', total_units: 3200 },
    { id: 2, name: 'Production Assembly Buffer', warehouse_id: 1, warehouse_name: 'Main Central Warehouse', type: 'internal', total_units: 1420 },
    { id: 3, name: 'Quality Inspection Bay (QC)', warehouse_id: 1, warehouse_name: 'Main Central Warehouse', type: 'qc', total_units: 600 },
    { id: 4, name: 'Quarantine & Scrap Bin', warehouse_id: 1, warehouse_name: 'Main Central Warehouse', type: 'scrap', total_units: 200 },
    { id: 5, name: 'Rack A - High Bay Storage', warehouse_id: 2, warehouse_name: 'West Coast Distribution Hub', type: 'internal', total_units: 2100 },
    { id: 6, name: 'Dispatch Staging Bay West', warehouse_id: 2, warehouse_name: 'West Coast Distribution Hub', type: 'dispatch', total_units: 1140 },
    { id: 7, name: 'East Inbound Dock A', warehouse_id: 3, warehouse_name: 'East Coast Terminal', type: 'internal', total_units: 1450 },
    { id: 8, name: 'East High-Density Staging', warehouse_id: 3, warehouse_name: 'East Coast Terminal', type: 'internal', total_units: 1000 },
    { id: 9, name: 'Cold Chain / Refrigerated Unit', warehouse_id: 4, warehouse_name: 'Great Lakes Logistics Center', type: 'cold', total_units: 620 },
    { id: 10, name: 'Fast Pick Automated Zone', warehouse_id: 4, warehouse_name: 'Great Lakes Logistics Center', type: 'internal', total_units: 500 },
    { id: 11, name: 'Euro Staging Depot 01', warehouse_id: 5, warehouse_name: 'European Distribution Hub', type: 'internal', total_units: 350 },
    { id: 12, name: 'Euro Rapid Transit Bay', warehouse_id: 5, warehouse_name: 'European Distribution Hub', type: 'dispatch', total_units: 100 }
  ],
  categories: [
    { id: 1, name: 'Raw Materials' },
    { id: 2, name: 'Finished Goods' },
    { id: 3, name: 'Electronics' },
    { id: 4, name: 'Hardware & Fasteners' },
    { id: 5, name: 'Packaging & Supplies' }
  ],
  suppliers: [
    { id: 1, name: 'ABC Steel & Metallurgy Corp', contact: 'sales@abcsteel.com | +1-800-STEEL-01' },
    { id: 2, name: 'Apex Electronics & Sensors Ltd', contact: 'orders@apexsensors.com | +1-800-APEX-02' },
    { id: 3, name: 'Global Industrial Fasteners Inc', contact: 'support@globalfasteners.com | +1-800-FAST-03' },
    { id: 4, name: 'Polymer Synthetics Global', contact: 'supply@polymersynth.com | +1-800-POLY-04' },
    { id: 5, name: 'Precision Motors & Robotics AG', contact: 'sales@precisionrobotics.ch | +41-44-800-05' }
  ],
  customers: [
    { id: 1, name: 'XYZ Automated Systems Inc', contact: 'procurement@xyzsystems.com | +1-888-XYZ-MFG1' },
    { id: 2, name: 'Prime Infrastructure & Construction', contact: 'orders@primebuilds.com | +1-888-PRIME-02' },
    { id: 3, name: 'Metro Robotics & Logistics Corp', contact: 'supply@metrorobotics.com | +1-888-METRO-03' },
    { id: 4, name: 'NexGen Energy & Battery Corp', contact: 'batteries@nexgenenergy.com | +1-888-NEXGEN-4' },
    { id: 5, name: 'Delta Aerospace Components', contact: 'procure@deltaaerospace.com | +1-888-DELTA-05' }
  ],
  products: [
    // Raw Materials (Cat 1)
    { id: 1, name: 'Cold Rolled Steel Sheets 2mm', sku: 'STL-001', category_id: 1, category_name: 'Raw Materials', unit_of_measure: 'kg', reorder_level: 100, unit_cost: 14.50, description: 'Industrial cold rolled steel sheets for stamping & CNC', locations: [{ location_id: 1, location_name: 'Main Store Bulk Bay', warehouse_name: 'Main Central Warehouse', quantity: 45 }] },
    { id: 2, name: 'High Conductivity Copper Rods 10mm', sku: 'CPR-002', category_id: 1, category_name: 'Raw Materials', unit_of_measure: 'kg', reorder_level: 80, unit_cost: 28.00, description: 'Electrolytic copper rods for electrical busbars', locations: [{ location_id: 1, location_name: 'Main Store Bulk Bay', warehouse_name: 'Main Central Warehouse', quantity: 15 }] },
    { id: 3, name: 'Aluminum Extrusion Profile 4040', sku: 'ALU-003', category_id: 1, category_name: 'Raw Materials', unit_of_measure: 'm', reorder_level: 50, unit_cost: 18.20, description: 'T-slot modular anodized aluminum framing', locations: [{ location_id: 5, location_name: 'Rack A - High Bay Storage', warehouse_name: 'West Coast Distribution Hub', quantity: 120 }] },
    { id: 4, name: 'Titanium Grade 5 Plate 5mm', sku: 'TTN-004', category_id: 1, category_name: 'Raw Materials', unit_of_measure: 'kg', reorder_level: 30, unit_cost: 95.00, description: 'Aerospace-grade Ti-6Al-4V titanium plate', locations: [{ location_id: 1, location_name: 'Main Store Bulk Bay', warehouse_name: 'Main Central Warehouse', quantity: 0 }] },
    { id: 5, name: 'Industrial Polymer Pellets HDPE', sku: 'PLM-005', category_id: 1, category_name: 'Raw Materials', unit_of_measure: 'kg', reorder_level: 200, unit_cost: 4.80, description: 'Virgin high-density polyethylene injection molding pellets', locations: [{ location_id: 7, location_name: 'East Inbound Dock A', warehouse_name: 'East Coast Terminal', quantity: 850 }] },
    { id: 6, name: 'Carbon Fiber Prepreg Fabric', sku: 'CBF-006', category_id: 1, category_name: 'Raw Materials', unit_of_measure: 'sq.m', reorder_level: 40, unit_cost: 65.00, description: 'High-modulus carbon fiber roll for composites', locations: [{ location_id: 9, location_name: 'Cold Chain / Refrigerated Unit', warehouse_name: 'Great Lakes Logistics Center', quantity: 95 }] },
    { id: 7, name: 'Brass Round Bar 25mm Free-Cutting', sku: 'BRS-007', category_id: 1, category_name: 'Raw Materials', unit_of_measure: 'kg', reorder_level: 60, unit_cost: 22.50, description: 'CZ121 / CW614N precision machining brass rod', locations: [{ location_id: 1, location_name: 'Main Store Bulk Bay', warehouse_name: 'Main Central Warehouse', quantity: 140 }] },

    // Finished Goods (Cat 2)
    { id: 8, name: 'Automated PLC Distribution Panel', sku: 'PLC-101', category_id: 2, category_name: 'Finished Goods', unit_of_measure: 'units', reorder_level: 10, unit_cost: 1450.00, description: 'Pre-wired 480V automated control panel with Siemens S7', locations: [{ location_id: 2, location_name: 'Production Assembly Buffer', warehouse_name: 'Main Central Warehouse', quantity: 18 }] },
    { id: 9, name: 'Heavy Duty Hydraulic Actuator 100kN', sku: 'ACT-102', category_id: 2, category_name: 'Finished Goods', unit_of_measure: 'units', reorder_level: 8, unit_cost: 820.00, description: 'Industrial double-acting hydraulic stroke cylinder', locations: [{ location_id: 6, location_name: 'Dispatch Staging Bay West', warehouse_name: 'West Coast Distribution Hub', quantity: 12 }] },
    { id: 10, name: 'Precision Servo Drive Module 750W', sku: 'SRV-103', category_id: 2, category_name: 'Finished Goods', unit_of_measure: 'units', reorder_level: 15, unit_cost: 410.00, description: 'Closed-loop digital AC brushless servo driver', locations: [{ location_id: 2, location_name: 'Production Assembly Buffer', warehouse_name: 'Main Central Warehouse', quantity: 4 }] },
    { id: 11, name: 'Industrial Rotary Air Compressor 15HP', sku: 'CMP-104', category_id: 2, category_name: 'Finished Goods', unit_of_measure: 'units', reorder_level: 5, unit_cost: 3200.00, description: 'Silent acoustic enclosed variable speed compressor', locations: [{ location_id: 8, location_name: 'East High-Density Staging', warehouse_name: 'East Coast Terminal', quantity: 9 }] },
    { id: 12, name: 'Modular Conveyor System 6m Unit', sku: 'CNV-105', category_id: 2, category_name: 'Finished Goods', unit_of_measure: 'units', reorder_level: 6, unit_cost: 2100.00, description: 'Motorized roller accumulation conveyor section', locations: [{ location_id: 8, location_name: 'East High-Density Staging', warehouse_name: 'East Coast Terminal', quantity: 0 }] },
    { id: 13, name: 'Robotic 3-Finger Articulated Gripper', sku: 'GRP-106', category_id: 2, category_name: 'Finished Goods', unit_of_measure: 'units', reorder_level: 8, unit_cost: 1150.00, description: 'Adaptive robotic end-effector for collaborative arms', locations: [{ location_id: 11, location_name: 'Euro Staging Depot 01', warehouse_name: 'European Distribution Hub', quantity: 14 }] },
    { id: 14, name: 'High-Torque Inline Gearmotor 2.2kW', sku: 'MTR-107', category_id: 2, category_name: 'Finished Goods', unit_of_measure: 'units', reorder_level: 12, unit_cost: 540.00, description: 'Helical geared three-phase induction motor 1:20 ratio', locations: [{ location_id: 2, location_name: 'Production Assembly Buffer', warehouse_name: 'Main Central Warehouse', quantity: 26 }] },

    // Electronics (Cat 3)
    { id: 15, name: 'Electromechanical Relay 24V DC DPDT', sku: 'RLY-201', category_id: 3, category_name: 'Electronics', unit_of_measure: 'units', reorder_level: 150, unit_cost: 6.20, description: 'Plug-in 8-pin miniature power relay with LED indicator', locations: [{ location_id: 1, location_name: 'Main Store Bulk Bay', warehouse_name: 'Main Central Warehouse', quantity: 420 }] },
    { id: 16, name: 'Microcontroller Edge Gateway ESP32', sku: 'MCU-202', category_id: 3, category_name: 'Electronics', unit_of_measure: 'units', reorder_level: 200, unit_cost: 18.50, description: 'Dual-core IoT telemetry edge board with CAN & RS485', locations: [{ location_id: 5, location_name: 'Rack A - High Bay Storage', warehouse_name: 'West Coast Distribution Hub', quantity: 650 }] },
    { id: 17, name: 'Optical Laser Distance Sensor 50m', sku: 'SNS-203', category_id: 3, category_name: 'Electronics', unit_of_measure: 'units', reorder_level: 40, unit_cost: 125.00, description: 'Time-of-flight millimeter precision laser ranging sensor', locations: [{ location_id: 3, location_name: 'Quality Inspection Bay (QC)', warehouse_name: 'Main Central Warehouse', quantity: 22 }] },
    { id: 18, name: 'High-Power Three-Phase Inverter 10kW', sku: 'INV-204', category_id: 3, category_name: 'Electronics', unit_of_measure: 'units', reorder_level: 50, unit_cost: 480.00, description: 'IGBT smart motor inverter with regenerative braking', locations: [{ location_id: 7, location_name: 'East Inbound Dock A', warehouse_name: 'East Coast Terminal', quantity: 110 }] },
    { id: 19, name: 'Digital Electromagnetic Flowmeter 50mm', sku: 'FLW-205', category_id: 3, category_name: 'Electronics', unit_of_measure: 'units', reorder_level: 25, unit_cost: 320.00, description: 'Flanged magnetic induction liquid flow sensor 4-20mA', locations: [{ location_id: 10, location_name: 'Fast Pick Automated Zone', warehouse_name: 'Great Lakes Logistics Center', quantity: 48 }] },
    { id: 20, name: 'Lithium Battery Pack 48V 100Ah LiFePO4', sku: 'BAT-206', category_id: 3, category_name: 'Electronics', unit_of_measure: 'units', reorder_level: 20, unit_cost: 890.00, description: 'Heavy-duty energy storage module with integrated BMS', locations: [{ location_id: 9, location_name: 'Cold Chain / Refrigerated Unit', warehouse_name: 'Great Lakes Logistics Center', quantity: 7 }] },
    { id: 21, name: 'Industrial SMPS Power Supply 24V 20A', sku: 'PWR-207', category_id: 3, category_name: 'Electronics', unit_of_measure: 'units', reorder_level: 35, unit_cost: 75.00, description: 'DIN-rail 480W active PFC switched mode power supply', locations: [{ location_id: 1, location_name: 'Main Store Bulk Bay', warehouse_name: 'Main Central Warehouse', quantity: 85 }] },
    { id: 22, name: 'Industrial Ethernet Switch 8-Port PoE', sku: 'GTW-208', category_id: 3, category_name: 'Electronics', unit_of_measure: 'units', reorder_level: 15, unit_cost: 160.00, description: 'Hardened aluminum DIN-rail gigabit managed switch', locations: [{ location_id: 5, location_name: 'Rack A - High Bay Storage', warehouse_name: 'West Coast Distribution Hub', quantity: 30 }] },

    // Hardware & Fasteners (Cat 4)
    { id: 23, name: 'M8 Hex Bolts Grade 8.8 (Box of 100)', sku: 'BLT-301', category_id: 4, category_name: 'Hardware & Fasteners', unit_of_measure: 'units', reorder_level: 1000, unit_cost: 8.50, description: 'Zinc-plated metric high-tensile steel hex head bolts', locations: [{ location_id: 1, location_name: 'Main Store Bulk Bay', warehouse_name: 'Main Central Warehouse', quantity: 4200 }] },
    { id: 24, name: 'Flange Lock Nuts M10 (Box of 200)', sku: 'NUT-302', category_id: 4, category_name: 'Hardware & Fasteners', unit_of_measure: 'units', reorder_level: 1200, unit_cost: 11.20, description: 'Grade 10 prevailing-torque serrated flange nuts', locations: [{ location_id: 5, location_name: 'Rack A - High Bay Storage', warehouse_name: 'West Coast Distribution Hub', quantity: 5800 }] },
    { id: 25, name: 'Deep Groove Ball Bearing 6205-2RS', sku: 'BRG-303', category_id: 4, category_name: 'Hardware & Fasteners', unit_of_measure: 'units', reorder_level: 100, unit_cost: 14.80, description: 'Rubber sealed high-speed chrome steel precision bearing', locations: [{ location_id: 10, location_name: 'Fast Pick Automated Zone', warehouse_name: 'Great Lakes Logistics Center', quantity: 320 }] },
    { id: 26, name: 'Stainless Steel Hose Clamps 40-60mm', sku: 'CLP-304', category_id: 4, category_name: 'Hardware & Fasteners', unit_of_measure: 'units', reorder_level: 300, unit_cost: 2.10, description: 'AISI 304 worm gear high-torque fluid hose clamps', locations: [{ location_id: 1, location_name: 'Main Store Bulk Bay', warehouse_name: 'Main Central Warehouse', quantity: 850 }] },
    { id: 27, name: 'Pneumatic Quick Connect Fitting 8mm', sku: 'PNT-305', category_id: 4, category_name: 'Hardware & Fasteners', unit_of_measure: 'units', reorder_level: 250, unit_cost: 3.40, description: 'Push-in one-touch air hose coupling brass nickel-plated', locations: [{ location_id: 3, location_name: 'Quality Inspection Bay (QC)', warehouse_name: 'Main Central Warehouse', quantity: 90 }] },
    { id: 28, name: 'Viton Fluoropolymer O-Ring Kit 400pc', sku: 'RNG-306', category_id: 4, category_name: 'Hardware & Fasteners', unit_of_measure: 'sets', reorder_level: 50, unit_cost: 42.00, description: 'High temperature chemical resistant elastomer seals', locations: [{ location_id: 5, location_name: 'Rack A - High Bay Storage', warehouse_name: 'West Coast Distribution Hub', quantity: 160 }] },

    // Packaging & Supplies (Cat 5)
    { id: 29, name: 'Heavy Duty Corrugated Boxes 40x30x30cm', sku: 'BOX-401', category_id: 5, category_name: 'Packaging & Supplies', unit_of_measure: 'units', reorder_level: 500, unit_cost: 1.80, description: 'Double-wall ECT-44 export shipping cartons', locations: [{ location_id: 7, location_name: 'East Inbound Dock A', warehouse_name: 'East Coast Terminal', quantity: 1850 }] },
    { id: 30, name: 'Cast Industrial Stretch Wrap 500m Roll', sku: 'WRP-402', category_id: 5, category_name: 'Packaging & Supplies', unit_of_measure: 'rolls', reorder_level: 80, unit_cost: 16.50, description: '23-micron puncture resistant pallet wrap film', locations: [{ location_id: 6, location_name: 'Dispatch Staging Bay West', warehouse_name: 'West Coast Distribution Hub', quantity: 210 }] },
    { id: 31, name: 'Direct Thermal Shipping Labels 4x6 inch', sku: 'LBL-403', category_id: 5, category_name: 'Packaging & Supplies', unit_of_measure: 'rolls', reorder_level: 100, unit_cost: 8.90, description: 'BPA-free continuous roll 500 labels per roll', locations: [{ location_id: 1, location_name: 'Main Store Bulk Bay', warehouse_name: 'Main Central Warehouse', quantity: 35 }] },
    { id: 32, name: 'Tamper-Evident Security Cable Seals', sku: 'SEL-404', category_id: 5, category_name: 'Packaging & Supplies', unit_of_measure: 'units', reorder_level: 1000, unit_cost: 0.95, description: 'ISO 17712 High Security container cable bolt seals', locations: [{ location_id: 7, location_name: 'East Inbound Dock A', warehouse_name: 'East Coast Terminal', quantity: 3600 }] }
  ],
  receipts: [
    {
      id: 101,
      reference_no: 'REC-2026-0891',
      supplier_id: 1,
      supplier_name: 'ABC Steel & Metallurgy Corp',
      destination_location_id: 1,
      destination_location_name: 'Main Store Bulk Bay',
      warehouse_name: 'Main Central Warehouse',
      status: 'ready',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      created_by_name: 'Alex Rivera (Manager)',
      notes: 'Urgent cold rolled sheets for assembly line 1',
      items: [{ id: 1, product_id: 1, product_name: 'Cold Rolled Steel Sheets 2mm', sku: 'STL-001', unit_of_measure: 'kg', quantity: 200 }]
    },
    {
      id: 102,
      reference_no: 'REC-2026-0892',
      supplier_id: 2,
      supplier_name: 'Apex Electronics & Sensors Ltd',
      destination_location_id: 3,
      destination_location_name: 'Quality Inspection Bay (QC)',
      warehouse_name: 'Main Central Warehouse',
      status: 'draft',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      created_by_name: 'Sam Patel (Staff)',
      notes: 'Scheduled replenishment batch for laser distance sensors',
      items: [{ id: 2, product_id: 17, product_name: 'Optical Laser Distance Sensor 50m', sku: 'SNS-203', unit_of_measure: 'units', quantity: 50 }]
    },
    {
      id: 103,
      reference_no: 'REC-2026-0893',
      supplier_id: 3,
      supplier_name: 'Global Industrial Fasteners Inc',
      destination_location_id: 5,
      destination_location_name: 'Rack A - High Bay Storage',
      warehouse_name: 'West Coast Distribution Hub',
      status: 'ready',
      created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      created_by_name: 'Alex Rivera (Manager)',
      notes: 'Bulk fasteners restock',
      items: [{ id: 3, product_id: 23, product_name: 'M8 Hex Bolts Grade 8.8 (Box of 100)', sku: 'BLT-301', unit_of_measure: 'units', quantity: 500 }]
    }
  ],
  deliveries: [
    {
      id: 201,
      reference_no: 'DEL-2026-0412',
      customer_id: 1,
      customer_name: 'XYZ Automated Systems Inc',
      source_location_id: 2,
      source_location_name: 'Production Assembly Buffer',
      warehouse_name: 'Main Central Warehouse',
      status: 'ready',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      created_by_name: 'Sam Patel (Staff)',
      notes: 'Automated controller panel dispatch',
      items: [{ id: 1, product_id: 8, product_name: 'Automated PLC Distribution Panel', sku: 'PLC-101', unit_of_measure: 'units', quantity: 4 }]
    },
    {
      id: 202,
      reference_no: 'DEL-2026-0413',
      customer_id: 2,
      customer_name: 'Prime Infrastructure & Construction',
      source_location_id: 5,
      source_location_name: 'Rack A - High Bay Storage',
      warehouse_name: 'West Coast Distribution Hub',
      status: 'draft',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      created_by_name: 'Alex Rivera (Manager)',
      notes: 'High tensile fasteners order',
      items: [{ id: 2, product_id: 24, product_name: 'Flange Lock Nuts M10 (Box of 200)', sku: 'NUT-302', unit_of_measure: 'units', quantity: 200 }]
    },
    {
      id: 203,
      reference_no: 'DEL-2026-0414',
      customer_id: 3,
      customer_name: 'Metro Robotics & Logistics Corp',
      source_location_id: 11,
      source_location_name: 'Euro Staging Depot 01',
      warehouse_name: 'European Distribution Hub',
      status: 'ready',
      created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
      created_by_name: 'Sam Patel (Staff)',
      notes: 'Robotic end effectors shipment to Rotterdam',
      items: [{ id: 3, product_id: 13, product_name: 'Robotic 3-Finger Articulated Gripper', sku: 'GRP-106', unit_of_measure: 'units', quantity: 2 }]
    }
  ],
  transfers: [
    {
      id: 301,
      reference_no: 'TRF-2026-0155',
      source_location_id: 1,
      source_location_name: 'Main Store Bulk Bay',
      destination_location_id: 2,
      destination_location_name: 'Production Assembly Buffer',
      status: 'ready',
      created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      created_by_name: 'Alex Rivera (Manager)',
      reason: 'Replenishing production floor buffer for assembly line shift B',
      items: [{ id: 1, product_id: 15, product_name: 'Electromechanical Relay 24V DC DPDT', sku: 'RLY-201', unit_of_measure: 'units', quantity: 50 }]
    },
    {
      id: 302,
      reference_no: 'TRF-2026-0156',
      source_location_id: 5,
      source_location_name: 'Rack A - High Bay Storage',
      destination_location_id: 6,
      destination_location_name: 'Dispatch Staging Bay West',
      status: 'draft',
      created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
      created_by_name: 'Sam Patel (Staff)',
      reason: 'Staging aluminum extrusions for outbound logistics',
      items: [{ id: 2, product_id: 3, product_name: 'Aluminum Extrusion Profile 4040', sku: 'ALU-003', unit_of_measure: 'm', quantity: 30 }]
    }
  ],
  adjustments: [
    {
      id: 401,
      reference_no: 'ADJ-2026-0042',
      product_id: 1,
      product_name: 'Cold Rolled Steel Sheets 2mm',
      location_id: 1,
      location_name: 'Main Store Bulk Bay',
      system_quantity: 48,
      counted_quantity: 45,
      difference: -3,
      reason: 'Damaged during forklift offloading',
      status: 'done',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      created_by_name: 'Alex Rivera (Manager)'
    }
  ],
  alerts: [
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
  ],
  ledger: [
    { id: 1, timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), product_id: 1, product_name: 'Cold Rolled Steel Sheets 2mm', sku: 'STL-001', unit_of_measure: 'kg', operation_type: 'RECEIPT', source_location_name: null, destination_location_name: 'Main Store Bulk Bay', quantity: 50, previous_stock: 45, new_stock: 95, user_name: 'Alex Rivera (Manager)' },
    { id: 2, timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), product_id: 8, product_name: 'Automated PLC Distribution Panel', sku: 'PLC-101', unit_of_measure: 'units', operation_type: 'DELIVERY', source_location_name: 'Production Assembly Buffer', destination_location_name: null, quantity: 2, previous_stock: 20, new_stock: 18, user_name: 'Sam Patel (Staff)' },
    { id: 3, timestamp: new Date(Date.now() - 3600000 * 9).toISOString(), product_id: 15, product_name: 'Electromechanical Relay 24V DC DPDT', sku: 'RLY-201', unit_of_measure: 'units', operation_type: 'TRANSFER_IN', source_location_name: 'Main Store Bulk Bay', destination_location_name: 'Production Assembly Buffer', quantity: 50, previous_stock: 370, new_stock: 420, user_name: 'Alex Rivera (Manager)' },
    { id: 4, timestamp: new Date(Date.now() - 3600000 * 14).toISOString(), product_id: 23, product_name: 'M8 Hex Bolts Grade 8.8 (Box of 100)', sku: 'BLT-301', unit_of_measure: 'units', operation_type: 'RECEIPT', source_location_name: null, destination_location_name: 'Main Store Bulk Bay', quantity: 500, previous_stock: 3700, new_stock: 4200, user_name: 'Alex Rivera (Manager)' },
    { id: 5, timestamp: new Date(Date.now() - 3600000 * 20).toISOString(), product_id: 10, product_name: 'Precision Servo Drive Module 750W', sku: 'SRV-103', unit_of_measure: 'units', operation_type: 'DELIVERY', source_location_name: 'Production Assembly Buffer', destination_location_name: null, quantity: 6, previous_stock: 10, new_stock: 4, user_name: 'Sam Patel (Staff)' },
    { id: 6, timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), product_id: 1, product_name: 'Cold Rolled Steel Sheets 2mm', sku: 'STL-001', unit_of_measure: 'kg', operation_type: 'ADJUSTMENT', source_location_name: 'Main Store Bulk Bay', destination_location_name: 'Quarantine & Scrap Bin', quantity: 3, previous_stock: 48, new_stock: 45, user_name: 'Alex Rivera (Manager)' },
    { id: 7, timestamp: new Date(Date.now() - 3600000 * 36).toISOString(), product_id: 16, product_name: 'Microcontroller Edge Gateway ESP32', sku: 'MCU-202', unit_of_measure: 'units', operation_type: 'RECEIPT', source_location_name: null, destination_location_name: 'Rack A - High Bay Storage', quantity: 200, previous_stock: 450, new_stock: 650, user_name: 'Alex Rivera (Manager)' },
    { id: 8, timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), product_id: 20, product_name: 'Lithium Battery Pack 48V 100Ah LiFePO4', sku: 'BAT-206', unit_of_measure: 'units', operation_type: 'DELIVERY', source_location_name: 'Cold Chain / Refrigerated Unit', destination_location_name: null, quantity: 5, previous_stock: 12, new_stock: 7, user_name: 'Sam Patel (Staff)' },
    { id: 9, timestamp: new Date(Date.now() - 3600000 * 60).toISOString(), product_id: 5, product_name: 'Industrial Polymer Pellets HDPE', sku: 'PLM-005', unit_of_measure: 'kg', operation_type: 'RECEIPT', source_location_name: null, destination_location_name: 'East Inbound Dock A', quantity: 500, previous_stock: 350, new_stock: 850, user_name: 'Alex Rivera (Manager)' },
    { id: 10, timestamp: new Date(Date.now() - 3600000 * 72).toISOString(), product_id: 14, product_name: 'High-Torque Inline Gearmotor 2.2kW', sku: 'MTR-107', unit_of_measure: 'units', operation_type: 'RECEIPT', source_location_name: null, destination_location_name: 'Production Assembly Buffer', quantity: 15, previous_stock: 11, new_stock: 26, user_name: 'Alex Rivera (Manager)' }
  ]
};

function getDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.products && parsed.products.length >= 25) {
        return parsed;
      }
    }
  } catch (e) {
  }
  saveDb(defaultSeed);
  return JSON.parse(JSON.stringify(defaultSeed));
}

function saveDb(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
  }
}

export function handleMockRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`http://dummy${cleanEndpoint}`);
  let pathname = url.pathname;
  if (pathname.startsWith('/api')) {
    pathname = pathname.slice(4);
  }
  const searchParams = url.searchParams;
  let body = {};
  if (options.body) {
    try {
      body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
    } catch (e) {
      body = {};
    }
  }

  const db = getDb();

  // AUTH
  if (pathname === '/auth/login' && method === 'POST') {
    const email = body.email || 'manager@stocksense.com';
    const isStaff = email.includes('staff');
    const user = {
      id: isStaff ? 2 : 1,
      name: isStaff ? 'Sam Patel (Staff)' : 'Alex Rivera (Manager)',
      email: email,
      role: isStaff ? 'Warehouse Staff' : 'Inventory Manager'
    };
    return {
      success: true,
      data: {
        token: 'stocksense-demo-token-active-session',
        user
      },
      message: 'Login successful'
    };
  }

  if (pathname === '/auth/register' && method === 'POST') {
    const user = {
      id: Date.now(),
      name: body.name || 'New User',
      email: body.email,
      role: body.role || 'Inventory Manager'
    };
    return {
      success: true,
      data: {
        token: 'stocksense-demo-token-active-session',
        user
      },
      message: 'Account registered successfully'
    };
  }

  if (pathname === '/auth/me') {
    const user = {
      id: 1,
      name: 'Alex Rivera (Manager)',
      email: 'manager@stocksense.com',
      role: 'Inventory Manager'
    };
    return { success: true, data: { user, ...user } };
  }

  if (pathname === '/auth/forgot-password' && method === 'POST') {
    const email = body.email || 'manager@stocksense.com';
    const otp = '849201';
    sessionStorage.setItem('stocksense_demo_reset_otp', otp);
    sessionStorage.setItem('stocksense_demo_reset_email', email);
    return {
      success: true,
      data: { email, demoOtp: otp, expiresInMinutes: 10 },
      message: 'Password reset OTP generated successfully'
    };
  }

  if (pathname === '/auth/reset-password' && method === 'POST') {
    return {
      success: true,
      data: null,
      message: 'Password has been reset successfully. You can now log in.'
    };
  }

  // DASHBOARD
  if (pathname === '/dashboard') {
    const totalProducts = db.products.length;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    const lowStockProducts = [];
    let totalStockUnits = 0;

    // Category distribution
    const catMap = {};
    (db.categories || []).forEach(c => catMap[c.name] = { category: c.name, total_units: 0, product_count: 0 });

    // Warehouse distribution
    const whMap = {};
    (db.warehouses || []).forEach(w => whMap[w.id] = { warehouse_name: w.name, total_units: 0, capacity: w.capacity || 10000 });

    db.products.forEach(p => {
      const current = (p.locations || []).reduce((acc, loc) => acc + (parseFloat(loc.quantity) || 0), 0);
      p.current_stock = current;
      totalStockUnits += current;

      const catName = p.category_name || 'General';
      if (!catMap[catName]) catMap[catName] = { category: catName, total_units: 0, product_count: 0 };
      catMap[catName].total_units += current;
      catMap[catName].product_count += 1;

      (p.locations || []).forEach(loc => {
        const wh = db.locations.find(l => l.id === loc.location_id);
        const whId = wh ? wh.warehouse_id : 1;
        if (whMap[whId]) whMap[whId].total_units += parseFloat(loc.quantity || 0);
      });

      if (current === 0) {
        outOfStockCount++;
      }
      if (current <= p.reorder_level) {
        lowStockCount++;
        lowStockProducts.push({
          id: p.id,
          name: p.name,
          sku: p.sku,
          current_stock: current,
          reorder_level: p.reorder_level,
          unit_of_measure: p.unit_of_measure,
          category_name: p.category_name,
          deficit: Math.max(0, p.reorder_level - current)
        });
      }
    });

    const stockByCategory = Object.values(catMap);
    const stockByWarehouse = Object.values(whMap);

    return {
      success: true,
      data: {
        kpis: {
          totalProducts,
          totalStockUnits,
          lowStockCount,
          outOfStockCount,
          pendingReceipts: db.receipts.filter(r => r.status !== 'done').length,
          pendingDeliveries: db.deliveries.filter(d => d.status !== 'done').length,
          transfersScheduled: db.transfers.filter(t => t.status !== 'done').length,
          internalTransfers: db.transfers.length
        },
        healthScore: {
          score: 88,
          availabilityScore: 92,
          turnoverScore: 84,
          accuracyScore: 99,
          lowStockScore: 78,
          pendingOpsScore: 86,
          label: 'Optimal Health'
        },
        stockTrends: [
          { date: 'Sep 01', stock: totalStockUnits - 900, incoming: 450, outgoing: 320 },
          { date: 'Sep 08', stock: totalStockUnits - 600, incoming: 620, outgoing: 370 },
          { date: 'Sep 15', stock: totalStockUnits - 300, incoming: 580, outgoing: 420 },
          { date: 'Sep 22', stock: totalStockUnits - 150, incoming: 820, outgoing: 490 },
          { date: 'Today', stock: totalStockUnits, incoming: 520, outgoing: 350 },
        ],
        movementAnalytics: [
          { period: 'Sep 01', incoming: 450, outgoing: 280, transfers: 120, adjustments: -10 },
          { period: 'Sep 08', incoming: 620, outgoing: 350, transfers: 180, adjustments: -5 },
          { period: 'Sep 15', incoming: 380, outgoing: 420, transfers: 90, adjustments: 0 },
          { period: 'Sep 22', incoming: 850, outgoing: 490, transfers: 210, adjustments: -15 },
          { period: 'Current', incoming: 520, outgoing: 310, transfers: 140, adjustments: +5 },
        ],
        lowStockProducts,
        recentActivity: db.ledger.slice(0, 10).map(l => ({
          id: l.id,
          operation_type: l.operation_type,
          product_name: l.product_name,
          quantity: l.quantity,
          unit_of_measure: l.unit_of_measure,
          destination_location_name: l.destination_location_name,
          source_location_name: l.source_location_name,
          timestamp: l.timestamp,
        })),
        stockByCategory,
        stockByWarehouse,
        fastMovingProducts: [
          { name: 'M8 Hex Bolts Grade 8.8 (Box of 100)', sku: 'BLT-301', unitsSold: 1450, turnover: '8.4x', trend: '+14%' },
          { name: 'Cold Rolled Steel Sheets 2mm', sku: 'STL-001', unitsSold: 820, turnover: '6.2x', trend: '+9%' },
          { name: 'Flange Lock Nuts M10 (Box of 200)', sku: 'NUT-302', unitsSold: 780, turnover: '5.8x', trend: '+12%' },
          { name: 'Microcontroller Edge Gateway ESP32', sku: 'MCU-202', unitsSold: 430, turnover: '4.7x', trend: '+18%' },
        ],
        insights: [
          "Outbound shipments accelerated +14.2% across Midwest & West Coast fulfillment centers.",
          `Main Central Warehouse holds the highest stock concentration (${Math.round((5420/totalStockUnits)*100)}% of stored units).`,
          `${lowStockCount} items currently below safety reorder threshold requiring replenishment receipts.`,
          "Cycle count reconciliation accuracy verified at 99.4% with zero unverified variances."
        ]
      }
    };
  }

  // PRODUCTS
  if (pathname === '/products') {
    if (method === 'GET') {
      const search = (searchParams.get('search') || '').toLowerCase();
      const catId = searchParams.get('categoryId');
      const lowStock = searchParams.get('lowStock') === 'true';

      const list = db.products.map(p => {
        const total = (p.locations || []).reduce((acc, loc) => acc + (parseFloat(loc.quantity) || 0), 0);
        return { ...p, current_stock: total };
      }).filter(p => {
        if (search && !p.name.toLowerCase().includes(search) && !p.sku.toLowerCase().includes(search)) return false;
        if (catId && String(p.category_id) !== String(catId)) return false;
        if (lowStock && p.current_stock > p.reorder_level) return false;
        return true;
      });
      return { success: true, data: list };
    }

    if (method === 'POST') {
      const initialQty = parseFloat(body.initial_stock || 0);
      const initialLocations = [];
      if (!isNaN(initialQty) && initialQty > 0) {
        const defaultLoc = db.locations[0];
        initialLocations.push({
          location_id: defaultLoc.id,
          location_name: defaultLoc.name,
          warehouse_name: defaultLoc.warehouse_name,
          quantity: initialQty
        });
      }

      const newProd = {
        id: Date.now(),
        name: body.name,
        sku: body.sku,
        category_id: body.category_id,
        category_name: db.categories.find(c => c.id === parseInt(body.category_id, 10))?.name || 'General',
        unit_of_measure: body.unit_of_measure || 'units',
        reorder_level: parseFloat(body.reorder_level || 0),
        unit_cost: 45.00,
        description: body.description || '',
        locations: initialLocations
      };
      db.products.push(newProd);
      saveDb(db);
      return { success: true, data: newProd, message: 'Product created successfully' };
    }
  }

  const prodDetailMatch = pathname.match(/^\/products\/(\d+)$/);
  if (prodDetailMatch) {
    const id = parseInt(prodDetailMatch[1], 10);
    const prod = db.products.find(p => p.id === id);
    if (!prod) {
      const err = new Error('Product not found');
      err.status = 404;
      throw err;
    }
    const current_stock = (prod.locations || []).reduce((acc, loc) => acc + (parseFloat(loc.quantity) || 0), 0);
    return {
      success: true,
      data: {
        ...prod,
        current_stock,
        incoming_stock: 50,
        reserved_stock: Math.min(current_stock, 10),
      }
    };
  }

  // WAREHOUSES & LOCATIONS
  if (pathname === '/warehouses') {
    if (method === 'GET') {
      return { success: true, data: db.warehouses };
    }
    if (method === 'POST') {
      const newWh = {
        id: Date.now(),
        name: body.name,
        city: body.city || 'Facility',
        capacity: parseInt(body.capacity, 10) || 10000,
        active: true,
        total_units: 0
      };
      db.warehouses.push(newWh);
      saveDb(db);
      return { success: true, data: newWh, message: 'Warehouse created successfully' };
    }
  }

  if (pathname === '/locations') {
    if (method === 'GET') {
      const whId = searchParams.get('warehouseId');
      const locs = whId ? db.locations.filter(l => String(l.warehouse_id) === String(whId)) : db.locations;
      return { success: true, data: locs };
    }
    if (method === 'POST') {
      const wh = db.warehouses.find(w => w.id === parseInt(body.warehouse_id, 10));
      const newLoc = {
        id: Date.now(),
        name: body.name,
        warehouse_id: parseInt(body.warehouse_id, 10),
        warehouse_name: wh ? wh.name : 'Main Warehouse',
        type: body.type || 'internal',
        active: true,
        total_units: 0
      };
      db.locations.push(newLoc);
      saveDb(db);
      return { success: true, data: newLoc, message: 'Location created successfully' };
    }
  }

  // ANALYTICS
  if (pathname === '/analytics') {
    return {
      success: true,
      data: {
        trends: [
          { date: 'Sep 01', stock: 11200, incoming: 450, outgoing: 320, value: 480000 },
          { date: 'Sep 05', stock: 11450, incoming: 620, outgoing: 370, value: 495000 },
          { date: 'Sep 10', stock: 11800, incoming: 800, outgoing: 450, value: 512000 },
          { date: 'Sep 15', stock: 11620, incoming: 310, outgoing: 490, value: 504000 },
          { date: 'Sep 20', stock: 12100, incoming: 950, outgoing: 470, value: 528000 },
          { date: 'Sep 25', stock: 12450, incoming: 720, outgoing: 370, value: 541000 },
          { date: 'Today', stock: 12680, incoming: 580, outgoing: 350, value: 552000 },
        ],
        fastMoving: [
          { name: 'M8 Hex Bolts Grade 8.8 (Box of 100)', sku: 'BLT-301', unitsMoved: 1450, turnover: '8.4x', trend: '+14%' },
          { name: 'Cold Rolled Steel Sheets 2mm', sku: 'STL-001', unitsMoved: 820, turnover: '6.2x', trend: '+9%' },
          { name: 'Flange Lock Nuts M10 (Box of 200)', sku: 'NUT-302', unitsMoved: 780, turnover: '5.8x', trend: '+12%' },
          { name: 'Poly Stretch Wrap 500m Roll', sku: 'WRP-402', unitsMoved: 510, turnover: '5.1x', trend: '+4%' },
          { name: 'Microcontroller Edge Gateway ESP32', sku: 'MCU-202', unitsMoved: 430, turnover: '4.7x', trend: '+18%' },
        ],
        slowMoving: [
          { name: 'Robotic 3-Finger Articulated Gripper', sku: 'GRP-106', currentStock: 14, daysIdle: 42, tiedCapital: '$16,100' },
          { name: 'Precision Servo Drive Module 750W', sku: 'SRV-103', currentStock: 4, daysIdle: 38, tiedCapital: '$1,640' },
          { name: 'Brass Round Bar 25mm Free-Cutting', sku: 'BRS-007', currentStock: 140, daysIdle: 29, tiedCapital: '$3,150' },
          { name: 'Digital Electromagnetic Flowmeter 50mm', sku: 'FLW-205', currentStock: 48, daysIdle: 26, tiedCapital: '$15,360' },
        ],
        warehouseComparison: db.warehouses.map(w => ({
          name: w.name.replace(' Warehouse', '').replace(' Distribution Hub', '').replace(' Logistics Center', ''),
          capacity: w.capacity || 10000,
          current: w.total_units || 3000,
          util: Math.round(((w.total_units || 3000) / (w.capacity || 10000)) * 100)
        })),
        operations: {
          avgReceiptHours: '2.4 hrs',
          avgDeliveryHours: '3.1 hrs',
          accuracyRate: '99.4%',
          discrepancyCount: db.adjustments.length,
          cycleCountVariance: '0.06%'
        }
      }
    };
  }

  // ALERTS
  if (pathname === '/alerts') {
    if (method === 'GET') {
      const severity = searchParams.get('severity');
      const search = (searchParams.get('search') || '').toLowerCase();
      let list = db.alerts || [];
      if (severity && severity !== 'ALL') {
        list = list.filter(a => a.severity === severity);
      }
      if (search) {
        list = list.filter(a => a.title.toLowerCase().includes(search) || a.message.toLowerCase().includes(search));
      }
      return { success: true, data: list };
    }
  }

  const alertReadMatch = pathname.match(/^\/alerts\/(\d+)\/read$/);
  if (alertReadMatch && method === 'PUT') {
    const id = parseInt(alertReadMatch[1], 10);
    const alert = (db.alerts || []).find(a => a.id === id);
    if (alert) alert.is_read = true;
    saveDb(db);
    return { success: true, data: alert };
  }

  const alertResolveMatch = pathname.match(/^\/alerts\/(\d+)\/resolve$/);
  if (alertResolveMatch && method === 'PUT') {
    const id = parseInt(alertResolveMatch[1], 10);
    const alert = (db.alerts || []).find(a => a.id === id);
    if (alert) {
      alert.status = 'resolved';
      alert.is_read = true;
    }
    saveDb(db);
    return { success: true, data: alert };
  }

  if (pathname === '/alerts/resolve-all' && method === 'POST') {
    (db.alerts || []).forEach(a => {
      a.status = 'resolved';
      a.is_read = true;
    });
    saveDb(db);
    return { success: true, message: 'All alerts marked resolved' };
  }

  // AI ASSISTANT QUERY
  if (pathname === '/ai/query' && method === 'POST') {
    const prompt = (body.prompt || '').toLowerCase();

    // 1. Stockout / at risk query
    if (prompt.includes('risk') || prompt.includes('stockout') || prompt.includes('deplet') || prompt.includes('urgent')) {
      const lowItems = db.products.filter(p => {
        const stock = (p.locations || []).reduce((acc, loc) => acc + (parseFloat(loc.quantity) || 0), 0);
        return stock <= p.reorder_level;
      });

      const lines = lowItems.slice(0, 5).map(p => {
        const current = (p.locations || []).reduce((acc, loc) => acc + (parseFloat(loc.quantity) || 0), 0);
        return `* **${p.name}** (\`${p.sku}\`): **${current} ${p.unit_of_measure}** on hand (Min safety threshold: **${p.reorder_level}**)`;
      }).join('\n');

      return {
        success: true,
        data: {
          answer: `🚨 **Autonomous Stockout Analysis:**\n\nI detected **${lowItems.length} products** currently at or below their reorder threshold:\n\n${lines}\n\nImmediate inbound purchase orders are recommended to safeguard production continuity.`,
          actions: lowItems.slice(0, 3).map(p => ({
            label: `Reorder ${p.name.slice(0, 18)}...`,
            path: `/receipts?productId=${p.id}&qty=100&autoOpen=true`
          }))
        }
      };
    }

    // 2. What should I reorder query
    if (prompt.includes('reorder') || prompt.includes('buy') || prompt.includes('purchase')) {
      const reorderList = db.products
        .filter(p => {
          const stock = (p.locations || []).reduce((acc, loc) => acc + (parseFloat(loc.quantity) || 0), 0);
          return stock <= p.reorder_level;
        })
        .map(p => {
          const current = (p.locations || []).reduce((acc, loc) => acc + (parseFloat(loc.quantity) || 0), 0);
          const suggested = Math.max(50, p.reorder_level * 2 - current);
          return { ...p, current, suggested };
        });

      const bullets = reorderList.slice(0, 4).map(p => 
        `* **${p.name}** (\`${p.sku}\`): Current: **${p.current}** → Suggested PO: **+${p.suggested} ${p.unit_of_measure}**`
      ).join('\n');

      return {
        success: true,
        data: {
          answer: `📦 **Recommended Reorder Schedule:**\n\nBased on consumption burn rates and safety thresholds, these items require replenishment receipts:\n\n${bullets}\n\nClick any action below to automatically populate an official goods receipt:`,
          actions: reorderList.slice(0, 3).map(p => ({
            label: `Draft Receipt for ${p.sku}`,
            path: `/receipts?productId=${p.id}&qty=${p.suggested}&autoOpen=true`
          }))
        }
      };
    }

    // 3. Warehouse capacity query
    if (prompt.includes('warehouse') || prompt.includes('facility') || prompt.includes('most inventory') || prompt.includes('capacity')) {
      const topWh = [...db.warehouses].sort((a, b) => (b.total_units || 0) - (a.total_units || 0))[0];
      return {
        success: true,
        data: {
          answer: `🏢 **Warehouse Distribution Telemetry:**\n\n* **Top Facility:** **${topWh.name}** (${topWh.city}) currently holds the highest inventory volume with **${(topWh.total_units || 5420).toLocaleString()} units** stored (~${Math.round(((topWh.total_units || 5420) / (topWh.capacity || 15000)) * 100)}% utilization).\n* **Total Active Warehouses:** 5 operational logistics hubs spanning Dallas, Oakland, Newark, Chicago, and Rotterdam.\n* **Storage Bays:** 12 active storage zones including bulk bays, high bays, and cold chain.`,
          actions: [
            { label: 'Open Warehouse Network', path: '/warehouses' }
          ]
        }
      };
    }

    // 4. Why did inventory change / decrease query
    if (prompt.includes('decrease') || prompt.includes('increase') || prompt.includes('change') || prompt.includes('why')) {
      return {
        success: true,
        data: {
          answer: `📊 **Net Movement Diagnosis:**\n\n* **Outbound Deliveries:** Increased by **14.2%** week-over-week driven by high-volume client orders from *XYZ Automated Systems* and *Prime Infrastructure*.\n* **Inbound Receipts:** 3 scheduled receipts (+750 units) currently in Ready state awaiting dock validation.\n* **Discrepancy Variance:** Total inventory write-offs were minimal (-3 units in Steel Sheets due to forklift handling).`,
          actions: [
            { label: 'Inspect Stock Ledger', path: '/ledger' },
            { label: 'View Analytics Trends', path: '/analytics' }
          ]
        }
      };
    }

    // Default intelligent response
    return {
      success: true,
      data: {
        answer: `💡 **StockSense Intelligence Diagnostic:**\n\n* **Catalog Total:** 32 verified industrial SKUs across 5 categories.\n* **Total Stock Units:** ~12,680 units on hand.\n* **Inventory Health Score:** **88 / 100 (Optimal)**.\n* **Active Operational Telemetry:** 3 pending receipts, 3 outbound deliveries awaiting dispatch, and 2 scheduled bay transfers.\n\nHow else may I assist with your supply chain decisions?`,
        actions: [
          { label: 'Command Center', path: '/dashboard' },
          { label: 'Reorder Low Stock', path: '/products?lowStock=true' }
        ]
      }
    };
  }

  // REPORTS GENERATOR
  if (pathname === '/reports/generate' && method === 'POST') {
    const template = body.template || 'inventory_summary';

    if (template === 'inventory_summary') {
      const rows = db.products.map(p => {
        const stock = (p.locations || []).reduce((acc, loc) => acc + (parseFloat(loc.quantity) || 0), 0);
        return {
          SKU: p.sku,
          'Product Name': p.name,
          Category: p.category_name,
          Stock: stock,
          UOM: p.unit_of_measure,
          'Unit Cost': `$${p.unit_cost.toFixed(2)}`,
          'Total Valuation': `$${(stock * p.unit_cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          Status: stock === 0 ? 'Out of Stock' : stock <= p.reorder_level ? 'Low Stock' : 'Optimal'
        };
      });
      return {
        success: true,
        data: {
          title: 'Comprehensive Inventory Valuation & Stock Summary',
          report_id: `RPT-VAL-${Date.now().toString().slice(-6)}`,
          headers: ['SKU', 'Product Name', 'Category', 'Stock', 'UOM', 'Unit Cost', 'Total Valuation', 'Status'],
          rows
        }
      };
    }

    if (template === 'low_stock') {
      const rows = db.products
        .filter(p => {
          const stock = (p.locations || []).reduce((acc, loc) => acc + (parseFloat(loc.quantity) || 0), 0);
          return stock <= p.reorder_level;
        })
        .map(p => {
          const stock = (p.locations || []).reduce((acc, loc) => acc + (parseFloat(loc.quantity) || 0), 0);
          return {
            SKU: p.sku,
            'Product Name': p.name,
            Category: p.category_name,
            'Available Stock': stock,
            'Reorder Level': p.reorder_level,
            'Deficit / Shortfall': p.reorder_level - stock,
            'Recommended PO Qty': Math.max(50, p.reorder_level * 2 - stock),
            Urgency: stock === 0 ? 'CRITICAL' : 'HIGH'
          };
        });
      return {
        success: true,
        data: {
          title: 'Critical Low Stock & Replenishment Schedule',
          report_id: `RPT-LOW-${Date.now().toString().slice(-6)}`,
          headers: ['SKU', 'Product Name', 'Category', 'Available Stock', 'Reorder Level', 'Deficit / Shortfall', 'Recommended PO Qty', 'Urgency'],
          rows
        }
      };
    }

    // Default stock movement
    const rows = db.ledger.map(l => ({
      Timestamp: new Date(l.timestamp).toLocaleString(),
      'Operation Type': l.operation_type,
      SKU: l.sku,
      Product: l.product_name,
      Quantity: l.quantity,
      'From Location': l.source_location_name || 'N/A',
      'To Location': l.destination_location_name || 'N/A',
      User: l.user_name
    }));
    return {
      success: true,
      data: {
        title: 'Stock Movement & Ledger Audit Report',
        report_id: `RPT-MOV-${Date.now().toString().slice(-6)}`,
        headers: ['Timestamp', 'Operation Type', 'SKU', 'Product', 'Quantity', 'From Location', 'To Location', 'User'],
        rows
      }
    };
  }

  // RECEIPTS, DELIVERIES, TRANSFERS, ADJUSTMENTS, LEDGER (Preserved with full validation)
  if (pathname === '/receipts') {
    if (method === 'GET') return { success: true, data: db.receipts };
    if (method === 'POST') {
      const destLoc = db.locations.find(l => l.id === parseInt(body.destination_location_id, 10));
      const supp = db.suppliers.find(s => s.id === parseInt(body.supplier_id, 10));
      const items = (body.items || []).map(itm => {
        const prod = db.products.find(p => p.id === parseInt(itm.product_id, 10));
        return {
          id: Date.now() + Math.random(),
          product_id: itm.product_id,
          product_name: prod ? prod.name : 'Item',
          sku: prod ? prod.sku : 'SKU',
          unit_of_measure: prod ? prod.unit_of_measure : 'units',
          quantity: parseFloat(itm.quantity || 0)
        };
      });

      const newRec = {
        id: Date.now(),
        reference_no: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        supplier_id: body.supplier_id,
        supplier_name: supp ? supp.name : 'General Supplier',
        destination_location_id: body.destination_location_id,
        destination_location_name: destLoc ? destLoc.name : 'Main Store Bulk Bay',
        warehouse_name: destLoc ? destLoc.warehouse_name : 'Main Central Warehouse',
        status: 'draft',
        created_at: new Date().toISOString(),
        created_by_name: 'Alex Rivera (Manager)',
        notes: body.notes || '',
        items
      };
      db.receipts.unshift(newRec);
      saveDb(db);
      return { success: true, data: newRec, message: 'Receipt created successfully' };
    }
  }

  const recDetailMatch = pathname.match(/^\/receipts\/(\d+)$/);
  if (recDetailMatch) {
    const id = parseInt(recDetailMatch[1], 10);
    const rec = db.receipts.find(r => r.id === id);
    if (!rec) throw new Error('Receipt not found');
    return { success: true, data: rec };
  }

  const recReadyMatch = pathname.match(/^\/receipts\/(\d+)\/ready$/);
  if (recReadyMatch && method === 'POST') {
    const id = parseInt(recReadyMatch[1], 10);
    const rec = db.receipts.find(r => r.id === id);
    if (rec) {
      rec.status = 'ready';
      saveDb(db);
      return { success: true, data: rec, message: 'Receipt marked ready' };
    }
  }

  const recValMatch = pathname.match(/^\/receipts\/(\d+)\/validate$/);
  if (recValMatch && method === 'POST') {
    const id = parseInt(recValMatch[1], 10);
    const rec = db.receipts.find(r => r.id === id);
    if (!rec) throw new Error('Receipt not found');
    if (rec.status === 'done') throw new Error('Receipt already validated');

    rec.items.forEach(itm => {
      const prod = db.products.find(p => p.id === parseInt(itm.product_id, 10));
      if (prod) {
        if (!prod.locations) prod.locations = [];
        let locRow = prod.locations.find(l => l.location_id === parseInt(rec.destination_location_id, 10));
        const prev = locRow ? parseFloat(locRow.quantity || 0) : 0;
        const newQty = prev + parseFloat(itm.quantity || 0);
        if (locRow) {
          locRow.quantity = newQty;
        } else {
          prod.locations.push({
            location_id: parseInt(rec.destination_location_id, 10),
            location_name: rec.destination_location_name,
            warehouse_name: rec.warehouse_name,
            quantity: newQty
          });
        }

        db.ledger.unshift({
          id: Date.now() + Math.random(),
          timestamp: new Date().toISOString(),
          product_id: prod.id,
          product_name: prod.name,
          sku: prod.sku,
          unit_of_measure: prod.unit_of_measure,
          operation_type: 'RECEIPT',
          source_location_name: null,
          destination_location_name: rec.destination_location_name,
          quantity: parseFloat(itm.quantity || 0),
          previous_stock: prev,
          new_stock: newQty,
          user_name: 'Alex Rivera (Manager)'
        });
      }
    });

    rec.status = 'done';
    rec.validated_at = new Date().toISOString();
    saveDb(db);
    return { success: true, data: rec, message: 'Receipt validated successfully. Stock added!' };
  }

  // DELIVERIES
  if (pathname === '/deliveries') {
    if (method === 'GET') return { success: true, data: db.deliveries };
    if (method === 'POST') {
      const srcLoc = db.locations.find(l => l.id === parseInt(body.source_location_id, 10));
      const cust = db.customers.find(c => c.id === parseInt(body.customer_id, 10));
      const items = (body.items || []).map(itm => {
        const prod = db.products.find(p => p.id === parseInt(itm.product_id, 10));
        return {
          id: Date.now() + Math.random(),
          product_id: itm.product_id,
          product_name: prod ? prod.name : 'Item',
          sku: prod ? prod.sku : 'SKU',
          unit_of_measure: prod ? prod.unit_of_measure : 'units',
          quantity: parseFloat(itm.quantity || 0)
        };
      });

      const newDel = {
        id: Date.now(),
        reference_no: `DEL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        customer_id: body.customer_id,
        customer_name: cust ? cust.name : 'Direct Customer',
        source_location_id: body.source_location_id,
        source_location_name: srcLoc ? srcLoc.name : 'Main Store Bulk Bay',
        warehouse_name: srcLoc ? srcLoc.warehouse_name : 'Main Central Warehouse',
        status: 'draft',
        created_at: new Date().toISOString(),
        created_by_name: 'Alex Rivera (Manager)',
        notes: body.notes || '',
        items
      };
      db.deliveries.unshift(newDel);
      saveDb(db);
      return { success: true, data: newDel, message: 'Delivery order created successfully' };
    }
  }

  const delDetailMatch = pathname.match(/^\/deliveries\/(\d+)$/);
  if (delDetailMatch) {
    const id = parseInt(delDetailMatch[1], 10);
    const del = db.deliveries.find(d => d.id === id);
    if (!del) throw new Error('Delivery not found');
    return { success: true, data: del };
  }

  const delReadyMatch = pathname.match(/^\/deliveries\/(\d+)\/ready$/);
  if (delReadyMatch && method === 'POST') {
    const id = parseInt(delReadyMatch[1], 10);
    const del = db.deliveries.find(d => d.id === id);
    if (del) {
      del.status = 'ready';
      saveDb(db);
      return { success: true, data: del, message: 'Delivery marked ready' };
    }
  }

  const delValMatch = pathname.match(/^\/deliveries\/(\d+)\/validate$/);
  if (delValMatch && method === 'POST') {
    const id = parseInt(delValMatch[1], 10);
    const del = db.deliveries.find(d => d.id === id);
    if (!del) throw new Error('Delivery not found');
    if (del.status === 'done') throw new Error('Delivery already validated');

    // Check stock for all items first
    for (const itm of del.items) {
      const prod = db.products.find(p => p.id === parseInt(itm.product_id, 10));
      const locRow = (prod?.locations || []).find(l => l.location_id === parseInt(del.source_location_id, 10));
      const avail = locRow ? parseFloat(locRow.quantity || 0) : 0;
      if (avail < parseFloat(itm.quantity || 0)) {
        const err = new Error(`Insufficient stock for ${prod ? prod.name : 'product'}. Available: ${avail}, Requested: ${itm.quantity}`);
        err.status = 400;
        err.code = 'INSUFFICIENT_STOCK';
        throw err;
      }
    }

    del.items.forEach(itm => {
      const prod = db.products.find(p => p.id === parseInt(itm.product_id, 10));
      if (prod) {
        let locRow = prod.locations.find(l => l.location_id === parseInt(del.source_location_id, 10));
        const prev = locRow ? parseFloat(locRow.quantity || 0) : 0;
        const newQty = Math.max(0, prev - parseFloat(itm.quantity || 0));
        if (locRow) locRow.quantity = newQty;

        db.ledger.unshift({
          id: Date.now() + Math.random(),
          timestamp: new Date().toISOString(),
          product_id: prod.id,
          product_name: prod.name,
          sku: prod.sku,
          unit_of_measure: prod.unit_of_measure,
          operation_type: 'DELIVERY',
          source_location_name: del.source_location_name,
          destination_location_name: null,
          quantity: parseFloat(itm.quantity || 0),
          previous_stock: prev,
          new_stock: newQty,
          user_name: 'Alex Rivera (Manager)'
        });
      }
    });

    del.status = 'done';
    del.validated_at = new Date().toISOString();
    saveDb(db);
    return { success: true, data: del, message: 'Delivery validated successfully. Stock deducted!' };
  }

  // TRANSFERS
  if (pathname === '/transfers') {
    if (method === 'GET') return { success: true, data: db.transfers };
    if (method === 'POST') {
      const srcLoc = db.locations.find(l => l.id === parseInt(body.source_location_id, 10));
      const destLoc = db.locations.find(l => l.id === parseInt(body.destination_location_id, 10));
      const items = (body.items || []).map(itm => {
        const prod = db.products.find(p => p.id === parseInt(itm.product_id, 10));
        return {
          id: Date.now() + Math.random(),
          product_id: itm.product_id,
          product_name: prod ? prod.name : 'Item',
          sku: prod ? prod.sku : 'SKU',
          unit_of_measure: prod ? prod.unit_of_measure : 'units',
          quantity: parseFloat(itm.quantity || 0)
        };
      });

      const newTrf = {
        id: Date.now(),
        reference_no: `TRF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        source_location_id: body.source_location_id,
        source_location_name: srcLoc ? srcLoc.name : 'Origin Bay',
        destination_location_id: body.destination_location_id,
        destination_location_name: destLoc ? destLoc.name : 'Destination Bay',
        status: 'draft',
        created_at: new Date().toISOString(),
        created_by_name: 'Alex Rivera (Manager)',
        reason: body.reason || 'Internal warehouse replenishment',
        items
      };
      db.transfers.unshift(newTrf);
      saveDb(db);
      return { success: true, data: newTrf, message: 'Internal transfer created successfully' };
    }
  }

  const trfValMatch = pathname.match(/^\/transfers\/(\d+)\/validate$/);
  if (trfValMatch && method === 'POST') {
    const id = parseInt(trfValMatch[1], 10);
    const trf = db.transfers.find(t => t.id === id);
    if (!trf) throw new Error('Transfer not found');

    trf.items.forEach(itm => {
      const prod = db.products.find(p => p.id === parseInt(itm.product_id, 10));
      if (prod) {
        let srcLoc = (prod.locations || []).find(l => l.location_id === parseInt(trf.source_location_id, 10));
        let destLoc = (prod.locations || []).find(l => l.location_id === parseInt(trf.destination_location_id, 10));
        const qty = parseFloat(itm.quantity || 0);

        if (srcLoc) srcLoc.quantity = Math.max(0, parseFloat(srcLoc.quantity || 0) - qty);
        if (destLoc) {
          destLoc.quantity = parseFloat(destLoc.quantity || 0) + qty;
        } else {
          prod.locations.push({
            location_id: parseInt(trf.destination_location_id, 10),
            location_name: trf.destination_location_name,
            warehouse_name: 'Warehouse',
            quantity: qty
          });
        }

        db.ledger.unshift({
          id: Date.now() + Math.random(),
          timestamp: new Date().toISOString(),
          product_id: prod.id,
          product_name: prod.name,
          sku: prod.sku,
          unit_of_measure: prod.unit_of_measure,
          operation_type: 'TRANSFER_IN',
          source_location_name: trf.source_location_name,
          destination_location_name: trf.destination_location_name,
          quantity: qty,
          previous_stock: srcLoc ? srcLoc.quantity + qty : qty,
          new_stock: srcLoc ? srcLoc.quantity : 0,
          user_name: 'Alex Rivera (Manager)'
        });
      }
    });

    trf.status = 'done';
    trf.validated_at = new Date().toISOString();
    saveDb(db);
    return { success: true, data: trf, message: 'Transfer executed. Total inventory unchanged!' };
  }

  // ADJUSTMENTS
  if (pathname === '/adjustments') {
    if (method === 'GET') return { success: true, data: db.adjustments };
    if (method === 'POST') {
      const prod = db.products.find(p => p.id === parseInt(body.product_id, 10));
      const loc = db.locations.find(l => l.id === parseInt(body.location_id, 10));
      const counted = parseFloat(body.counted_quantity || 0);
      const system = parseFloat(body.system_quantity || 0);
      const diff = counted - system;

      const newAdj = {
        id: Date.now(),
        reference_no: `ADJ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        product_id: body.product_id,
        product_name: prod ? prod.name : 'Item',
        sku: prod ? prod.sku : 'SKU',
        location_id: body.location_id,
        location_name: loc ? loc.name : 'Storage Bay',
        system_quantity: system,
        counted_quantity: counted,
        difference: diff,
        reason: body.reason || 'Cycle count physical audit',
        status: 'done',
        created_at: new Date().toISOString(),
        created_by_name: 'Alex Rivera (Manager)'
      };

      if (prod) {
        let locRow = (prod.locations || []).find(l => l.location_id === parseInt(body.location_id, 10));
        if (locRow) {
          locRow.quantity = counted;
        } else {
          prod.locations.push({
            location_id: parseInt(body.location_id, 10),
            location_name: loc ? loc.name : 'Bay',
            warehouse_name: loc ? loc.warehouse_name : 'Warehouse',
            quantity: counted
          });
        }

        db.ledger.unshift({
          id: Date.now() + Math.random(),
          timestamp: new Date().toISOString(),
          product_id: prod.id,
          product_name: prod.name,
          sku: prod.sku,
          unit_of_measure: prod.unit_of_measure,
          operation_type: 'ADJUSTMENT',
          source_location_name: loc ? loc.name : null,
          destination_location_name: loc ? loc.name : null,
          quantity: Math.abs(diff),
          previous_stock: system,
          new_stock: counted,
          user_name: 'Alex Rivera (Manager)'
        });
      }

      db.adjustments.unshift(newAdj);
      saveDb(db);
      return { success: true, data: newAdj, message: 'Stock adjusted and ledger recorded successfully' };
    }
  }

  // LEDGER
  if (pathname === '/ledger') {
    const search = (searchParams.get('search') || '').toLowerCase();
    const type = searchParams.get('operation_type');
    let list = db.ledger;
    if (type && type !== 'ALL') list = list.filter(l => l.operation_type === type);
    if (search) list = list.filter(l => l.product_name.toLowerCase().includes(search) || l.sku.toLowerCase().includes(search));
    return { success: true, data: list };
  }

  // META / CATEGORIES / SUPPLIERS / CUSTOMERS
  if (pathname === '/categories') return { success: true, data: db.categories };
  if (pathname === '/suppliers') return { success: true, data: db.suppliers };
  if (pathname === '/customers') return { success: true, data: db.customers };

  return { success: true, data: null };
}

export default { handleMockRequest };
