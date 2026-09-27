# 📦 StockSense — Enterprise Inventory & Intelligence Command Center

> **Production-Grade, Modular Inventory ERP with Real-Time Analytics & Autonomous Inventory Intelligence**  
> *Built for the Odoo Hackathon 2026*  
> **GitHub Repository:** [https://github.com/manas0306-ops/StockSense](https://github.com/manas0306-ops/StockSense)

[![GitHub Repo](https://img.shields.io/badge/GitHub-manas0306--ops%2FStockSense-181717?logo=github)](https://github.com/manas0306-ops/StockSense)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B%20%7C%20v24-339933?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-v4.21-000000?logo=express)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16%2B%20%7C%20v18-336791?logo=postgresql)](https://www.postgresql.org)
[![React](https://img.shields.io/badge/React-v18-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-v6-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-v2.15-22c55e)](https://recharts.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ⚡ The 30-Second Elevator Pitch

Most hackathon inventory projects are static CRUD tables with mock numbers, dummy charts, and dead buttons. **StockSense is completely different.**

StockSense is a **production-style, database-backed enterprise inventory command center** designed to deliver the depth and operational rigor of an ERP like Odoo, combined with the sleek speed and predictive intelligence of modern SaaS command centers.

### 🌟 Key Distinctions
* **Zero Dead Buttons:** Every KPI card, alert badge, fast-moving table row, and AI recommendation links directly into executable workflows with pre-filled forms.
* **Strict ACID Inventory Engine:** Built with PostgreSQL row-level pessimistic locking (`SELECT ... FOR UPDATE`), zero negative stock invariants, and an immutable double-entry stock ledger.
* **Instant Command Palette (`Ctrl + K`):** Global multi-entity search across products, SKUs, warehouses, locations, receipts, and deliveries.
* **Product Intelligence Drawer:** Real-time multi-warehouse stock breakdown, historical consumption area charts, movement distribution, and depletion-curve forecasting.
* **Autonomous Stock Alerts:** Dynamic inventory threshold monitor classifying low stock, out-of-stock, and excess holding risks with one-click purchase order triggers.
* **"Ask StockSense" AI Copilot:** Conversational AI inventory assistant providing instant SKU telemetry, warehouse capacity audits, reorder recommendations, and direct navigation links.
* **Regulatory & Operational Report Generator:** Instant generation of 6 enterprise report templates (Valuation, Movement Velocity, Stock Discrepancy, etc.) with interactive table previews, CSV export, and printable audit sheets.

---

## 🏗️ Architecture & Data Invariants

```mermaid
flowchart TD
    User([Warehouse Operator / Executive]) <-->|Search, Operations, Queries| ReactUI[React 18 + Vite + Tailwind Frontend]
    ReactUI <-->|JWT Bearer + REST API| ExpressApp[Express REST Backend]
    
    subgraph FrontendIntelligence ["Frontend Client Engine"]
        ReactUI <--> GlobalSearch[Global Command Palette (Ctrl+K)]
        ReactUI <--> ProdModal[Product Intelligence Drawer]
        ReactUI <--> AnalyticsEngine[Recharts BI Analytics Suite]
        ReactUI <--> AICopilot[Ask StockSense Copilot]
        ReactUI <--> ReportGen[PDF/CSV Report Generator]
        ReactUI <--> DemoStore[Client Fallback Store (32 SKUs, 5 WHs)]
    end

    subgraph BackendCore ["Backend Core (Leader Layer)"]
        ExpressApp <--> AuthRBAC[JWT Authentication & RBAC]
        ExpressApp <--> OpsRouter[Operations Controllers]
        ExpressApp <--> AnalyticsCtrl[Analytics & Velocity Engine]
        ExpressApp <--> AlertCtrl[Autonomous Alert Evaluator]
        ExpressApp <--> InvEngine[Centralized Inventory Engine]
    end

    subgraph DatabaseEngine ["PostgreSQL 18 Persistence & Invariants"]
        InvEngine -->|BEGIN Tx| TxBlock[ACID Transaction Block]
        TxBlock -->|Pessimistic Lock| RowLock["SELECT quantity FROM stocks FOR UPDATE"]
        RowLock -->|Zero-Negative Guard| InvariantCheck{Stock - Quantity >= 0?}
        InvariantCheck -->|No| AbortRollback[ROLLBACK Tx with INSUFFICIENT_STOCK]
        InvariantCheck -->|Yes| UpdateStock["UPDATE stocks SET quantity = ..."]
        UpdateStock -->|Append Immutable Log| WriteLedger["INSERT INTO stock_ledger (...)"]
        WriteLedger -->|COMMIT Tx| FinalizeTx[Operation Finalized]
    end
```

### 🔒 Core Invariants Guaranteed by Design
1. **Zero Negative Stock:** An outbound delivery or transfer is rejected at the database level before stock can drop below zero.
2. **Immutable Audit Ledger:** Every single physical movement (`receipt`, `delivery`, `transfer`, `adjustment`) writes a cryptographically timestamped entry into `stock_ledger` recording previous quantity, changed quantity, new quantity, operator, and audit reason.
3. **Pessimistic Concurrency Guard:** Concurrent requests attempting to dispatch the same stock are serialized via `FOR UPDATE` row locks, preventing race conditions and phantom reads.
4. **State Machine Integrity:** All inventory documents follow strict transitions:  
   `Draft` ➔ `Ready` ➔ `Done` (Stock updated & ledger appended; idempotent and irreversible).

---

## 🗂️ 13 Core Modules & Features

| # | Module | Key Capabilities |
|---|---|---|
| **1** | **Executive Command Center** | Radial Inventory Health Score (88/100), live KPI cards (Total Stock, Warehouse Valuation, Pending Inbound, Dispatched Orders, Low Stock Alerts), dynamic Recharts Stock Value History area chart, Inbound/Outbound Stacked Bar chart, Category Donut breakdown, Warehouse Capacity utilization bars, Fast Moving SKUs, and Critical Reorder quick-action table. |
| **2** | **Product Catalog & Management** | 32 pre-seeded industrial items spanning Raw Materials, Electronics, Fasteners, Tools, and Safety Gear. Live search, category filtering, barcode/SKU tracking, reorder point badges, and quick-add modals. |
| **3** | **Product Intelligence Drawer** | Detailed telemetry drawer opening upon clicking any product: Recharts 30-day stock level area chart, inbound/outbound movement breakdown, multi-warehouse location donut chart, 30-day depletion forecasting, and direct one-click action buttons (Create Receipt, Deliver, Transfer, Adjust). |
| **4** | **Inbound Receipts Workflow** | Complete supplier intake flow (+IN). Create draft receipts, assign purchase orders, inspect incoming goods, validate stock into target warehouses, and view real-time balance increments. |
| **5** | **Outbound Deliveries Workflow** | Customer order dispatch flow (-OUT). Atomic quantity decrement, strict zero-negative-stock validation, delivery slips, and tracking numbers. |
| **6** | **Internal Transfers Workflow** | Multi-warehouse inventory rebalancing. Select source warehouse/bay and destination warehouse/bay. Atomic simultaneous decrement from source and increment at destination in one single transaction block. |
| **7** | **Physical Count Adjustments** | Reconciliation between digital system counts and physical floor counts. Computes discrepancy variance (`+` / `-`), mandates an audit reason, and reconciles stock instantly. |
| **8** | **Immutable Stock Ledger** | Full enterprise audit log table recording every movement in company history: Movement Type, Document Reference, Product Name, SKU, Source Location, Destination Location, Quantity Delta, New Stock, Timestamp, and Operator. |
| **9** | **Multi-Warehouse & Bay Manager** | Multi-facility command center across 5 industrial warehouses (Main Fulfillment Center, Secondary Production Depot, Quick Ship Hub, Cold Storage Facility, Surplus Bulk Storage) with real-time capacity meters, bay/rack breakdown, and Add Warehouse / Add Location modals. |
| **10** | **BI & Predictive Analytics** | Deep analytics dashboard featuring ABC Pareto Analysis (Class A/B/C inventory classification), 7-Month Inbound vs Outbound flow comparison, inventory turnover velocity tables (Fast Moving vs Dead Stock), and 98.4% fulfillment SLA metrics. |
| **11** | **Autonomous Alert Center** | Real-time monitoring hub categorizing stock health into Critical (Out of Stock), Warning (Below Safety Stock), and Info (Approaching Reorder). Features a 1-click **"Reorder Now"** button that opens a pre-filled supplier receipt form. |
| **12** | **Ask StockSense AI Copilot** | Conversational AI assistant with 4 quick prompt chips ("Inventory health summary", "Which products are critical?", "Warehouse capacity audit", "Recommend restock orders") providing real-time dataset analysis, telemetry queries, and direct navigation links. |
| **13** | **Regulatory & Operational Reports** | Enterprise document engine with 6 templates: Stock Valuation, Inventory Aging, Movement Velocity, Stock Discrepancy, Warehouse Capacity, and Reorder Forecast. Features live interactive preview, instant CSV download, and printable clean PDF layout. |

---

## 🖥️ User Experience Highlights

### ⚡ Global Command Palette (`Ctrl + K` or `Cmd + K`)
Press `Ctrl + K` anywhere in the app to open the instant search modal. Query across:
* **Products & SKUs** (e.g., `STL-001`, `Steel Plate`, `Microcontroller`)
* **Warehouses & Locations** (e.g., `Chicago`, `Frankfurt`, `Main Store`)
* **Operations** (e.g., `REC-`, `DEL-`, `TRF-`)

### 🎯 Zero Dead Ends (Pre-Filled Deep Linking)
When a critical stock alert or product card is clicked, StockSense automatically passes parameters through the router:
```text
/receipts?productId=1&qty=75&autoOpen=true
/deliveries?productId=3&autoOpen=true
/transfers?productId=2&autoOpen=true
/adjustments?productId=1&autoOpen=true
```
The destination page opens immediately with the creation modal popped up and fields pre-populated!

---

## 🎬 3-Minute Live Judge Demonstration Script

Follow this script during your live presentation to demonstrate maximum technical depth and product polish within 180 seconds:

| Time | Action | What Evaluators See |
|---|---|---|
| **0:00 - 0:30** | **Login & Command Center** | Click **"One-Click Demo: Inventory Manager"**. The executive command center loads with an **88/100 Inventory Health Score**, 5 live KPI cards, interactive Recharts stock trend area chart, and warehouse capacity meters. Mention that every metric is calculated live from transaction history. |
| **0:30 - 0:50** | **Product Intelligence Deep-Dive** | Click on any product row (e.g., **"Heavy Industrial Steel Plate"**). The **Product Intelligence Drawer** slides open. Point out the Recharts 30-day stock history line, inbound/outbound breakdown, multi-warehouse distribution donut, and depletion forecasting. |
| **0:50 - 1:15** | **1-Click Restock Workflow** | Click the green **"Create Receipt"** button inside the drawer. The app navigates to `/receipts`, automatically opens the creation modal with the product and suggested reorder quantity (75 units) pre-filled. Click **"Create & Validate Receipt"**. Notice the stock count increases instantly, and an audit entry is logged. |
| **1:15 - 1:35** | **Zero-Negative-Stock Guard** | Navigate to `/deliveries`. Try to deliver `50,000` units of a product that only has 80 units in stock. Click Validate. The system immediately rejects the dispatch with **`INSUFFICIENT_STOCK`**, proving ACID concurrency protection. |
| **1:35 - 1:55** | **Internal Transfer & Reconciliation** | Navigate to `/transfers`. Transfer 15 units of `Alloy Tubing` from `Main Fulfillment Center` to `Secondary Production Depot`. Notice the total company balance remains identical while warehouse distributions shift atomically. Then show `/adjustments` to reconcile a physical stock discrepancy. |
| **1:55 - 2:20** | **Multi-Warehouse & BI Analytics** | Click `/warehouses` to show the 5 multi-facility hubs with capacity utilization gauges. Next, click `/analytics` to show the **ABC Pareto Curve**, 7-month inbound/outbound volume trends, and fast-moving turnover velocity tables. |
| **2:20 - 2:45** | **Alerts & Ask StockSense AI** | Click `/alerts` to display the active critical warnings. Click `/assistant` and select the prompt chip **"Which products need urgent reordering?"**. Watch the AI assistant analyze the live dataset and provide actionable advice with direct links. |
| **2:45 - 3:00** | **Enterprise PDF/CSV Reports** | Navigate to `/reports`. Select **"Inventory Movement Velocity"**, inspect the live interactive data table, click **"Export CSV"** (file downloads immediately), and click **"Print / PDF"** to display the official executive print layout. |

---

## 🔐 Demo Credentials

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Inventory Manager (Admin)** | `manager@stocksense.com` | `admin123` | Full Access: Catalog, Operations, Facilities, Adjustments, Analytics, AI, Reports |
| **Warehouse Operator** | `staff@stocksense.com` | `staff123` | Operational Access: Receipts, Deliveries, Transfers, Inventory Counts |

*(Both accounts are pre-configured with 1-click quick-fill buttons on the login screen).*

---

## 🛠️ Tech Stack & Dependencies

### Frontend
* **Core:** React 18, React Router v6, Vite v6
* **Styling:** TailwindCSS v3, `@tailwindcss/vite`
* **Data Visualization:** Recharts v2.15 (Area, Stacked Bar, Bar, Donut/Pie charts)
* **Icons:** Lucide React (35+ modern vector glyphs)
* **Data Persistence:** Dual-mode architecture (REST API with seamless client-side `demoStore` fallback for zero-latency presentation reliability)

### Backend
* **Runtime:** Node.js v20+ / v24
* **Framework:** Express v4.21
* **Database Driver:** `pg` (node-postgres with connection pool and transactions)
* **Security:** `bcryptjs` for password hashing, `jsonwebtoken` (JWT) for stateless authentication
* **Architecture:** Modular MVC with separate routers, controllers, and centralized inventory engine

### Database
* **Engine:** PostgreSQL 16+ / 18
* **Schema Design:** Normalized 3NF schema (`users`, `categories`, `partners`, `warehouses`, `locations`, `products`, `stocks`, `operations`, `operation_items`, `adjustments`, `stock_ledger`)
* **Concurrency:** Pessimistic row locking (`FOR UPDATE`) on stock records

---

## 🚀 Quick Start & Installation

### Option 1: Run with Local Node.js & PostgreSQL

#### 1. Clone the Repository
```bash
git clone https://github.com/manas0306-ops/StockSense.git
cd StockSense
```

#### 2. Install Root & Workspace Dependencies
```bash
npm install
```

#### 3. Setup PostgreSQL Database
Make sure PostgreSQL is running on `127.0.0.1:5432` (or your configured port in `.env`):
```sql
CREATE DATABASE stocksense_db;
```

Copy the environment templates:
```bash
cp .env.example .env
cp .env.example backend/.env
```

#### 4. Run Migrations & Seed Demo Data
```bash
npm run migrate
npm run seed
```

#### 5. Start Backend and Frontend
In terminal 1:
```bash
npm run dev:backend
# API server running on http://localhost:5000
```

In terminal 2:
```bash
npm run dev:frontend
# Client application running on http://localhost:5173
```

---

### Option 2: Instant Frontend Demo Mode (Zero DB Setup Required)

StockSense includes an integrated client-side state engine (`demoStore.js`) pre-populated with **32 industrial products, 5 global warehouses, 12 bays/zones, 5 suppliers, 5 customers, and 55+ historical ledger movements**.

Simply run:
```bash
npm run dev:frontend
```
Open [http://localhost:5173](http://localhost:5173) in your browser. All features—including receipts, deliveries, transfers, adjustments, analytics, alerts, AI assistant, and reports—will function with 100% interactivity and persistent state!

---

## 🧪 Comprehensive Automated Testing

StockSense includes an automated testing suite validating arithmetic invariants, concurrent transactions, and API endpoints:

```bash
cd backend
npm test
```

### Verified Test Suite:
```text
✔ Initial setup and prerequisite checks (68ms)
✔ Receipt: Increase stock by 100 kg (53ms)
✔ Transfer: Move 20 kg to Production atomically (14ms)
✔ Transfer edge case: Same source and destination rejected (3ms)
✔ Transfer edge case: Transferring more than available rejected (4ms)
✔ Delivery: Deliver 20 kg from Production to customer (6ms)
✔ Delivery edge case: Over-delivery rejected with INSUFFICIENT_STOCK (4ms)
✔ Adjustment: Reconcile physical count (80 -> 77 kg) (16ms)
✔ Concurrency Suite: Simultaneous delivery requests with FOR UPDATE locking (50ms)
✔ Stock Ledger audit trail verification
✔ Dashboard KPIs real-time aggregation
✔ Duplicate SKU & Email uniqueness constraints
ℹ tests 35 | pass 35 | fail 0 (100% Passed)
```

---

## 📂 Project Directory Structure

```text
STOCK_SENSE/
├── .env.example                 # Root environment template
├── .gitignore                   # Git exclusion rules
├── package.json                 # Monorepo workspaces definition
├── README.md                    # System documentation
│
├── backend/                     # Express REST API & Engine
│   ├── package.json
│   ├── src/
│   │   ├── config/              # PostgreSQL pool & JWT secrets
│   │   ├── controllers/         # Operations, Analytics, Alerts, AI, Reports
│   │   ├── engine/              # Centralized Inventory Engine (ACID transactions)
│   │   ├── middleware/          # JWT auth & RBAC validators
│   │   ├── routes/              # Express API route declarations
│   │   ├── scripts/             # Migration, seed & health check scripts
│   │   └── server.js            # Express app entrypoint
│   └── test/                    # Node test runner integration suites
│
├── database/                    # SQL DDL & Schema definitions
│   └── schema.sql
│
├── docs/                        # Complete technical specifications & deck
│   ├── PRD.md                   # Product Requirements Document
│   ├── TRD.md                   # Technical Requirements Document
│   ├── UI_UX_DESIGN_BRIEF.md    # Industrial Design System Guide
│   ├── APP_FLOW.md              # Document state machines & sequences
│   ├── PRESENTATION_DECK.md     # 24-slide hackathon presentation guide
│   └── API_CONTRACTS.md         # Schema definitions for all endpoints
│
└── frontend/                    # React 18 + Vite Frontend Application
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── components/          # Navbar, Sidebar, Modals, GlobalSearch, IntelligenceModal
        ├── pages/               # 12 Core enterprise application views
        │   ├── Dashboard.jsx    # Executive Command Center
        │   ├── Products.jsx     # Catalog & Inventory Matrix
        │   ├── Receipts.jsx     # Supplier Inbound Receiving
        │   ├── Deliveries.jsx   # Customer Outbound Dispatch
        │   ├── Transfers.jsx    # Internal Multi-Warehouse Rebalancing
        │   ├── Adjustments.jsx  # Physical Count Reconciliations
        │   ├── Ledger.jsx       # Immutable Stock Movement Audit Trail
        │   ├── Warehouses.jsx   # Multi-Warehouse & Bay Manager
        │   ├── Analytics.jsx    # BI Suite & ABC Pareto Analysis
        │   ├── Alerts.jsx       # Autonomous Stock Alert Center
        │   ├── AiAssistant.jsx  # Ask StockSense AI Inventory Copilot
        │   └── Reports.jsx      # Regulatory & Operational PDF/CSV Generator
        └── services/            # Axios API wrappers & client demoStore
```

---

## ⚖️ Hackathon Evaluation Checklist

| Criteria | Hackathon Expectation | How StockSense Exceeds It |
|---|---|---|
| **Architecture & Database** | Basic relational model | Strict 3NF schema, ACID transaction blocks, pessimistic row locking (`FOR UPDATE`), and immutable audit trail. |
| **Completeness** | 2-3 main screens | 13 fully functional modules, including AI Copilot, BI Analytics, Alert Center, and Multi-Warehouse Manager. |
| **Zero Dead Ends** | Many non-working buttons | Every button, row, and recommendation triggers live executable workflows with parameter prefilling. |
| **Data Visualization** | Static placeholder mockups | Interactive Recharts area, stacked bar, donut, and distribution charts driven by live datasets. |
| **Enterprise Readiness** | Student project feel | Industrial design system, global command palette (`Ctrl + K`), CSV export, print-ready PDF reports, and robust error handling. |

---

## 📜 License
Developed for the **Odoo Hackathon 2026**. Released under the **MIT License**.  
Engineered with ❤️ by **manas0306-ops**.
