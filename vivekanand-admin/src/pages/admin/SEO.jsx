import React, { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { api } from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";

export default function SEO() {
  const { toast } = useToast();
  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/settings");
        const data = res.data?.data || res.data;
        if (data?.length > 0) { setValues(data[0]); setRecordId(data[0]._id || data[0].id); }
        else setValues({ meta_title: "", meta_description: "", google_analytics: "" });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (recordId) await api.put(`/settings/${recordId}`, { meta_title: values.meta_title, meta_description: values.meta_description, google_analytics: values.google_analytics });
      else { const res = await api.post("/settings", { institute_name: "વિવેકાનંદ ટ્યુશન ક્લાસીસ", meta_title: values.meta_title, meta_description: values.meta_description, google_analytics: values.google_analytics }); setRecordId(res.data?.data?._id || res.data?._id || res.data?.id); }
      toast({ title: "SEO સાચવાયું" });
    } catch (err) { toast({ title: "ભૂલ આવી", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  if (loading || !values) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#7a1d1d]" /></div>;
  const inputCls = "w-full px-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-[#7a1d1d]";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-[#7a1d1d]">SEO</h2>
        <p className="text-sm text-muted-foreground">મેટા ટેગ્સ અને એનાલિટિક્સ</p>
      </div>
      <form onSubmit={save} className="admin-card space-y-4">
        <div><label className="block text-sm font-medium mb-1.5">મેટા ટાઇટલ</label><input value={values.meta_title || ""} onChange={(e) => setValues({ ...values, meta_title: e.target.value })} className={inputCls} /></div>
        <div><label className="block text-sm font-medium mb-1.5">મેટા ડિસ્ક્રિપ્શન</label><textarea value={values.meta_description || ""} onChange={(e) => setValues({ ...values, meta_description: e.target.value })} rows={3} className={inputCls} /></div>
        <div><label className="block text-sm font-medium mb-1.5">ગૂગલ એનાલિટિક્સ ID</label><input value={values.google_analytics || ""} onChange={(e) => setValues({ ...values, google_analytics: e.target.value })} className={inputCls} /></div>
        <div className="flex justify-end"><button type="submit" disabled={saving} className="admin-btn admin-btn-primary">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} સાચવો</button></div>
      </form>
    </div>
  );
}