import React, { useState, useEffect } from "react";
import { Save, KeyRound, Loader2, Image as ImageIcon, Building, BarChart3 } from "lucide-react";
import { api } from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";
import FileUpload from "@/components/admin/shared/FileUpload";

export default function Settings() {
  const { toast } = useToast();
  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recordId, setRecordId] = useState(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPass, setChangingPass] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/settings");
      const data = res.data?.data || res.data;
      if (data && data.length > 0) {
        const doc = data[0];
        setValues({
          ...doc,
          stats_students_value: doc.stats_students_value !== undefined ? doc.stats_students_value : 5000,
          stats_students_suffix: doc.stats_students_suffix || "+",
          stats_students_label: doc.stats_students_label || "વિદ્યાર્થીઓ",
          stats_results_value: doc.stats_results_value !== undefined ? doc.stats_results_value : 98,
          stats_results_suffix: doc.stats_results_suffix || "%",
          stats_results_label: doc.stats_results_label || "પરિણામ",
          stats_experience_value: doc.stats_experience_value !== undefined ? doc.stats_experience_value : 15,
          stats_experience_suffix: doc.stats_experience_suffix || "+",
          stats_experience_label: doc.stats_experience_label || "વર્ષનો અનુભવ",
          stats_merit_value: doc.stats_merit_value !== undefined ? doc.stats_merit_value : 500,
          stats_merit_suffix: doc.stats_merit_suffix || "+",
          stats_merit_label: doc.stats_merit_label || "મેરિટ વિદ્યાર્થીઓ",
        });
        setRecordId(doc._id || doc.id);
      } else {
        setValues({
          institute_name: "વિવેકાનંદ ટ્યુશન ક્લાસીસ",
          tagline: "ગુજરાતનું વિશ્વાસપાત્ર શિક્ષણ કેન્દ્ર",
          logo_url: "",
          hero_banner_url: "",
          classroom_img_url: "",
          about_banner_url: "",
          stats_students_value: 5000,
          stats_students_suffix: "+",
          stats_students_label: "વિદ્યાર્થીઓ",
          stats_results_value: 98,
          stats_results_suffix: "%",
          stats_results_label: "પરિણામ",
          stats_experience_value: 15,
          stats_experience_suffix: "+",
          stats_experience_label: "વર્ષનો અનુભવ",
          stats_merit_value: 500,
          stats_merit_suffix: "+",
          stats_merit_label: "મેરિટ વિદ્યાર્થીઓ"
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setField = (key, val) => setValues((prev) => ({ ...prev, [key]: val }));

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (recordId) {
        await api.put(`/settings/${recordId}`, values);
      } else {
        const res = await api.post("/settings", values);
        const created = res.data?.data || res.data;
        setRecordId(created._id || created.id);
      }
      toast({ title: "સેટિંગ્સ સફળતાપૂર્વક સાચવાયા!" });
    } catch (err) {
      console.error(err);
      toast({ title: "સેટિંગ્સ સાચવવામાં ક્ષતિ થઈ", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast({ title: "નવો પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરનો હોવો જોઈએ.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "નવો પાસવર્ડ અને કન્ફર્મ પાસવર્ડ મેચ થતા નથી.", variant: "destructive" });
      return;
    }

    setChangingPass(true);
    try {
      const res = await api.put("/auth/updatepassword", { currentPassword, newPassword });
      toast({ title: res.data?.message || "એડમિન પાસવર્ડ સફળતાપૂર્વક અપડેટ થયો!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast({
        title: "પાસવર્ડ બદલવામાં ક્ષતિ થઈ",
        description: err.response?.data?.message || err.message,
        variant: "destructive"
      });
    } finally {
      setChangingPass(false);
    }
  };

  if (loading || !values) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#7a1d1d]" />
      </div>
    );
  }

  const inputCls = "w-full px-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-[#7a1d1d]";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-[#7a1d1d]">Settings (સેટિંગ્સ)</h2>
        <p className="text-sm text-muted-foreground mt-1">એડમિન પાસવર્ડ અને વેબસાઈટની માહિતી મેનેજ કરો</p>
      </div>

      {/* 1. ADMIN PASSWORD CHANGE */}
      <div className="admin-card border-2 border-[#7a1d1d]/20 bg-muted/20">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
          <KeyRound className="w-5 h-5 text-[#7a1d1d]" />
          <h3 className="font-bold text-[#7a1d1d] text-base">એડમિન પાસવર્ડ બદલો</h3>
        </div>
        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold mb-1">વર્તમાન પાસવર્ડ</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputCls}
              placeholder="વર્તમાન પાસવર્ડ"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">નવો પાસવર્ડ</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputCls}
              placeholder="નવો પાસવર્ડ (મિનિમમ 6 અક્ષર)"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">કન્ફર્મ નવો પાસવર્ડ</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputCls}
              placeholder="કન્ફર્મ નવો પાસવર્ડ"
              required
            />
          </div>
          <div className="sm:col-span-3 flex justify-end mt-2">
            <button
              type="submit"
              disabled={changingPass}
              className="admin-btn bg-[#7a1d1d] text-white hover:bg-[#5a1515] text-xs font-bold px-4 py-2 flex items-center gap-2 shadow"
            >
              {changingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              પાસવર્ડ અપડેટ કરો
            </button>
          </div>
        </form>
      </div>

      {/* 2. MAIN WEBSITE SETTINGS FORM */}
      <form onSubmit={saveSettings} className="space-y-6">
        {/* Institute Info */}
        <div className="admin-card">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
            <Building className="w-5 h-5 text-[#7a1d1d]" />
            <h3 className="font-bold text-[#7a1d1d] text-base">સંસ્થાની મુખ્ય વિગત અને લોગો</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">સંસ્થાનું નામ *</label>
              <input
                value={values.institute_name || ""}
                onChange={(e) => setField("institute_name", e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">ટેગલાઈન / સૂત્ર</label>
              <input
                value={values.tagline || ""}
                onChange={(e) => setField("tagline", e.target.value)}
                className={inputCls}
                placeholder="ગુજરાતનું વિશ્વાસપાત્ર શિક્ષણ કેન્દ્ર"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1">સંસ્થાનો લોગો</label>
              <FileUpload value={values.logo_url} onChange={(url) => setField("logo_url", url)} />
            </div>
          </div>
        </div>

        {/* Section Pictures / Classroom Banners */}
        <div className="admin-card">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
            <ImageIcon className="w-5 h-5 text-[#7a1d1d]" />
            <h3 className="font-bold text-[#7a1d1d] text-base">સેક્શન અને ક્લાસરૂમ ચિત્રો (Pictures)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">હોમ પેજ મેઈન પિક્ચર (Hero Banner)</label>
              <FileUpload value={values.hero_banner_url} onChange={(url) => setField("hero_banner_url", url)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">ક્લાસરૂમ / કેમ્પસ ચિત્ર (Classroom Picture)</label>
              <FileUpload value={values.classroom_img_url} onChange={(url) => setField("classroom_img_url", url)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">અમારા વિશે પેજ બેનર (About Page Banner)</label>
              <FileUpload value={values.about_banner_url} onChange={(url) => setField("about_banner_url", url)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">સ્થાપક છબી (Founder Picture)</label>
              <FileUpload value={values.founder_img_url} onChange={(url) => setField("founder_img_url", url)} />
            </div>
          </div>
        </div>

        {/* Instagram Settings */}
        <div className="admin-card">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
            <ImageIcon className="w-5 h-5 text-[#7a1d1d]" />
            <h3 className="font-bold text-[#7a1d1d] text-base">Instagram Feed Settings</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Instagram Username</label>
              <input
                value={values.instagram_username || ""}
                onChange={(e) => setField("instagram_username", e.target.value)}
                className={inputCls}
                placeholder="vivekanand_tution_classes"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1">Instagram Graph API Token (Long Lived)</label>
              <input
                type="password"
                value={values.instagram_token || ""}
                onChange={(e) => setField("instagram_token", e.target.value)}
                className={inputCls}
                placeholder="IGQWR..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Post Count</label>
              <input
                type="number"
                value={values.instagram_post_count || 8}
                onChange={(e) => setField("instagram_post_count", parseInt(e.target.value) || 8)}
                className={inputCls}
              />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={values.instagram_feed_enabled || false}
                onChange={(e) => setField("instagram_feed_enabled", e.target.checked)}
                id="ig_enabled"
                className="w-4 h-4"
              />
              <label htmlFor="ig_enabled" className="text-sm font-semibold cursor-pointer">Enable Instagram Feed on Homepage</label>
            </div>
          </div>
        </div>

        {/* Push Notification VAPID Settings */}
        <div className="admin-card">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
            <BarChart3 className="w-5 h-5 text-[#7a1d1d]" />
            <h3 className="font-bold text-[#7a1d1d] text-base">Push Notifications (VAPID) Settings</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">VAPID Public Key</label>
              <input
                type="password"
                value={values.vapid_public_key || ""}
                onChange={(e) => setField("vapid_public_key", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">VAPID Private Key</label>
              <input
                type="password"
                value={values.vapid_private_key || ""}
                onChange={(e) => setField("vapid_private_key", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Contact Email</label>
              <input
                type="email"
                value={values.vapid_email || ""}
                onChange={(e) => setField("vapid_email", e.target.value)}
                className={inputCls}
                placeholder="mailto:vivekanandclasses@gmail.com"
              />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={values.push_enabled || false}
                onChange={(e) => setField("push_enabled", e.target.checked)}
                id="push_enabled"
                className="w-4 h-4"
              />
              <label htmlFor="push_enabled" className="text-sm font-semibold cursor-pointer">Enable Browser Push Notifications</label>
            </div>
          </div>
        </div>

        {/* Statistics Settings */}
        <div className="admin-card">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
            <BarChart3 className="w-5 h-5 text-[#7a1d1d]" />
            <h3 className="font-bold text-[#7a1d1d] text-base">આંકડાકીય માહિતી (Statistics Settings)</h3>
          </div>
          
          <div className="space-y-6">
            {/* Row 1: Students & Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Students Stat */}
              <div className="p-4 border border-border rounded bg-muted/5 space-y-3">
                <h4 className="font-semibold text-sm text-[#7a1d1d]">૧. વિદ્યાર્થીઓનો આંકડો (Students Counter)</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold mb-1">સંખ્યા (Number)</label>
                    <input
                      type="number"
                      value={values.stats_students_value}
                      onChange={(e) => setField("stats_students_value", parseInt(e.target.value) || 0)}
                      className={inputCls}
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold mb-1">ચિહ્ન (Suffix)</label>
                    <input
                      type="text"
                      value={values.stats_students_suffix || ""}
                      onChange={(e) => setField("stats_students_suffix", e.target.value)}
                      className={inputCls}
                      placeholder="+"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold mb-1">લેબલ (Label)</label>
                    <input
                      type="text"
                      value={values.stats_students_label || ""}
                      onChange={(e) => setField("stats_students_label", e.target.value)}
                      className={inputCls}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Results Stat */}
              <div className="p-4 border border-border rounded bg-muted/5 space-y-3">
                <h4 className="font-semibold text-sm text-[#7a1d1d]">૨. પરિણામ ટકાવારી (Results Percentage)</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold mb-1">સંખ્યા (Number)</label>
                    <input
                      type="number"
                      value={values.stats_results_value}
                      onChange={(e) => setField("stats_results_value", parseInt(e.target.value) || 0)}
                      className={inputCls}
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold mb-1">ચિહ્ન (Suffix)</label>
                    <input
                      type="text"
                      value={values.stats_results_suffix || ""}
                      onChange={(e) => setField("stats_results_suffix", e.target.value)}
                      className={inputCls}
                      placeholder="%"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold mb-1">લેબલ (Label)</label>
                    <input
                      type="text"
                      value={values.stats_results_label || ""}
                      onChange={(e) => setField("stats_results_label", e.target.value)}
                      className={inputCls}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Experience & Merit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience Stat */}
              <div className="p-4 border border-border rounded bg-muted/5 space-y-3">
                <h4 className="font-semibold text-sm text-[#7a1d1d]">૩. વર્ષનો અનુભવ (Years of Experience)</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold mb-1">સંખ્યા (Number)</label>
                    <input
                      type="number"
                      value={values.stats_experience_value}
                      onChange={(e) => setField("stats_experience_value", parseInt(e.target.value) || 0)}
                      className={inputCls}
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold mb-1">ચિહ્ન (Suffix)</label>
                    <input
                      type="text"
                      value={values.stats_experience_suffix || ""}
                      onChange={(e) => setField("stats_experience_suffix", e.target.value)}
                      className={inputCls}
                      placeholder="+"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold mb-1">લેબલ (Label)</label>
                    <input
                      type="text"
                      value={values.stats_experience_label || ""}
                      onChange={(e) => setField("stats_experience_label", e.target.value)}
                      className={inputCls}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Merit Stat */}
              <div className="p-4 border border-border rounded bg-muted/5 space-y-3">
                <h4 className="font-semibold text-sm text-[#7a1d1d]">૪. મેરિટ વિદ્યાર્થીઓ (Merit Students)</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold mb-1">સંખ્યા (Number)</label>
                    <input
                      type="number"
                      value={values.stats_merit_value}
                      onChange={(e) => setField("stats_merit_value", parseInt(e.target.value) || 0)}
                      className={inputCls}
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold mb-1">ચિહ્ન (Suffix)</label>
                    <input
                      type="text"
                      value={values.stats_merit_suffix || ""}
                      onChange={(e) => setField("stats_merit_suffix", e.target.value)}
                      className={inputCls}
                      placeholder="+"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold mb-1">લેબલ (Label)</label>
                    <input
                      type="text"
                      value={values.stats_merit_label || ""}
                      onChange={(e) => setField("stats_merit_label", e.target.value)}
                      className={inputCls}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary text-sm px-6 py-2.5 flex items-center gap-2 shadow-md">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            બધા સેટિંગ્સ સાચવો
          </button>
        </div>
      </form>
    </div>
  );
}