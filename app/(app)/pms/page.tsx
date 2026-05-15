"use client";
import { useMemo, useState } from "react";
import { Wrench, AlertTriangle, Clock, CheckCircle2, Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { useMaintenanceStore, useFleetStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { toast } from "sonner";
import type { MaintenanceStatus } from "@/lib/types";

const STATUS_VARIANT: Record<string, any> = { overdue: "danger", due_soon: "warning", upcoming: "info", completed: "success" };

export default function PmsPage() {
  const records = useMaintenanceStore((s) => s.records);
  const updateRecord = useMaintenanceStore((s) => s.updateRecord);
  const addRecord = useMaintenanceStore((s) => s.addRecord);
  const vehicles = useFleetStore((s) => s.vehicles);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Add Schedule form state
  const [schedVehicleId, setSchedVehicleId] = useState(vehicles[0]?.id || "");
  const [schedType, setSchedType] = useState("");
  const [schedDueDate, setSchedDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]);
  const [schedOdometer, setSchedOdometer] = useState("");
  const [schedCost, setSchedCost] = useState("");
  const [schedNotes, setSchedNotes] = useState("");

  const SERVICE_TYPES = ["Oil Change", "Tire Replacement", "Battery Check", "Brake Service", "Air Filter", "Transmission Service", "Engine Tune-Up", "Coolant Flush", "Belt Replacement", "PMS Inspection"];

  const handleAddSchedule = () => {
    if (!schedVehicleId) return toast.error("Select a vehicle.");
    if (!schedType.trim()) return toast.error("Service type is required.");
    if (!schedDueDate) return toast.error("Due date is required.");
    addRecord({
      vehicleId: schedVehicleId,
      type: schedType,
      dueDate: schedDueDate,
      dueOdometer: schedOdometer ? parseInt(schedOdometer) : undefined,
      cost: schedCost ? parseFloat(schedCost) : undefined,
      status: "upcoming" as MaintenanceStatus,
      notes: schedNotes || undefined,
    });
    toast.success("Maintenance schedule added.");
    setSchedType(""); setSchedOdometer(""); setSchedCost(""); setSchedNotes("");
    setAddModalOpen(false);
  };

  const filtered = useMemo(() => records.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search) {
      const v = vehicles.find((x) => x.id === r.vehicleId);
      if (!`${v?.plate} ${r.type}`.toLowerCase().includes(search.toLowerCase())) return false;
    }
    return true;
  }), [records, vehicles, search, statusFilter]);

  const counts = {
    overdue: records.filter((r) => r.status === "overdue").length,
    due_soon: records.filter((r) => r.status === "due_soon").length,
    upcoming: records.filter((r) => r.status === "upcoming").length,
    completed: records.filter((r) => r.status === "completed").length,
  };

  const markComplete = (id: string) => {
    updateRecord(id, { status: "completed", completedAt: new Date().toISOString() });
    toast.success("Marked as completed");
  };

  return (
    <div className="space-y-6">
      {/* Add Schedule Dialog */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Maintenance Schedule</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-gray-600">Vehicle</label>
              <select value={schedVehicleId} onChange={(e) => setSchedVehicleId(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red">
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.plate} — {v.brand} {v.model}</option>)}
              </select>
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold text-gray-600">Service Type</label>
              <select value={schedType} onChange={(e) => setSchedType(e.target.value)}
                className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red">
                <option value="">— Select service —</option>
                {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">Due Date</label>
              <Input type="date" value={schedDueDate} onChange={(e) => setSchedDueDate(e.target.value)} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">Due Odometer (km) <span className="font-normal text-gray-400">(optional)</span></label>
              <Input type="number" min="0" value={schedOdometer} onChange={(e) => setSchedOdometer(e.target.value)} placeholder="e.g. 150000" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">Estimated Cost (₱) <span className="font-normal text-gray-400">(optional)</span></label>
              <Input type="number" min="0" step="0.01" value={schedCost} onChange={(e) => setSchedCost(e.target.value)} placeholder="0.00" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">Notes <span className="font-normal text-gray-400">(optional)</span></label>
              <Input value={schedNotes} onChange={(e) => setSchedNotes(e.target.value)} placeholder="Additional notes..." className="h-9" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSchedule}>Add Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PageHeader
        title="Preventive Maintenance"
        subtitle="Track service schedules, repairs, and overdue alerts"
        breadcrumbs={[{ label: "Operations" }, { label: "PMS" }]}
        actions={<Button size="sm" onClick={() => setAddModalOpen(true)}><Plus className="w-4 h-4" /> Add Schedule</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        <KpiCard label="Overdue" value={counts.overdue} icon={AlertTriangle} iconColor="text-red-600" iconBg="bg-red-50" sparklineColor="#EF4444" sparklineData={[1,2,2,3,3,3,3,3]} />
        <KpiCard label="Due Soon" value={counts.due_soon} icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50" sparklineColor="#F59E0B" sparklineData={[2,2,3,3,4,4,4,4]} />
        <KpiCard label="Upcoming" value={counts.upcoming} icon={Wrench} iconColor="text-sky-600" iconBg="bg-sky-50" sparklineColor="#0EA5E9" sparklineData={[5,6,6,7,7,7,7,7]} />
        <KpiCard label="Completed" value={counts.completed} icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-emerald-50" sparklineColor="#10B981" sparklineData={[10,12,15,18,20,22,25,28]} />
      </div>

      <Card><CardContent className="p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.keys(STATUS_VARIANT).map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </CardContent></Card>

      <Card><CardContent className="p-0">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs uppercase text-muted-foreground border-b border-brand-border bg-gray-50/50">
            <th className="py-3 px-4 font-medium">Vehicle</th>
            <th className="py-3 px-4 font-medium">Service Type</th>
            <th className="py-3 px-4 font-medium">Due Date</th>
            <th className="py-3 px-4 font-medium">Due Odometer</th>
            <th className="py-3 px-4 font-medium">Cost</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium w-32"></th>
          </tr></thead>
          <tbody>
            {filtered.map((r) => {
              const v = vehicles.find((x) => x.id === r.vehicleId);
              return (
                <tr key={r.id} className="border-b border-brand-border/60 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{v?.plate || r.vehicleId}</td>
                  <td className="py-3 px-4">{r.type}</td>
                  <td className="py-3 px-4 text-muted-foreground">{new Date(r.dueDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-muted-foreground">{r.dueOdometer?.toLocaleString() || "—"}</td>
                  <td className="py-3 px-4">{r.cost ? formatCurrency(r.cost) : "—"}</td>
                  <td className="py-3 px-4"><Badge variant={STATUS_VARIANT[r.status]}>{r.status.replace("_", " ")}</Badge></td>
                  <td className="py-3 px-4">{r.status !== "completed" && <Button size="sm" variant="outline" onClick={() => markComplete(r.id)}>Complete</Button>}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">No records.</td></tr>}
          </tbody>
        </table>
      </CardContent></Card>
    </div>
  );
}

