import React from "react";
import { Link } from "react-router-dom";

const STATUS_STYLES = {
  pending: { bg: "#fcd34d", text: "#78350f", label: "પેન્ડિંગ" },
  approved: { bg: "#34d399", text: "#064e3b", label: "મંજૂર" },
  rejected: { bg: "#fca5a5", text: "#7f1d1d", label: "રિજેક્ટ" },
};

export default function RecentAdmissions({ admissions = [] }) {
  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#7a1d1d]">તાજા પ્રવેશ</h3>
        <Link to="/admissions" className="admin-btn admin-btn-outline text-xs px-3 py-1.5">બધા જુઓ</Link>
      </div>
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#7a1d1d] text-white text-left">
              <th className="px-5 py-2.5 font-semibold">વિદ્યાર્થીનું નામ</th>
              <th className="px-5 py-2.5 font-semibold">કોર્સ</th>
              <th className="px-5 py-2.5 font-semibold">મોબાઈલ</th>
              <th className="px-5 py-2.5 font-semibold">તારીખ</th>
              <th className="px-5 py-2.5 font-semibold">સ્ટેટસ</th>
            </tr>
          </thead>
          <tbody>
            {admissions.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">કોઈ પ્રવેશ નથી</td></tr>
            ) : (
              admissions.map((row, idx) => {
                const st = STATUS_STYLES[row.status] || STATUS_STYLES.pending;
                return (
                  <tr key={row._id || row.id || idx} className="border-b border-border hover:bg-muted/40">
                    <td className="px-5 py-3 font-medium">{row.student_name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{row.course}</td>
                    <td className="px-5 py-3 text-muted-foreground">{row.mobile}</td>
                    <td className="px-5 py-3 text-muted-foreground">{row.admission_date ? new Date(row.admission_date).toLocaleDateString("gu-IN") : new Date(row.createdAt || row.created_date || Date.now()).toLocaleDateString("gu-IN")}</td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 text-xs font-semibold inline-block" style={{ backgroundColor: st.bg, color: st.text }}>{st.label}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}