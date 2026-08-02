import React, { useState, useEffect } from "react";
import { UserPlus, Trash2, Loader2, Shield } from "lucide-react";
import { api } from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";
import ConfirmDialog from "@/components/admin/shared/ConfirmDialog";

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("user");
  const [inviting, setInviting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admins");
      const data = res.data?.data || res.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const sendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviting(true);
    try {
      await api.post("/admins", { email: inviteEmail, role: inviteRole, name: inviteEmail.split("@")[0], password: "password123" });
      toast({ title: "ઈન્વાઈટ મોકલાયો" });
      setInviteOpen(false);
      setInviteEmail("");
      load();
    } catch (err) { toast({ title: err?.message || "ભૂલ આવી", variant: "destructive" }); }
    finally { setInviting(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#7a1d1d]">Admin Users</h2>
          <p className="text-sm text-muted-foreground">એડમિન યુઝર અને રોલ મેનેજ કરો</p>
        </div>
        <button onClick={() => setInviteOpen(true)} className="admin-btn admin-btn-primary text-sm"><UserPlus className="w-4 h-4" /> ઈન્વાઈટ કરો</button>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#7a1d1d] text-white text-left">
              <th className="px-4 py-3 font-semibold">નામ</th>
              <th className="px-4 py-3 font-semibold">ઈમેલ</th>
              <th className="px-4 py-3 font-semibold">રોલ</th>
              <th className="px-4 py-3 font-semibold">જોડાયા તારીખ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin inline" /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">કોઈ યુઝર નથી</td></tr>
            ) : users.map((u) => (
              <tr key={u._id || u.id} className="border-b border-border hover:bg-muted/40">
                <td className="px-4 py-3 font-medium">{u.name || u.full_name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: u.role === "admin" ? "#7a1d1d" : "#e5e7eb", color: u.role === "admin" ? "#fff" : "#374151" }}>
                    <Shield className="w-3 h-3" /> {u.role || "user"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(u.createdAt || u.created_date || Date.now()).toLocaleDateString("gu-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white w-full max-w-md">
            <div className="px-5 py-4 bg-[#7a1d1d] text-white"><h3 className="font-bold">નવો યુઝર ઈન્વાઈટ કરો</h3></div>
            <form onSubmit={sendInvite} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">ઈમેલ *</label>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required className="w-full px-3 py-2 text-sm border border-border focus:outline-none focus:border-[#7a1d1d]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">રોલ</label>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="w-full px-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-[#7a1d1d]">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-border">
                <button type="button" onClick={() => setInviteOpen(false)} className="admin-btn admin-btn-outline">રદ કરો</button>
                <button type="submit" disabled={inviting} className="admin-btn admin-btn-primary">{inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}ઈન્વાઈટ મોકલો</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}