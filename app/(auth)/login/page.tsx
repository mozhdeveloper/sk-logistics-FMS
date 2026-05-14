"use client";
import { useRouter } from "next/navigation";
import {
  Shield,
  Building2,
  Headphones,
  Truck as TruckIcon,
  Calculator,
  Users as UsersIcon,
  Mail,
  Lock,
  ArrowRight,
  Zap,
  MapPin,
  BarChart3,
  PackageCheck,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store/auth";
import { DEFAULT_LANDING } from "@/lib/auth/roles";
import { Logo } from "@/components/Brand/Logo";
import type { Role } from "@/lib/types";
import { toast } from "sonner";

// ─── Role configuration ──────────────────────────────────────────────────────

interface RoleCard {
  role: Role;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  email: string;
  password: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROLE_CARDS: RoleCard[] = [
  {
    role: "super_admin",
    number: 1,
    title: "SUPER ADMIN",
    subtitle: "Full system access",
    description: "Complete access to all companies, settings, users, reports and system management.",
    email: "admin@sklogistics.demo",
    password: "Admin123!",
    icon: Shield,
  },
  {
    role: "company_admin",
    number: 2,
    title: "COMPANY ADMIN",
    subtitle: "Company management",
    description: "Manage fleet, drivers, trips, maintenance, expenses, payroll and reports.",
    email: "operations@sklogistics.demo",
    password: "Ops123!",
    icon: Building2,
  },
  {
    role: "dispatcher",
    number: 3,
    title: "DISPATCHER",
    subtitle: "Trip & dispatch management",
    description: "Create trips, assign drivers and vehicles, monitor deliveries and track in real-time.",
    email: "dispatcher@sklogistics.demo",
    password: "Dispatch123!",
    icon: Headphones,
  },
  {
    role: "driver",
    number: 4,
    title: "DRIVER",
    subtitle: "Driver mobile access",
    description: "View assigned trips, update status, upload proof of delivery and manage expenses.",
    email: "driver.mark@sklogistics.demo",
    password: "Driver123!",
    icon: TruckIcon,
  },
  {
    role: "accounting",
    number: 5,
    title: "ACCOUNTING / HR",
    subtitle: "Payroll & financial management",
    description: "Manage payroll, attendance, expenses, deductions and financial reports.",
    email: "finance@sklogistics.demo",
    password: "Finance123!",
    icon: Calculator,
  },
  {
    role: "client",
    number: 6,
    title: "CLIENT PORTAL",
    subtitle: "Client shipment visibility",
    description: "Track deliveries, view proof of delivery, invoices and shipment history.",
    email: "client@abcconstruction.demo",
    password: "Client123!",
    icon: UsersIcon,
  },
];

const PLATFORM_FEATURES = [
  { icon: TruckIcon,    label: "Fleet & Vehicle Management" },
  { icon: MapPin,       label: "Live GPS Tracking" },
  { icon: PackageCheck, label: "Proof of Delivery" },
  { icon: BarChart3,    label: "Reports & Analytics" },
  { icon: Calculator,   label: "Payroll & HR" },
  { icon: Zap,          label: "AI-Powered Insights" },
];

const PLATFORM_STATS = [
  { value: "10+", label: "Vehicles" },
  { value: "20+", label: "Trips" },
  { value: "6",   label: "Roles" },
  { value: "18+", label: "Modules" },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const loginAsRole = useAuthStore((s) => s.loginAsRole);

  const handleLogin = (role: Role, label: string) => {
    const u = loginAsRole(role);
    if (u) {
      toast.success(`Welcome, ${u.name}!`, { description: `Signed in as ${label}.` });
      router.push(DEFAULT_LANDING[role]);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* ── LEFT BRAND PANEL ─────────────────────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-[400px] xl:w-[460px] shrink-0 flex-col fixed inset-y-0 left-0 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #D31A21 0%, #8B0D10 55%, #6A0B0B 100%)" }}>

        {/* Decorative background geometry */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute top-1/3 -left-16 w-56 h-56 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-black/10" />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Diagonal stripe accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20" />
        </div>

        <div className="relative flex flex-col h-full px-10 py-10">

          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Logo size={52} showWordmark={false} light />
            <div className="mt-4">
              <div className="text-white text-[11px] font-semibold uppercase tracking-[0.22em] opacity-70">
                Enterprise Logistics Platform
              </div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-10"
          >
            <h1 className="font-display font-black text-white text-4xl xl:text-5xl leading-[1.1] tracking-tight">
              Fleet.<br />Dispatch.<br />
              <span className="opacity-70">Delivered.</span>
            </h1>
            <p className="mt-4 text-white/75 text-sm leading-relaxed max-w-xs">
              SK Logistics Services — your all-in-one operations command center for fleet management, driver payroll, and real-time delivery tracking.
            </p>
          </motion.div>

          {/* Divider */}
          <div className="my-8 h-px bg-white/15" />

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {PLATFORM_FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.07 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-white/85 font-medium">{f.label}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-white/40 ml-auto shrink-0" />
              </motion.div>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-auto"
          >
            <div className="rounded-2xl bg-black/20 backdrop-blur-sm p-5 grid grid-cols-4 gap-2 text-center">
              {PLATFORM_STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display font-black text-white text-xl">{s.value}</div>
                  <div className="text-white/55 text-[10px] uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-white/35 text-[10px] text-center mt-5 uppercase tracking-widest">
              SK Logistics Services · Demo v1.0
            </p>
          </motion.div>
        </div>
      </aside>

      {/* ── RIGHT CONTENT PANEL ───────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-[400px] xl:ml-[460px] min-h-screen bg-brand-offwhite overflow-y-auto">

        {/* Subtle dot background */}
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle, #DEE2E6 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 py-10">

          {/* Mobile logo (only shows when left panel is hidden) */}
          <div className="flex lg:hidden justify-center mb-8">
            <Logo size={48} />
          </div>

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
              Demo Environment
            </div>
            <h2 className="font-display font-black text-brand-charcoal text-3xl md:text-4xl tracking-tight">
              Select Your <span className="text-brand-red">Role</span>
            </h2>
            <p className="text-brand-charcoal/60 mt-2 text-sm">
              Choose a demo account to explore the full SK Logistics platform with live data.
            </p>
          </motion.div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {ROLE_CARDS.map((c, i) => (
              <motion.div
                key={c.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="group bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover hover:border-brand-red/25 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Card top accent bar */}
                <div className="h-1 w-full bg-brand-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-5 flex flex-col flex-1">
                  {/* Icon + role badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-red-light ring-1 ring-brand-red/20 flex items-center justify-center group-hover:bg-brand-red group-hover:ring-brand-red transition-colors duration-200">
                      <c.icon className="w-5 h-5 text-brand-red group-hover:text-white transition-colors duration-200" />
                    </div>
                    <span className="text-[10px] font-bold text-brand-charcoal/40 bg-brand-offwhite border border-brand-border rounded-full px-2 py-0.5 uppercase tracking-wider">
                      #{c.number}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="font-display font-black text-brand-charcoal text-sm uppercase tracking-wide leading-tight">
                    {c.title}
                  </div>
                  <div className="text-xs text-brand-red font-semibold mt-0.5 mb-2">{c.subtitle}</div>
                  <p className="text-xs text-brand-charcoal/55 leading-relaxed flex-1 mb-4">{c.description}</p>

                  {/* Credentials */}
                  <div className="rounded-xl bg-brand-offwhite border border-brand-border p-3.5 mb-4 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-brand-charcoal/40 shrink-0" />
                      <span className="text-[11px] text-brand-charcoal/75 font-mono truncate">{c.email}</span>
                    </div>
                    <div className="h-px bg-brand-border" />
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3 text-brand-charcoal/40 shrink-0" />
                      <span className="text-[11px] text-brand-charcoal/75 font-mono">{c.password}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleLogin(c.role, c.title)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white font-display uppercase tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-brand-red/25 active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #D31A21 0%, #6A0B0B 100%)" }}
                  >
                    Enter as {c.title.split(" / ")[0].split(" ").map((w) => w[0] + w.slice(1).toLowerCase()).join(" ")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Access Strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-white rounded-2xl border border-brand-border shadow-card p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-brand-red/10 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-brand-red" />
              </div>
              <div>
                <span className="text-sm font-bold text-brand-charcoal">Quick Access</span>
                <span className="text-xs text-brand-charcoal/50 ml-2">— click any role to log in instantly</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {ROLE_CARDS.map((c) => (
                <button
                  key={c.role}
                  onClick={() => handleLogin(c.role, c.title)}
                  className="group flex flex-col items-center gap-1.5 rounded-xl border border-brand-border bg-brand-offwhite hover:bg-brand-red-light hover:border-brand-red/30 px-2 py-3 transition-all text-center"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-brand-border group-hover:bg-brand-red group-hover:border-brand-red flex items-center justify-center transition-all">
                    <c.icon className="w-4 h-4 text-brand-charcoal/50 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-charcoal/70 group-hover:text-brand-red uppercase tracking-wide leading-tight transition-colors">
                    {c.title.split(" / ")[0].split(" ").slice(0, 2).join(" ")}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <p className="text-center text-[11px] text-brand-charcoal/35 mt-8 pb-4">
            SK Logistics Services · Enterprise Fleet Management Platform · Demo v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
