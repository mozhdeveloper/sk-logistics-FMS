"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClientStore } from "@/lib/store";
import { toast } from "sonner";

const INDUSTRIES = [
  "Manufacturing", "Retail", "Food & Beverage", "Construction", "Healthcare",
  "Automotive", "Technology", "Logistics", "Agriculture", "Real Estate", "Other",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCustomerModal({ open, onOpenChange }: Props) {
  const addClient = useClientStore((s) => s.addClient);

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("Manufacturing");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const reset = () => {
    setName(""); setIndustry("Manufacturing"); setContactPerson("");
    setEmail(""); setPhone(""); setAddress("");
  };

  const handleSave = () => {
    if (!name.trim()) return toast.error("Company name is required.");
    if (!contactPerson.trim()) return toast.error("Contact person is required.");
    if (!email.trim() || !email.includes("@")) return toast.error("A valid email is required.");
    if (!phone.trim()) return toast.error("Phone number is required.");

    addClient({ name, industry, contactPerson, email, phone, address });
    toast.success(`Customer "${name}" added successfully.`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-1.5 col-span-2">
            <label className="text-xs font-semibold text-gray-600">Company Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ABC Corporation"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">Contact Person</label>
            <Input
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Full name"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@company.com"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600">Phone</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+63 9XX XXX XXXX"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5 col-span-2">
            <label className="text-xs font-semibold text-gray-600">Billing Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              placeholder="Full billing address..."
              className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}>Cancel</Button>
          <Button onClick={handleSave}>Add Customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
