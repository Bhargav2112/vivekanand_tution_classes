import React, { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import FileUpload from "./FileUpload";

export default function FormModal({ open, onClose, title, fields, initialValues, onSubmit }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    if (open) {
      setValues((prev) => {
        if (Object.keys(prev).length > 0) return prev;
        const init = {};
        fields.forEach((f) => {
          init[f.key] = initialValues?.[f.key] ?? f.default ?? (f.type === "object" ? {} : "");
        });
        return init;
      });
      setErrors({});
    } else {
      setValues({});
    }
  }, [open, initialValues]);

  if (!open) return null;

  const setField = (key, val) => {
    setValues((prev) => {
      const next = { ...prev, [key]: val };
      if ((key === "title" || key === "name") && fields.some(f => f.key === "slug")) {
        const generateSlug = (str) => String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        // Only auto-update slug if it was empty or matches the old title's slug
        const oldSlug = prev.title ? generateSlug(prev.title) : (prev.name ? generateSlug(prev.name) : "");
        if (!prev.slug || prev.slug === oldSlug) {
          next.slug = generateSlug(val);
        }
      }
      return next;
    });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const errs = {};
    fields.forEach((f) => {
      const val = values[f.key];
      if (f.required && !val && val !== 0) {
        errs[f.key] = `${f.label} આવશ્યક છે`;
        return;
      }
      
      if (!val && val !== 0) return;

      if (f.key.includes("phone") || f.key.includes("mobile") || f.key.includes("whatsapp") || f.type === "tel") {
        const digits = String(val).replace(/\D/g, "");
        if (digits.length < 10) {
          errs[f.key] = "10 આંકડાનો માન્ય નંબર નાખો";
        }
      }
      
      if (f.key.includes("email") || f.type === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val))) {
          errs[f.key] = "માન્ય ઈમેલ નાખો";
        }
      }
      
      if (f.type === "number") {
        if (Number(val) < 0) {
          errs[f.key] = "નકારાત્મક સંખ્યા માન્ય નથી";
        }
      }

      if (f.key === "percentage" || f.key.includes("percent")) {
        if (Number(val) > 100) {
          errs[f.key] = "ટકાવારી ક્યારેય ૧૦૦% થી વધુ ન હોઈ શકે";
        }
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...values };
      fields.forEach((f) => {
        if (typeof payload[f.key] === "string") {
          payload[f.key] = payload[f.key].trim();
        }
        if (f.type === "select" && payload[f.key] === "") delete payload[f.key];
        if (f.type === "number" && payload[f.key] === "") delete payload[f.key];
        if ((f.key.includes("name") || f.key.includes("title")) && typeof payload[f.key] === "string") {
          payload[f.key] = payload[f.key].replace(/\b\w/g, l => l.toUpperCase());
        }
      });

      if (payload.video_url || payload.youtube_url) {
        const ytId = extractYouTubeId(payload.video_url || payload.youtube_url);
        if (ytId) {
          if (!payload.photo_url) payload.photo_url = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
          if (!payload.image_url) payload.image_url = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        }
      }
      if (payload.student_name && !payload.review) {
        payload.review = "વિવેકાનંદ ટ્યુશન ક્લાસીસ વિશે ઉત્કૃષ્ટ અભિપ્રાય.";
      }

      await onSubmit(payload);
      onClose();
    } catch (err) {
      setErrors({ _form: err?.message || "ભૂલ આવી" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/50" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 bg-[#7a1d1d] text-white">
          <h3 className="font-bold">{title}</h3>
          <button type="button" onClick={onClose} className="hover:text-[#f59e0b]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errors._form && (
            <div className="bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {errors._form}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className={f.fullWidth ? "sm:col-span-2" : ""}>
                <label className="block text-sm font-medium mb-1.5">
                  {f.label} {f.required && <span className="text-red-500">*</span>}
                </label>
                {renderField(f, values[f.key], setField, errors[f.key], setUploadingFile)}
                {errors[f.key] && <p className="text-xs text-red-500 mt-1">{errors[f.key]}</p>}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onClose} className="admin-btn admin-btn-outline">
              રદ કરો
            </button>
            <button type="submit" disabled={saving || uploadingFile} className="admin-btn admin-btn-primary disabled:opacity-50">
              {saving || uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {uploadingFile ? "અપલોડ થઈ રહ્યું છે..." : "સાચવો"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function extractYouTubeId(url) {
  if (!url) return '';
  const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
  return (match && match[1]) ? match[1] : '';
}

function renderField(f, value, setField, error, setUploadingFile) {
  const baseClass = "w-full px-3 py-2 text-sm border bg-white focus:outline-none " + (error ? "border-red-400" : "border-border focus:border-[#7a1d1d]");

  if (f.key.includes("video") || f.key.includes("youtube") || f.key === "video_url") {
    return (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => {
          const val = e.target.value;
          setField(f.key, val);
          const ytId = extractYouTubeId(val);
          if (ytId) {
            const thumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
            setField("photo_url", thumb);
            setField("image_url", thumb);
          }
        }}
        className={baseClass}
        placeholder={f.placeholder || "https://youtube.com/shorts/..."}
      />
    );
  }

  if (f.key.includes("roll")) {
    return (
      <input
        type="text"
        inputMode="numeric"
        value={value || ""}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          setField(f.key, digits);
        }}
        className={baseClass}
        placeholder={f.placeholder || "રોલ નંબર (માત્ર અંક)"}
      />
    );
  }

  if (f.key.includes("phone") || f.key.includes("mobile") || f.key.includes("whatsapp") || f.type === "tel") {
    const displayVal = value ? String(value).replace(/^\+91\s?/, "") : "";
    return (
      <div className="flex">
        <span className="inline-flex items-center px-3 border border-r-0 border-border bg-muted text-muted-foreground text-sm font-semibold select-none">
          +91
        </span>
        <input
          type="tel"
          value={displayVal}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
            setField(f.key, digits ? `+91 ${digits}` : "");
          }}
          className={baseClass}
          placeholder={f.placeholder || "98765 43210"}
        />
      </div>
    );
  }

  switch (f.type) {
    case "textarea":
      return <textarea value={value || ""} onChange={(e) => setField(f.key, e.target.value)} rows={4} className={baseClass} placeholder={f.placeholder} />;
    case "select":
      return (
        <select value={value || ""} onChange={(e) => setField(f.key, e.target.value)} className={baseClass}>
          <option value="">પસંદ કરો</option>
          {f.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    case "number":
      return <input type="number" value={value ?? ""} onChange={(e) => setField(f.key, e.target.value === "" ? "" : Number(e.target.value))} className={baseClass} placeholder={f.placeholder} />;
    case "date":
      return <input type="date" value={value || ""} onChange={(e) => setField(f.key, e.target.value)} className={baseClass} />;
    case "boolean":
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={!!value} onChange={(e) => setField(f.key, e.target.checked)} className="w-4 h-4 accent-[#7a1d1d]" />
          <span className="text-sm">{f.checkLabel || "હા"}</span>
        </label>
      );
    case "file":
      return <FileUpload value={value} onChange={(url) => setField(f.key, url)} onUploadingChange={setUploadingFile} accept={f.accept || "image/*"} />;
    case "rich":
      return <textarea value={value || ""} onChange={(e) => setField(f.key, e.target.value)} rows={6} className={baseClass} placeholder={f.placeholder} />;
    default:
      return <input type="text" value={value || ""} onChange={(e) => setField(f.key, e.target.value)} className={baseClass} placeholder={f.placeholder} />;
  }
}