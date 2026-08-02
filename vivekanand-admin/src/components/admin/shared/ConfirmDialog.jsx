import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ open, title, message, confirmLabel = "ડિલીટ", onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white w-full max-w-md">
        <div className="flex items-center gap-3 px-5 py-4 bg-[#7a1d1d] text-white">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-bold">{title}</h3>
        </div>
        <div className="p-5">
          <p className="text-sm text-muted-foreground">{message}</p>
          <div className="flex justify-end gap-3 mt-5">
            <button type="button" onClick={onCancel} className="admin-btn admin-btn-outline">
              રદ કરો
            </button>
            <button type="button" onClick={onConfirm} className="admin-btn bg-red-600 text-white hover:bg-red-700">
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}