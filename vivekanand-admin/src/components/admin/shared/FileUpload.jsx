import React, { useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { api } from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";

export default function FileUpload({ value, onChange, onUploadingChange, accept = "image/*" }) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    if (onUploadingChange) onUploadingChange(true);
    try {
      const formData = new FormData();
      // Our backend expects the field name to be 'image' for single image upload
      formData.append("image", file);
      
      const res = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // The backend returns data.url for Cloudinary url
      if (res.data?.url) {
        onChange(res.data.url);
        toast({ title: "ફાઈલ અપલોડ સફળ રહી" });
      } else {
         throw new Error("અપલોડ નિષ્ફળ");
      }
    } catch (err) {
      console.error(err);
      toast({ title: "ફાઈલ અપલોડમાં ભૂલ", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (onUploadingChange) onUploadingChange(false);
    }
  };

  return (
    <div>
      {value && (
        <div className="relative inline-block mb-2 mt-2">
          <img src={value} alt="preview" className="w-24 h-24 object-cover border border-border rounded-md" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 bg-red-600 text-white p-0.5 rounded-full hover:bg-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-border cursor-pointer hover:bg-muted/50 text-sm w-fit rounded-md transition-colors">
        {uploading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Upload className="w-4 h-4 text-primary" />}
        {uploading ? "અપલોડ થઈ રહ્યું..." : value ? "બદલો" : "ફાઈલ અપલોડ કરો"}
        <input type="file" accept={accept} onChange={handleFile} className="hidden" disabled={uploading} />
      </label>
    </div>
  );
}