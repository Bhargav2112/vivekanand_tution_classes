import React, { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Loader2, Upload, X } from "lucide-react";
import { api } from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";
import FileUpload from "@/components/admin/shared/FileUpload";
import ConfirmDialog from "@/components/admin/shared/ConfirmDialog";

export default function Gallery() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [values, setValues] = useState({ title: "", image_url: "", alt_text: "", category: "", display_order: 0 });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/galleries");
      const data = res.data?.data || res.data;
      setItems(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setValues({ title: "", image_url: "", alt_text: "", category: "", display_order: 0 }); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); setValues({ title: item.title, image_url: item.image_url, alt_text: item.alt_text || "", category: item.category || "", display_order: item.display_order || 0 }); setModalOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    if (!values.title || !values.image_url) { toast({ title: "શીર્ષક અને ઈમેજ આવશ્યક છે", variant: "destructive" }); return; }
    setSaving(true);
    try {
      if (editing) { await api.put(`/galleries/${editing._id || editing.id}`, values); toast({ title: "અપડેટ થયું" }); }
      else { await api.post("/galleries", values); toast({ title: "ઉમેરાયું" }); }
      setModalOpen(false);
      load();
    } catch (err) { toast({ title: "ભૂલ આવી", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const doDelete = async () => { await api.delete(`/galleries/${deleteId}`); setDeleteId(null); load(); toast({ title: "ડિલીટ થયું" }); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#7a1d1d]">ગેલેરી</h2>
          <p className="text-sm text-muted-foreground">ઈમેજ અપલોડ અને મેનેજ કરો</p>
        </div>
        <button onClick={openAdd} className="admin-btn admin-btn-primary text-sm"><Plus className="w-4 h-4" /> ઈમેજ ઉમેરો</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#7a1d1d]" /></div>
      ) : items.length === 0 ? (
        <div className="admin-card text-center py-16 text-muted-foreground">કોઈ ઈમેજ નથી. નવી ઈમેજ ઉમેરો.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item._id || item.id} className="admin-card !p-2 group">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img src={item.image_url} alt={item.alt_text || item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(item)} className="p-2 bg-white text-[#7a1d1d] hover:bg-[#f59e0b] hover:text-white"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(item._id || item.id)} className="p-2 bg-white text-red-600 hover:bg-red-600 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-2">
                <div className="text-sm font-medium truncate">{item.title}</div>
                {item.category && <div className="text-[11px] text-muted-foreground">{item.category}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/50">
          <div className="bg-white w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-5 py-4 bg-[#7a1d1d] text-white">
              <h3 className="font-bold">{editing ? "ઈમેજ એડિટ કરો" : "ઈમેજ ઉમેરો"}</h3>
              <button onClick={() => setModalOpen(false)} className="hover:text-[#f59e0b]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={save} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">શીર્ષક *</label>
                <input value={values.title} onChange={(e) => setValues({ ...values, title: e.target.value })} className="w-full px-3 py-2 text-sm border border-border focus:outline-none focus:border-[#7a1d1d]" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">ઈમેજ *</label>
                <FileUpload value={values.image_url} onChange={(url) => setValues({ ...values, image_url: url })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">કેટેગરી</label>
                  <input value={values.category} onChange={(e) => setValues({ ...values, category: e.target.value })} className="w-full px-3 py-2 text-sm border border-border focus:outline-none focus:border-[#7a1d1d]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">ડિસ્પ્લે ઓર્ડર</label>
                  <input type="number" value={values.display_order} onChange={(e) => setValues({ ...values, display_order: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border border-border focus:outline-none focus:border-[#7a1d1d]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Alt ટેક્સ્ટ</label>
                <input value={values.alt_text} onChange={(e) => setValues({ ...values, alt_text: e.target.value })} className="w-full px-3 py-2 text-sm border border-border focus:outline-none focus:border-[#7a1d1d]" />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-border">
                <button type="button" onClick={() => setModalOpen(false)} className="admin-btn admin-btn-outline">રદ કરો</button>
                <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}સાચવો</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="ઈમેજ ડિલીટ" message="શું આ ઈમેજ ડિલીટ કરવી છે?" onConfirm={doDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}