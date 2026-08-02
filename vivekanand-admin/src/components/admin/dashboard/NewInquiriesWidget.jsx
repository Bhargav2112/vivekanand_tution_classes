import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, ArrowRight, MessageSquare } from "lucide-react";

export default function NewInquiriesWidget({ inquiries = [] }) {
  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-[#7a1d1d] text-base">નવી ઈન્ક્વાયરી</h3>
          <span className="bg-[#7a1d1d] text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
            {inquiries.length}
          </span>
        </div>
        <Link to="/contact-enquiry" className="admin-btn admin-btn-outline text-xs px-3 py-1.5 flex items-center gap-1">
          બધી જુઓ <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {inquiries.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm font-body">
            કોઈ નવી ઈન્ક્વાયરી નથી.
          </div>
        ) : (
          inquiries.slice(0, 5).map((item, idx) => (
            <div
              key={item._id || item.id || idx}
              className="p-3.5 border border-border bg-muted/30 hover:bg-muted/60 transition-colors flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-foreground">{item.name || item.student_name || "નવું આવેદન"}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#7a1d1d]" /> {item.phone || item.mobile || "—"}</span>
                    {item.subject && <span className="truncate max-w-[150px]">| {item.subject}</span>}
                  </div>
                </div>
                <span className="bg-[#fcd34d] text-[#78350f] text-[11px] font-bold px-2 py-0.5 shrink-0">
                  {item.status === 'new' ? 'નવું' : 'પેન્ડિંગ'}
                </span>
              </div>

              {item.message && (
                <div className="text-xs text-muted-foreground bg-white p-2 border border-border/60 flex items-start gap-1.5 line-clamp-2">
                  <MessageSquare className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{item.message}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
