import React from "react";
import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";

const PRIORITY_DOT = { high: "#dc2626", medium: "#f59e0b", low: "#34d399" };

export default function TodayNotices({ notices = [] }) {
  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#7a1d1d]">તાજા જાહેરાતો</h3>
        <Link to="/notices" className="admin-btn admin-btn-outline text-xs px-3 py-1.5">બધા જુઓ</Link>
      </div>
      <div className="space-y-3">
        {notices.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">કોઈ જાહેરાત નથી</div>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} className="flex items-start gap-3 p-3 border border-border hover:bg-muted/40 transition-colors">
              <div className="w-9 h-9 bg-[#7a1d1d] flex items-center justify-center shrink-0">
                <Megaphone className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 inline-block shrink-0" style={{ backgroundColor: PRIORITY_DOT[notice.priority] || "#999" }} />
                  <p className="text-sm font-medium leading-snug">{notice.title}</p>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{new Date(notice.created_date).toLocaleDateString("gu-IN")}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}