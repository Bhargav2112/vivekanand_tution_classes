import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, UserPlus, Users, GraduationCap, BookOpen,
  CalendarDays, Trophy, Image as ImageIcon, Video, Megaphone,
  CalendarClock, MessageSquareHeart, HelpCircle, Mail, FileText,
  Search, Settings, ShieldCheck, LogOut, X, School, Youtube
} from "lucide-react";
import { api } from "@/api/axios";

const NAV_ITEMS = [
  { to: "/", label: "ડેશબોર્ડ", icon: LayoutDashboard },
  { to: "/admissions", label: "વિદ્યાર્થી પ્રવેશ", icon: UserPlus },
  { to: "/students", label: "વિદ્યાર્થીઓ", icon: Users },
  { to: "/teachers", label: "શિક્ષકો", icon: GraduationCap },
  { to: "/courses", label: "અભ્યાસક્રમ", icon: BookOpen },
  { to: "/batches", label: "બેચ", icon: CalendarDays },
  { to: "/results", label: "પરિણામ", icon: Trophy },
  { to: "/gallery", label: "ગેલેરી", icon: ImageIcon },
  { to: "/youtube", label: "યુટ્યુબ સિંક", icon: Youtube },
  { to: "/notices", label: "જાહેરાતો", icon: Megaphone },
  { to: "/testimonials", label: "વાલીઓના અભિપ્રાય", icon: MessageSquareHeart },
  { to: "/faq", label: "FAQ", icon: HelpCircle },
  { to: "/contact-enquiry", label: "ઈન્ક્વાયરી / સંપર્ક", icon: Mail },
  { to: "/banners", label: "હોમ બેનર સ્લાઇડર", icon: ImageIcon },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch(e){}
    navigate("/login");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#7a1d1d] text-white flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/15 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full border border-[#f59e0b] overflow-hidden bg-white/10 shrink-0">
              <img src="/logo.png" alt="વિવેકાનંદ" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-[15px]">વિવેકાનંદ</div>
              <div className="text-[11px] text-white/70">ટ્યુશન ક્લાસીસ</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors border-l-[3px] ${
                    isActive
                      ? "bg-white/15 text-white border-[#f59e0b]"
                      : "text-white/75 border-transparent hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/15 p-3 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-[13px] font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}