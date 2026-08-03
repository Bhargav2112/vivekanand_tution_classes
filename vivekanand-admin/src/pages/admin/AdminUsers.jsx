import React, { useState, useEffect } from "react";
import { UserPlus, Trash2, Edit3, KeyRound, Loader2, Shield, ShieldAlert, CheckCircle2, XCircle, Search } from "lucide-react";
import { api } from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";
import ConfirmDialog from "@/components/admin/shared/ConfirmDialog";

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Create Modal
  const [createOpen, setCreateOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("Admin");
  const [submitting, setSubmitting] = useState(false);

  // Edit Modal
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("Admin");
  const [editIsActive, setEditIsActive] = useState(true);

  // Delete Modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admins");
      const data = res.data?.data || res.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast({ title: err?.response?.data?.message || err?.message || "એડમિન લિસ્ટ લોડ કરવામાં ભૂલ આવી", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formUsername || !formPassword) {
      toast({ title: "કૃપા કરીને યુઝરનેમ અને પાસવર્ડ દાખલ કરો", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: formName || formUsername,
        username: formUsername,
        email: formEmail || `${formUsername}@vivekanand.com`,
        password: formPassword,
        role: formRole,
      };
      await api.post("/admins", payload);
      toast({ title: "નવો એડમિન સફળતાપૂર્વક ઉમેરાયો!" });
      setCreateOpen(false);
      setFormName("");
      setFormUsername("");
      setFormEmail("");
      setFormPassword("");
      setFormRole("Admin");
      loadAdmins();
    } catch (err) {
      toast({ title: err?.response?.data?.message || err?.message || "એડમિન ઉમેરવામાં ભૂલ આવી", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (u) => {
    setEditingUser(u);
    setEditName(u.name || "");
    setEditUsername(u.username || u.name || "");
    setEditEmail(u.email || "");
    setEditPassword("");
    setEditRole(u.role || "Admin");
    setEditIsActive(u.isActive !== false);
    setEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSubmitting(true);
    try {
      const payload = {
        name: editName,
        username: editUsername,
        email: editEmail,
        role: editRole,
        isActive: editIsActive,
      };
      if (editPassword.trim()) {
        payload.password = editPassword;
      }
      await api.put(`/admins/${editingUser._id || editingUser.id}`, payload);
      toast({ title: "એડમિન વિગત સફળતાપૂર્વક અપડેટ થઈ!" });
      setEditOpen(false);
      setEditingUser(null);
      loadAdmins();
    } catch (err) {
      toast({ title: err?.response?.data?.message || err?.message || "અપડેટ કરવામાં ભૂલ આવી", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admins/${deleteTarget._id || deleteTarget.id}`);
      toast({ title: "એડમિન સફળતાપૂર્વક ડિલીટ થયો!" });
      setDeleteTarget(null);
      loadAdmins();
    } catch (err) {
      toast({ title: err?.response?.data?.message || err?.message || "ડિલીટ કરવામાં ભૂલ આવી", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#7a1d1d]" />
            <h2 className="text-2xl font-bold text-[#7a1d1d]">એડમિન લિસ્ટ (Admin Management)</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            માત્ર સુપર એડમિન (admin1) માટે જ એડમિન અને સબ-એડમિન મેનેજ કરવાનો અધિકાર છે.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="admin-btn admin-btn-primary text-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" /> નવો એડમિન ઉમેરો
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#7a1d1d]/10 text-[#7a1d1d] flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#7a1d1d]">{users.length}</div>
            <div className="text-xs text-muted-foreground font-medium">કુલ એડમિન એકાઉન્ટ્સ</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-6-00 flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">
              {users.filter((u) => u.role === "Super Admin" || u.username === "admin1").length}
            </div>
            <div className="text-xs text-muted-foreground font-medium">સુપર એડમિન (Super Admin)</div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {users.filter((u) => u.role !== "Super Admin" && u.username !== "admin1").length}
            </div>
            <div className="text-xs text-muted-foreground font-medium">સબ-એડમિન (Sub Admins)</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="નામ, યુઝરનેમ અથવા ઈમેલ શોધો..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-sm bg-transparent border-none focus:outline-none"
        />
      </div>

      {/* Admin Users Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#7a1d1d] text-white">
                <th className="px-4 py-3.5 font-semibold">નામ</th>
                <th className="px-4 py-3.5 font-semibold">યુઝરનેમ</th>
                <th className="px-4 py-3.5 font-semibold">ઈમેલ</th>
                <th className="px-4 py-3.5 font-semibold">રોલ</th>
                <th className="px-4 py-3.5 font-semibold">સ્ટેટસ</th>
                <th className="px-4 py-3.5 font-semibold text-right">ક્રિયા (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin inline mr-2 text-[#7a1d1d]" />
                    લોડ થઈ રહ્યું છે...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    કોઈ એડમિન યુઝર મળ્યો નથી
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isMainSuperAdmin = u.username === "admin1" || u.email === "admin1@vivekanand.com";
                  const isSuper = u.role === "Super Admin" || isMainSuperAdmin;

                  return (
                    <tr key={u._id || u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5 font-medium text-foreground">
                        {u.name || "—"}
                        {isMainSuperAdmin && (
                          <span className="ml-2 px-2 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-800 rounded-full">
                            PRIMARY
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-foreground font-semibold">
                        {u.username || u.name || "—"}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">{u.email || "—"}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${
                            isSuper
                              ? "bg-amber-500/15 text-amber-700 border border-amber-500/30"
                              : "bg-blue-500/15 text-blue-700 border border-blue-500/30"
                          }`}
                        >
                          {isSuper ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                          {isSuper ? "Super Admin" : "Sub Admin"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {u.isActive !== false ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5" /> એક્ટિવ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-md">
                            <XCircle className="w-3.5 h-3.5" /> ડીએક્ટિવ
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 text-slate-600 hover:text-[#7a1d1d] hover:bg-slate-100 rounded-lg transition-colors"
                          title="એડિટ કરો / પાસવર્ડ બદલો"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {!isMainSuperAdmin && (
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="ડિલીટ કરો"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create New Admin Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 bg-[#7a1d1d] text-white flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> નવો એડમિન એકાઉન્ટ બનાવો
              </h3>
              <button onClick={() => setCreateOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">નામ (Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="દા.ત. Rajesh Kumar"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-[#7a1d1d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">યુઝરનેમ (Username) *</label>
                <input
                  type="text"
                  required
                  placeholder="દા.ત. rajesh_admin"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-[#7a1d1d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ઈમેલ (Email)</label>
                <input
                  type="email"
                  placeholder="દા.ત. rajesh@vivekanand.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-[#7a1d1d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">પાસવર્ડ (Password) *</label>
                <input
                  type="text"
                  required
                  placeholder="પાસવર્ડ લખો (દા.ત. Pass@123)"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-[#7a1d1d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">રોલ (Role)</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:border-[#7a1d1d]"
                >
                  <option value="Admin">Sub Admin (સબ-એડમિન)</option>
                  <option value="Super Admin">Super Admin (સુપર એડમિન)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="admin-btn admin-btn-outline"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="admin-btn admin-btn-primary flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  એડમિન બનાવો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {editOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-4 bg-[#7a1d1d] text-white flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Edit3 className="w-5 h-5" /> એડમિન અપડેટ કરો ({editingUser.username || editingUser.name})
              </h3>
              <button onClick={() => setEditOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">નામ (Name)</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-[#7a1d1d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">યુઝરનેમ (Username)</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  disabled={editingUser.username === "admin1"}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-[#7a1d1d] disabled:bg-muted"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ઈમેલ (Email)</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-[#7a1d1d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" /> નવો પાસવર્ડ (જો બદલવો હોય તો જ લખો)
                </label>
                <input
                  type="text"
                  placeholder="ખાલી રાખશો તો પાસવર્ડ બદલાશે નહીં"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-[#7a1d1d]"
                />
              </div>

              {editingUser.username !== "admin1" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">રોલ (Role)</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:border-[#7a1d1d]"
                    >
                      <option value="Admin">Sub Admin (સબ-એડમિન)</option>
                      <option value="Super Admin">Super Admin (સુપર એડમિન)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="editIsActive"
                      checked={editIsActive}
                      onChange={(e) => setEditIsActive(e.target.checked)}
                      className="w-4 h-4 text-[#7a1d1d] accent-[#7a1d1d] rounded cursor-pointer"
                    />
                    <label htmlFor="editIsActive" className="text-sm font-medium cursor-pointer">
                      એકાઉન્ટ એક્ટિવ રાખો (Active Account)
                    </label>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="admin-btn admin-btn-outline"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="admin-btn admin-btn-primary flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  અપડેટ કરો
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="એડમિન ડિલીટ કરો"
          message={`શું તમે ખરેખર એડમિન "${deleteTarget.name || deleteTarget.username}" ને ડિલીટ કરવા માંગો છો?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}