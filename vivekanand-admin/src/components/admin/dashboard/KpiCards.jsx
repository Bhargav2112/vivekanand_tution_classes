import React from "react";
import { Link } from "react-router-dom";

const ICONS = {
  UserPlus: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM22 11h-6M19 8v6",
  Users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  Clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  GraduationCap: "M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1 2 3 6 3s6-2 6-3v-5",
  BookOpen: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  School: "M14 22v-4a2 2 0 0 0-4 0v4M18 12l4 2v4M12 2L2 7l10 5 10-5-10-5zM18 7v5",
  Image: "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21",
  Video: "M23 7l-7 5 7 5V7zM14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z",
};

const KPIS = [
  { key: "todayAdmissions", label: "આજના પ્રવેશ", icon: "UserPlus", color: "#7a1d1d", link: "/admissions" },
  { key: "monthlyAdmissions", label: "માસિક પ્રવેશ", icon: "Users", color: "#f59e0b", link: "/admissions" },
  { key: "pendingAdmissions", label: "પેન્ડિંગ પ્રવેશ", icon: "Clock", color: "#7a1d1d", link: "/admissions" },
  { key: "totalStudents", label: "કુલ વિદ્યાર્થીઓ", icon: "GraduationCap", color: "#f59e0b", link: "/students" },
  { key: "activeCourses", label: "સક્રિય કોર્સ", icon: "BookOpen", color: "#7a1d1d", link: "/courses" },
  { key: "teachers", label: "શિક્ષકો", icon: "School", color: "#f59e0b", link: "/teachers" },
  { key: "galleryImages", label: "ગેલેરી ઈમેજ", icon: "Image", color: "#7a1d1d", link: "/gallery" },
  { key: "videos", label: "વિડિઓ", icon: "Video", color: "#f59e0b", link: "/videos" },
];

export default function KpiCards({ counts = {} }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {KPIS.map((kpi) => (
        <div key={kpi.label} className="admin-card flex items-center gap-4 hover:border-[#7a1d1d] transition-colors">
          <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ backgroundColor: kpi.color }}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d={ICONS[kpi.icon]} />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-bold text-[#7a1d1d] leading-none">{counts[kpi.key] ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1 truncate">{kpi.label}</div>
            <Link to={kpi.link} className="text-[11px] text-[#f59e0b] font-semibold hover:underline mt-1 inline-block">
              વિગત જુઓ →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}