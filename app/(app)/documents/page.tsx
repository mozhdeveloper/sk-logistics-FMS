"use client";
import { useState, useMemo } from "react";
import {
  FileText, Search, Download, MoreVertical, SlidersHorizontal, Filter,
  Share2, X, Eye, Trash2, HardDrive, ShieldCheck, AlertTriangle, Send, Link2
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { useDocumentStore, type DocumentItem, type ShareAccess } from "@/lib/store/documents";
import { toast } from "sonner";
import Link from "next/link";

export default function AllDocumentsPage() {
  const documents = useDocumentStore(s => s.documents);
  const deleteDocument = useDocumentStore(s => s.deleteDocument);
  const shareDocument = useDocumentStore(s => s.shareDocument);
  const categories = useDocumentStore(s => s.categories);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<DocumentItem | null>(null);

  // Share modal state
  const [shareTarget, setShareTarget] = useState<DocumentItem | null>(null);
  const [shareWith, setShareWith] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [shareAccess, setShareAccess] = useState<ShareAccess>("view");
  const [shareExpiry, setShareExpiry] = useState("");

  const activeDocs = useMemo(() => documents.filter(d => d.status === "active"), [documents]);

  const filtered = useMemo(() => {
    return activeDocs.filter(d => {
      if (typeFilter !== "All Types" && d.type !== typeFilter) return false;
      if (categoryFilter !== "All Categories" && d.category !== categoryFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [activeDocs, search, typeFilter, categoryFilter]);

  const stats = useMemo(() => ({
    totalDocs: activeDocs.length,
    storageUsed: "18.7 GB",
    secureFiles: activeDocs.filter(d => d.accessLevel === "private" || d.accessLevel === "internal").length,
  }), [activeDocs]);

  const selected = selectedId ? activeDocs.find(d => d.id === selectedId) : null;

  const allTypes = ["All Types", ...Array.from(new Set(activeDocs.map(d => d.type)))];
  const allCategories = ["All Categories", ...Array.from(new Set(activeDocs.map(d => d.category)))];

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteDocument(deleteTarget.id);
    toast.success(`"${deleteTarget.name}" moved to Recycle Bin`);
    if (selectedId === deleteTarget.id) setSelectedId(null);
    setDeleteTarget(null);
  };

  const handleShare = () => {
    if (!shareTarget || !shareWith || !shareEmail) {
      toast.error("Please fill in all required fields");
      return;
    }
    shareDocument(shareTarget.id, { sharedWith: shareWith, sharedWithEmail: shareEmail, shareAccess, expiryDate: shareExpiry || undefined });
    toast.success(`"${shareTarget.name}" shared with ${shareWith}`);
    setShareTarget(null);
    setShareWith(""); setShareEmail(""); setShareAccess("view"); setShareExpiry("");
  };

  const openShare = (doc: DocumentItem) => {
    setShareTarget(doc);
    setShareWith(""); setShareEmail(""); setShareAccess("view"); setShareExpiry("");
  };

  return (
    <div className="space-y-6 pb-10" onClick={() => setMenuId(null)}>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0B1220] tracking-tight">All Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and access all your company files in one secure place.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white shadow-sm border-gray-200 h-9 px-3 text-xs font-semibold text-[#0B1220]">
            <Filter className="w-4 h-4 mr-2 text-gray-500" /> Filters
          </Button>
          <Link href="/documents/upload">
            <Button className="bg-[#008A56] hover:bg-[#007045] text-white shadow-sm h-9 px-4 text-xs font-semibold">
              <FileText className="w-4 h-4 mr-1.5" /> Upload Document
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Documents" value={stats.totalDocs} icon={FileText} iconColor="text-blue-500" iconBg="bg-blue-50" trend={12.4} trendLabel="" footerLabel="vs Apr 16 - Apr 30" />
        <KpiCard label="Storage Used" value={stats.storageUsed} icon={HardDrive} iconColor="text-purple-500" iconBg="bg-purple-50" trend={18.7} trendLabel="" footerLabel="of 100 GB" />
        <KpiCard label="Secure Files" value={stats.secureFiles} icon={ShieldCheck} iconColor="text-[#008A56]" iconBg="bg-emerald-50" trend={5.2} trendLabel="" footerLabel="vs Apr 16 - Apr 30" />
      </div>

      <div className={`grid gap-6 ${selected ? "grid-cols-1 xl:grid-cols-[1fr_360px]" : "grid-cols-1"}`}>
        <Card className="border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="p-4 flex items-center justify-between gap-3 flex-wrap border-b border-gray-100">
              <div className="flex items-center gap-2 flex-1 min-w-[300px]">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by document name, category, or owner..." className="pl-9 h-9 text-xs border-gray-200 rounded-lg" />
                </div>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="h-9 px-3 text-xs border border-gray-200 font-medium text-gray-600 rounded-lg focus:outline-none bg-white">
                  {allTypes.map(t => <option key={t}>{t}</option>)}
                </select>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="h-9 px-3 text-xs border border-gray-200 font-medium text-gray-600 rounded-lg focus:outline-none bg-white">
                  {allCategories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="h-9 px-3 text-xs border-gray-200 font-medium text-gray-600 rounded-lg">
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-2" /> More Filters
                </Button>
                <Button variant="outline" className="h-9 px-3 text-xs border-gray-200 font-medium text-[#008A56] rounded-lg">
                  <Download className="w-3.5 h-3.5 mr-2" /> Export
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left font-bold text-gray-700 border-b border-gray-100 bg-white">
                    <th className="py-3 px-5 w-10"><input type="checkbox" className="accent-[#008A56] w-3.5 h-3.5 rounded-sm border-gray-300" /></th>
                    <th className="py-3 px-2">Document Name</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2">Type</th>
                    <th className="py-3 px-2">Size</th>
                    <th className="py-3 px-2">Access</th>
                    <th className="py-3 px-2">Tags</th>
                    <th className="py-3 px-4 text-center w-14">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((d) => (
                    <tr key={d.id}
                      className={`hover:bg-gray-50/50 transition-colors cursor-pointer group ${selectedId === d.id ? "bg-green-50/30" : ""}`}
                      onClick={() => setSelectedId(d.id)}>
                      <td className="py-4 px-5"><input type="checkbox" className="accent-[#008A56] w-3.5 h-3.5 rounded-sm border-gray-300" onClick={(e) => e.stopPropagation()} /></td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded flex items-center justify-center text-[9px] font-bold text-white shrink-0 ${d.type === "PDF" ? "bg-red-500" : d.type === "DOCX" ? "bg-blue-500" : d.type === "XLSX" ? "bg-green-500" : d.type === "ZIP" ? "bg-purple-500" : "bg-amber-500"}`}>
                            {d.type}
                          </div>
                          <span className="font-semibold text-gray-800 truncate max-w-[200px]" title={d.name}>{d.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-600">{d.category}</td>
                      <td className="py-4 px-2 font-medium text-gray-700">{d.type}</td>
                      <td className="py-4 px-2 text-gray-600">{d.sizeMB} MB</td>
                      <td className="py-4 px-2 capitalize">
                        {d.accessLevel === "public" ? <span className="text-emerald-600 font-semibold">Public</span> : d.accessLevel === "private" ? <span className="text-amber-600 font-semibold">Private</span> : <span className="text-gray-600">Internal</span>}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-1 flex-wrap">
                          {d.tags.slice(0, 2).map((t, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-semibold">{t}</span>
                          ))}
                          {d.tags.length > 2 && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-semibold">+{d.tags.length - 2}</span>}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center relative">
                        <button
                          className="w-7 h-7 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 flex items-center justify-center mx-auto"
                          onClick={(e) => { e.stopPropagation(); setMenuId(menuId === d.id ? null : d.id); }}>
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        {menuId === d.id && (
                          <div className="absolute right-4 top-10 z-20 w-40 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50" onClick={() => { setSelectedId(d.id); setMenuId(null); }}>
                              <Eye className="w-3.5 h-3.5 text-gray-400" /> View Details
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50" onClick={() => { openShare(d); setMenuId(null); }}>
                              <Share2 className="w-3.5 h-3.5 text-blue-400" /> Share
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50" onClick={() => { toast.success("Download started"); setMenuId(null); }}>
                              <Download className="w-3.5 h-3.5 text-gray-400" /> Download
                            </button>
                            <div className="border-t border-gray-100" />
                            <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50" onClick={() => { setDeleteTarget(d); setMenuId(null); }}>
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="py-12 text-center text-xs text-gray-400">No documents found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
              <div>Showing {filtered.length} of {activeDocs.length} documents</div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Panel */}
        {selected && (
          <Card className="border-gray-200 shadow-xl rounded-xl sticky top-6 h-fit overflow-hidden bg-white">
            <CardHeader className="p-4 border-b border-gray-100 flex flex-row items-start justify-between pb-4">
              <div className="flex gap-3 items-start pr-4">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1 ${selected.type === "PDF" ? "bg-red-500" : selected.type === "DOCX" ? "bg-blue-500" : selected.type === "XLSX" ? "bg-green-500" : selected.type === "ZIP" ? "bg-purple-500" : "bg-amber-500"}`}>
                  {selected.type}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">{selected.name}</h3>
                  <div className="text-xs text-gray-500 mt-1">{selected.category} • {selected.type} • {selected.sizeMB} MB</div>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-emerald-100/60 text-emerald-700">Active</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition" onClick={() => setSelectedId(null)}>
                <X className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 flex gap-2 border-b border-gray-100 bg-gray-50/50">
                <Button variant="outline" className="flex-1 h-9 text-xs font-semibold bg-white" onClick={() => toast.info("Preview not available in MVP")}>
                  <Eye className="w-3.5 h-3.5 mr-2" /> Preview
                </Button>
                <Button variant="outline" className="flex-1 h-9 text-xs font-semibold bg-white" onClick={() => toast.success("Download started")}>
                  <Download className="w-3.5 h-3.5 mr-2" /> Download
                </Button>
              </div>
              <div className="p-4 flex gap-2 border-b border-gray-100">
                <Button variant="outline" className="flex-1 h-9 text-xs font-semibold" onClick={() => openShare(selected)}>
                  <Share2 className="w-3.5 h-3.5 mr-2" /> Share
                </Button>
                <Button variant="outline" className="flex-1 h-9 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200" onClick={() => setDeleteTarget(selected)}>
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                </Button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <div className="text-gray-500 font-medium">Access Level</div>
                  <div className="text-gray-900 font-semibold capitalize">{selected.accessLevel}</div>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <div className="text-gray-500 font-medium">Related To</div>
                  <div className="text-gray-900 font-semibold">{selected.relatedToType}</div>
                </div>
                {selected.effectiveDate && (
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <div className="text-gray-500 font-medium">Effective Date</div>
                    <div className="text-gray-900 font-semibold">{new Date(selected.effectiveDate).toLocaleDateString()}</div>
                  </div>
                )}
                {selected.expiryDate && (
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <div className="text-gray-500 font-medium">Expiry Date</div>
                    <div className="text-gray-900 font-semibold">{new Date(selected.expiryDate).toLocaleDateString()}</div>
                  </div>
                )}
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <div className="text-gray-500 font-medium">Version</div>
                  <div className="text-gray-900 font-semibold">{selected.version}</div>
                </div>
                <div className="pt-2">
                  <div className="text-gray-500 font-medium mb-1.5">Description</div>
                  <div className="text-gray-900 leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-100">{selected.description}</div>
                </div>
                <div className="pt-2">
                  <div className="text-gray-500 font-medium mb-1.5">Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-semibold border border-emerald-100">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Delete Document</h3>
                  <p className="text-xs text-gray-500">This will move the document to the Recycle Bin.</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 mb-5 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded flex items-center justify-center text-[9px] font-bold text-white shrink-0 ${deleteTarget.type === "PDF" ? "bg-red-500" : deleteTarget.type === "DOCX" ? "bg-blue-500" : deleteTarget.type === "XLSX" ? "bg-green-500" : "bg-purple-500"}`}>
                    {deleteTarget.type}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-800">{deleteTarget.name}</div>
                    <div className="text-[10px] text-gray-500">{deleteTarget.category} • {deleteTarget.sizeMB} MB</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-9 text-xs font-semibold" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                <Button className="flex-1 h-9 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete}>
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Move to Recycle Bin
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Share Document Modal ── */}
      {shareTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                  <Share2 className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Share Document</h3>
                  <p className="text-[11px] text-gray-500 truncate max-w-[280px]">{shareTarget.name}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShareTarget(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Share With (Name / Company) <span className="text-red-500">*</span></label>
                <Input value={shareWith} onChange={e => setShareWith(e.target.value)} placeholder="e.g. ABC Construction Inc." className="h-9 text-xs border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                <Input value={shareEmail} onChange={e => setShareEmail(e.target.value)} type="email" placeholder="e.g. contact@example.com" className="h-9 text-xs border-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Access Level</label>
                  <select value={shareAccess} onChange={e => setShareAccess(e.target.value as ShareAccess)} className="w-full h-9 px-3 text-xs border border-gray-200 rounded-md focus:outline-none bg-white">
                    <option value="view">View Only</option>
                    <option value="edit">Can Edit</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Expires On (optional)</label>
                  <Input value={shareExpiry} onChange={e => setShareExpiry(e.target.value)} type="date" className="h-9 text-xs border-gray-200" />
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <Link2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <p className="text-[10px] text-blue-700">A secure share link will be sent to the recipient&apos;s email.</p>
              </div>
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <Button variant="outline" className="flex-1 h-9 text-xs font-semibold" onClick={() => setShareTarget(null)}>Cancel</Button>
              <Button className="flex-1 h-9 text-xs font-semibold bg-[#008A56] hover:bg-[#007045] text-white" onClick={handleShare}>
                <Send className="w-3.5 h-3.5 mr-1.5" /> Send Share Link
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
