import React, { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { Link } from "react-router-dom";
import { UserPlus, BookPlus, Megaphone, ImagePlus, Video, Download, Youtube } from "lucide-react";

const MONTHS_GU = ["જાન્યુઆરી", "ફેબ્રુઆરી", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઈ", "ઓગસ્ટ", "સપ્ટે", "ઓક્ટો", "નવેમ્બર", "ડિસેમ્બર"];

const QUICK_LINKS = [
  { label: "નવો પ્રવેશ", icon: UserPlus, to: "/admissions", color: "#7a1d1d" },
  { label: "કોર્સ ઉમેરો", icon: BookPlus, to: "/courses", color: "#f59e0b" },
  { label: "જાહેરાત ઉમેરો", icon: Megaphone, to: "/notices", color: "#7a1d1d" },
  { label: "ગેલેરી અપલોડ", icon: ImagePlus, to: "/gallery", color: "#f59e0b" },
  { label: "યુટ્યુબ સિંક", icon: Youtube, to: "/youtube", color: "#7a1d1d" },
  { label: "રિપોર્ટ ડાઉનલોડ", icon: Download, to: "/", color: "#f59e0b" },
];

export default function ChartsSection({ admissions = [] }) {
  const lineData = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const count = admissions.filter((a) => {
        const ad = new Date(a.created_date);
        return ad.getMonth() === d.getMonth() && ad.getFullYear() === d.getFullYear();
      }).length;
      months.push({ month: MONTHS_GU[d.getMonth()], count });
    }
    return months;
  }, [admissions]);

  const courseData = useMemo(() => {
    const map = {};
    admissions.forEach((a) => {
      const c = a.course || "અન્ય";
      map[c] = (map[c] || 0) + 1;
    });
    const colors = ["#7a1d1d", "#f59e0b", "#b91c1c", "#d97706"];
    return Object.entries(map).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
  }, [admissions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="admin-card">
        <h3 className="font-bold text-[#7a1d1d] mb-4">પ્રવેશ ચાર્ટ (છેલ્લા 6 મહિના)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#999" />
            <YAxis tick={{ fontSize: 11 }} stroke="#999" />
            <Tooltip contentStyle={{ borderRadius: 0, border: "1px solid #7a1d1d" }} />
            <Line type="monotone" dataKey="count" stroke="#7a1d1d" strokeWidth={2.5} dot={{ fill: "#f59e0b", r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="admin-card">
        <h3 className="font-bold text-[#7a1d1d] mb-4">કોર્સ મુજબ વિદ્યાર્થી</h3>
        {courseData.length === 0 ? (
          <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">ડેટા ઉપલબ્ધ નથી</div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={courseData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2} dataKey="value">
                {courseData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 0, border: "1px solid #7a1d1d" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="admin-card">
        <h3 className="font-bold text-[#7a1d1d] mb-4">ઝડપી લિંક્સ</h3>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.to} className="flex flex-col items-center justify-center gap-2 p-4 border border-border hover:border-[#7a1d1d] hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: item.color }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-medium text-center leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}