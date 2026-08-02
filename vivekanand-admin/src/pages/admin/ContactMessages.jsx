import React, { useState, useEffect } from "react";
import { Search, Trash2, Eye, Mail, Loader2, X, Send } from "lucide-react";
import { api } from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/lib/export";
import ConfirmDialog from "@/components/admin/shared/ConfirmDialog";

export default function ContactMessages() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);
  const [reply, setReply] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/contactenquiries");
      const data = res.data?.data || res.data;
      setItems(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = items.filter((it) =>
    !search || [it.name, it.email, it.phone, it.subject].some((v) => String(v ?? "").toLowerCase().includes(search.toLowerCase()))
  );

  const markRead = async (item) => {
    if (item.status === "new") {
      await api.put(`/contactenquiries/${item._id || item.id}`, { status: "read" });
      load();
    }
    setViewing(item);
    setReply(item.notes || "");
  };

  const sendReply = async () => {
    try {
      await api.put(`/contactenquiries/${viewing._id || viewing.id}`, { status: "replied", notes: reply });
      toast({ title: "નોંધ સાચવાઈ" });
      setViewing(null);
      load();
    } catch (err) {
      console.error(err);
      toast({ title: "એરર!", description: err.message, variant: "destructive" });
    }
  };

  const approveToAdmission = async () => {
    try {
      await api.post("/admissions", {
        student_name: viewing.name,
        mobile: viewing.phone,
        remarks: viewing.message || viewing.subject,
        status: "approved"
      });
      await api.put(`/contactenquiries/${viewing._id || viewing.id}`, { status: "replied", notes: reply || "મંજૂર કરેલ પ્રવેશ" });
      toast({ title: "ઈન્ક્વાયરી મંજૂર થઈ અને પ્રવેશ લિસ્ટમાં ઉમેરાઈ ગઈ!" });
      setViewing(null);
      load();
    } catch (err) {
      console.error(err);
      toast({ title: "એરર!", description: "પ્રવેશમાં ઉમેરવામાં ક્ષતિ થઈ.", variant: "destructive" });
    }
  };

  const doDelete = async () => { await api.delete(`/contactenquiries/${deleteId}`); setDeleteId(null); load(); toast({ title: "ડિલીટ થયું" }); };

  const STATUS = { new: { bg: "#fcd34d", text: "#78350f", label: "નવું" }, read: { bg: "#93c5fd", text: "#1e3a8a", label: "વાંચેલ" }, replied: { bg: "#34d399", text: "#064e3b", label: "મંજૂર / જવાબ આપેલ" } };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#7a1d1d]">ઈન્ક્વાયરી / સંપર્ક</h2>
          <p className="text-sm text-muted-foreground">સંપર્ક અને ઇન્ક્વાયરી મેનેજ કરો</p>
        </div>
        <button onClick={() => exportToExcel("contact-messages", filtered, [{ key: "name", label: "નામ" }, { key: "email", label: "ઈમેલ" }, { key: "phone", label: "ફોન" }, { key: "message", label: "સંદેશ" }, { key: "status", label: "સ્ટેટસ" }])} className="admin-btn admin-btn-outline text-sm"><Mail className="w-4 h-4" /> Excel એક્સપોર્ટ</button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="શોધો..." className="w-full pl-9 pr-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-[#7a1d1d]" />
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#7a1d1d] text-white text-left">
              <th className="px-4 py-3 font-semibold">નામ</th>
              <th className="px-4 py-3 font-semibold">ઈમેલ</th>
              <th className="px-4 py-3 font-semibold">ફોન</th>
              <th className="px-4 py-3 font-semibold">વિષય</th>
              <th className="px-4 py-3 font-semibold">સ્ટેટસ</th>
              <th className="px-4 py-3 font-semibold text-right">ક્રિયા</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin inline" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">કોઈ સંદેશ નથી</td></tr>
            ) : filtered.map((row) => {
              const st = STATUS[row.status] || STATUS.new;
              return (
                <tr key={row._id || row.id} className="border-b border-border hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.email || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.phone}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.subject || "—"}</td>
                  <td className="px-4 py-3"><span className="px-2.5 py-1 text-xs font-semibold inline-block" style={{ backgroundColor: st.bg, color: st.text }}>{st.label}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => markRead(row)} className="p-1.5 hover:bg-muted text-[#2563eb]"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteId(row._id || row.id)} className="p-1.5 hover:bg-muted text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/50">
          <div className="bg-white w-full max-w-lg my-8 shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 bg-[#7a1d1d] text-white">
              <h3 className="font-bold">ઈન્ક્વાયરી વિગત</h3>
              <button type="button" onClick={() => setViewing(null)} className="hover:text-[#f59e0b]"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">નામ:</span> <span className="font-medium">{viewing.name}</span></div>
                <div><span className="text-muted-foreground">ફોન:</span> <span className="font-medium">{viewing.phone}</span></div>
                <div className="col-span-2"><span className="text-muted-foreground">વિષય:</span> <span className="font-medium">{viewing.subject}</span></div>
              </div>
              <div className="border-t border-border pt-3">
                <div className="text-sm text-muted-foreground mb-1">વિગતવાર સંદેશ:</div>
                <p className="text-sm bg-muted/40 p-3 whitespace-pre-wrap">{viewing.message}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">નોંધ / જવાબ</label>
                <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-border focus:outline-none focus:border-[#7a1d1d]" placeholder="નોંધ લખો..." />
              </div>
              <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-border">
                <button type="button" onClick={() => setViewing(null)} className="admin-btn admin-btn-outline text-xs">બંધ કરો</button>
                <button type="button" onClick={sendReply} className="admin-btn admin-btn-secondary text-xs"><Send className="w-3.5 h-3.5" /> નોંધ સાચવો</button>
                <button type="button" onClick={approveToAdmission} className="admin-btn bg-[#27AE60] text-white hover:bg-[#219653] text-xs font-bold px-3.5 py-2 flex items-center gap-1.5 shadow">
                  પ્રવેશ મંજૂર કરો
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="સંદેશ ડિલીટ" message="શું આ સંદેશ ડિલીટ કરવો છે?" onConfirm={doDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}