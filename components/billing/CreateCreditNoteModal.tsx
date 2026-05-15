"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreditNoteStore, useClientStore, useInvoiceStore } from "@/lib/store";
import { toast } from "sonner";
import type { CreditNoteStatus } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCreditNoteModal({ open, onOpenChange }: Props) {
  const addCreditNote = useCreditNoteStore((s) => s.addCreditNote);
  const clients = useClientStore((s) => s.clients);
  const invoices = useInvoiceStore((s) => s.invoices);

  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [invoiceId, setInvoiceId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<CreditNoteStatus>("draft");

  const clientInvoices = invoices.filter((i) => i.clientId === clientId);

  const handleSave = () => {
    if (!clientId) return toast.error("Please select a client.");
    if (!reason.trim()) return toast.error("Please enter a reason for the credit.");
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return toast.error("Please enter a valid amount.");

    const creditNoteNumber = `CN-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;

    addCreditNote({
      creditNoteNumber,
      clientId,
      invoiceId: invoiceId || undefined,
      date,
      reason,
      items: [{ description: reason, quantity: 1, unitPrice: amt, amount: amt }],
      amount: amt,
      status,
    });

    toast.success(`Credit note ${creditNoteNumber} created.`);
    setReason("");
    setAmount("");
    setInvoiceId("");
    setStatus("draft");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Credit Note</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-1.5 col-span-2">
            <label className="text-xs font-semibold text-gray-600">Customer</label>
            <select
              value={clientId}
              onChange={(e) => { setClientId(e.target.value); setInvoiceId(""); }}
              className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#008A56]"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 col-span-2">
            <label className="text-xs font-semibold text-gray-600">
              Related Invoice <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <select
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#008A56]"
            >
              <option value="">— None —</option>
              {clientInvoices.map((i) => (
                <option key={i.id} value={i.id}>{i.invoiceNumber} ({i.status})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CreditNoteStatus)}
              className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#008A56]"
            >
              <option value="draft">Draft</option>
              <option value="applied">Applied</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="space-y-1.5 col-span-2">
            <label className="text-xs font-semibold text-gray-600">Reason for Credit</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="e.g. Damaged goods, overbilling, service shortfall..."
              className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#008A56]"
            />
          </div>

          <div className="space-y-1.5 col-span-2">
            <label className="text-xs font-semibold text-gray-600">Credit Amount (₱)</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="h-9"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} className="bg-[#008A56] hover:bg-[#007045] text-white">
            Create Credit Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
