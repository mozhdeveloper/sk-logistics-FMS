# AI_CONTEXT.md — SK Logistics Services

> **For AI Assistants:** This file provides complete context about this codebase. Read it fully before making any suggestions or modifications.

---

## 1. Platform Origin

This project is a **white-label fork** of the **NexLogistics MVP platform**, originally built by **NexVision Innovations** as a reusable enterprise logistics SaaS foundation.

- **Parent platform:** NexLogistics (by NexVision Innovations)
- **This instance:** SK Logistics Services
- **Fork type:** Full white-label rebrand — all NexVision/NEX branding has been replaced with SK Logistics branding
- **Do NOT reintroduce:** any "Nex", "NEX", "NexVision", "NexLogistics", or "nex-" strings anywhere in code, UI text, or data
- **Git:** Initialized. Main branch is `master`. Do not push to remote unless explicitly instructed.

---

## 2. What This Platform Is

NexLogistics (and by extension, SK Logistics Services) is an **enterprise-grade logistics and fleet management SaaS MVP** built to feel like:

- Uber Freight
- Samsara
- Motive / KeepTruckin
- Fleetio
- SAP Transportation Management
- Oracle Logistics Cloud

**It must never look like:** a student project, a generic admin template, or a low-quality CRUD system.

**It must feel:** premium, modern, sleek, corporate, operationally realistic, and presentation-ready for enterprise clients and investors.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router (TypeScript strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Icons | Lucide React |
| Charts | Recharts |
| Animation | Framer Motion |
| State | Zustand + persist (localStorage, prefix `skl-*`) |
| Fonts | Roboto (body), Montserrat (display/headings), Inter (fallback) |
| Backend (planned) | Supabase (PostgreSQL + Auth + Storage) |
| Maps (planned) | Mapbox or Google Maps API |
| Deployment (planned) | Vercel (frontend) + Supabase (backend) |

**Current MVP state:** All data is local/demo (Zustand + seeded static data). No live database or API connection yet. Supabase integration is a future phase.

---

## 4. Application Architecture

```
app/
  (auth)/           # Login page — role-based demo account selector
  (app)/            # All authenticated routes (protected layout)
    dashboard/      # Main KPI dashboard
    fleet/          # Fleet management CRUD
    drivers/        # Driver management CRUD
    trips/          # Trip & dispatch management
    gps-tracking/   # Simulated live GPS map
    maintenance/    # PMS / preventive maintenance
    expenses/       # Fuel & expense tracking
    payroll/        # Payroll computation module
    proof-of-delivery/ # POD upload + signature
    reports/        # Reports & analytics
    ai-insights/    # AI insight cards (demo/preview)
    attendance/     # Demo preview module
    client-portal/  # Demo preview module
    billing/        # Demo preview module
    warehouse/      # Demo preview module
    route-optimization/ # Demo preview module
    settings/       # System settings
components/
  Brand/            # Logo component (uses /public/logo.jpg)
  layout/           # Sidebar, TopNavbar, shared layout
  ui/               # shadcn/ui primitives
lib/
  store/            # Zustand stores (all keys prefixed skl-*)
  data/             # Seeded demo data (vehicles, drivers, users, etc.)
public/
  logo.jpg          # SK Logistics Services logo (red SK + truck silhouette)
  favicon.svg       # SK brand favicon
```

---

## 5. User Roles

| Role | Slug | Access |
|---|---|---|
| Super Admin | `super_admin` | Everything |
| Company Admin | `company_admin` | Company, users, vehicles, drivers, payroll, reports |
| Dispatcher | `dispatcher` | Trips, dispatching, assignments, statuses |
| Driver | `driver` | Assigned trips, status updates, POD upload |
| Accounting/HR | `accounting` | Payroll, attendance, expenses, salary records |
| Client/Customer | `client` | Track deliveries, view invoices, download POD |

Demo login accounts: all use `@sklogistics.demo` email domain. Password is `password` for all demo accounts.

---

## 6. Core Modules

### Functional (fully built)
- **Dashboard** — Animated KPI cards (vehicles, trips, fuel cost, payroll, revenue), charts, activity feed
- **Fleet Management** — CRUD (add/edit/archive vehicles, assign drivers, upload documents, vehicle profile pages)
- **Driver Management** — CRUD (driver profiles, license tracking, performance, payroll summary)
- **Trip & Dispatch** — Kanban board, trip creation, status pipeline, activity timeline, trip detail pages
- **PMS / Maintenance** — Maintenance schedules, mileage reminders, overdue alerts, repair logs
- **Fuel & Expenses** — Fuel entries, repair/toll/cash advance expenses, per-vehicle reports
- **Payroll** — Salary computation, incentives, overtime, deductions, payslip preview (Draft/Approved/Paid)
- **Proof of Delivery** — Photo upload, signature pad, receiver details, GPS timestamp
- **Reports & Analytics** — Trip, vehicle, driver performance, fuel, maintenance, payroll, delivery performance reports

### Demo Preview (beautiful placeholder pages)
- **AI Insights** — Futuristic insight cards (uses "SK AI Engine" branding)
- **Attendance** — Preview module
- **Client Portal** — Preview module
- **Billing & Invoices** — Preview module
- **Warehouse** — Preview module
- **Route Optimization** — Preview module

---

## 7. Demo Data

All demo data is in `lib/data/`. It is seeded with SK Logistics branding:

**Vehicles:** `SKL-101` through `SKL-110` (Trucks, Vans, Reefer Van, Wing Van, Motorcycle, Trailer, Pickup)

**Drivers:** Mark Santos, John Cruz, Allan Reyes, Carlo Mendoza, Ryan Garcia, Joseph Tan, Miguel Dela Cruz, Ronnie Bautista, Edwin Ramos, Paolo Lim

**Clients:** ABC Construction, Manila Fresh Foods, Northline Distribution, QuickMart Retail, Prime Medical Supply, Pampanga Builders Depot

**Users (demo login):**
- `admin@sklogistics.demo` — Super Admin
- `operations@sklogistics.demo` — Company Admin
- `dispatcher@sklogistics.demo` — Dispatcher
- `driver.mark@sklogistics.demo` — Driver
- `finance@sklogistics.demo` — Accounting/HR

**Trips:** 20+ trips with mixed statuses (Scheduled, In Transit, Delivered, Delayed, Completed, Cancelled)

---

## 8. State Management

Zustand stores in `lib/store/`. All localStorage keys are prefixed `skl-*` to avoid conflicts if multiple client deployments run in the same browser.

Key stores:
- `skl-fleet` — vehicles
- `skl-drivers` — drivers
- `skl-trips` — trips
- `skl-payroll` — payroll records
- `skl-expenses` — fuel & expenses
- `skl-maintenance` — PMS records
- `skl-ui` — UI state (sidebar collapse, dark mode, etc.)

---

## 9. GPS Tracking

Currently simulated (no real GPS hardware). Architecture supports future integration with:
- Traccar
- Teltonika
- Any third-party GPS/telematics API

Vehicle marker legend:
- 🟢 Green = Active / In Transit
- 🟡 Yellow = Idle
- 🔴 Red = Delayed
- ⚫ Gray = Offline

---

## 10. Design System Principles

- **Spacing:** Clean, generous. No cluttered layouts.
- **Cards:** Soft shadows, hover elevation, KPI widgets with sparklines and trend indicators.
- **Tables:** Elegant with status badges, hover rows, pagination.
- **Animations:** Framer Motion — subtle transitions, loading skeletons, animated chart entries. No excessive motion.
- **Shadows:** Soft and layered (not harsh). Use `glow` shadow for brand-colored elements.
- **Glassmorphism:** Light use on overlays and modals.
- **Badges:** Color-coded status badges (custom Tailwind variants).
- **Dark Mode:** Supported via Zustand `skl-ui` store + Tailwind dark class strategy.

---

## 11. SK Logistics Branding

> Source: `sklogisticsbranding.md` (NexVision Innovations design spec)

### Brand Personality
Premium · Corporate · Reliable · Speed-focused · Clean · Logistics-tech

### Logo
- File: `public/logo.jpg`
- Design: Bold red gradient "SK" letters integrated with a truck silhouette, "LOGISTICS SERVICES" wordmark beneath
- Component: `components/Brand/Logo.tsx` (accepts `size`, `showWordmark`, `light`, `wordmarkSize` props)
- Usage: Sidebar header (collapsed = icon only, expanded = icon + wordmark), Login page header

### Color Palette

| Token | Color | Hex | Usage |
|---|---|---|---|
| `brand-red` | Velocity Red | `#D31A21` | Primary CTA, active states, accents |
| `brand-red-dark` | Engine Burgundy | `#A8141A` | Hover states, gradient end |
| `brand-red-light` | Light Red Tint | `#FBE5E6` | Backgrounds, highlights |
| `brand-burgundy` | Engine Burgundy | `#6A0B0B` | Footer, deep accent, gradient end |
| `brand-charcoal` | Charcoal | `#212529` | Primary text, dark backgrounds |
| `brand-white` | White | `#FFFFFF` | Primary background |
| `brand-offwhite` | Glacial Gray | `#F8F9FA` | Secondary background, alternating sections |
| `brand-border` | Border Gray | `#DEE2E6` | Dividers, subtle borders |

**Backward-compat aliases** (so existing shadcn/ui components using `brand-teal`/`brand-navy` auto-render in SK colors):
- `brand-teal` → `#D31A21` (maps to red)
- `brand-teal-dark` → `#A8141A`
- `brand-navy` → `#212529` (maps to charcoal)

### Gradient
```css
background-image: linear-gradient(135deg, #D31A21 0%, #6A0B0B 100%);
/* Tailwind: bg-brand-gradient */
```

### Typography
| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / Headings | Montserrat | Black Italic / Bold | Uppercase for high-impact headings |
| Body / UI | Roboto | Regular / Medium | Tracking interfaces, tables, labels |
| Fallback | Inter | Regular | System fallback |

### UI Component Rules
- **Buttons (Primary):** Gradient left-to-right `#D31A21 → #6A0B0B`, white Montserrat Bold uppercase text, rounded corners (`rounded-md` / `rounded-lg`)
- **Navigation:** Sticky sidebar dark background (charcoal/near-black), red active indicator glow
- **Section Backgrounds:** Alternate between `#FFFFFF` and `#F8F9FA`
- **Footer:** Solid `#6A0B0B` (burgundy) background, white text
- **Shadows:** Soft, layered. Glow shadow: `rgba(211, 26, 33, 0.3)` for brand-colored elements

---

## 12. Development Rules for AI

1. **Never add** `Nex`, `NEX`, `NexVision`, `NexLogistics`, or `nex-` anywhere.
2. **Brand colors** — always use the `brand-*` Tailwind tokens defined in `tailwind.config.ts`. Do not hardcode hex values.
3. **Fonts** — use `font-display` (Montserrat) for headings, `font-sans` (Roboto) for body.
4. **Logo** — always use the `<Logo>` component from `components/Brand/Logo.tsx`, never inline brand name text.
5. **localStorage keys** — always prefix with `skl-`.
6. **Demo data emails** — always use `@sklogistics.demo` domain.
7. **Vehicle plates** — always use `SKL-XXX` format.
8. **Git** — do not push. Do not force-push. Commit with descriptive messages.
9. **Supabase** — not yet connected. Keep all data in Zustand stores until integration is explicitly requested.
10. **Build** — run `npm run build` after significant changes to verify 0 TypeScript errors.
