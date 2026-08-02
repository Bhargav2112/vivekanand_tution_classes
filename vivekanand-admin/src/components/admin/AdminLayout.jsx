import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const TITLES = {
  "/": "ડેશબોર્ડ",
  "/admissions": "વિદ્યાર્થી પ્રવેશ",
  "/students": "વિદ્યાર્થીઓ",
  "/teachers": "શિક્ષકો",
  "/courses": "અભ્યાસક્રમ",
  "/batches": "બેચ",
  "/results": "પરિણામ",
  "/gallery": "ગેલેરી",
  "/youtube": "યુટ્યુબ સિંક (YouTube Sync)",
  "/notices": "જાહેરાતો",
  "/events": "કાર્યક્રમો",
  "/testimonials": "વાલીઓના અભિપ્રાય",
  "/faq": "FAQ",
  "/contact-enquiry": "Contact Enquiry",
  "/pages": "Website Pages",
  "/seo": "SEO",
  "/settings": "Settings",
  "/admin-users": "Admin Users",
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const title = TITLES[pathname] || "Admin";

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          title={title}
        />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
        <footer className="bg-white border-t border-border px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© 2025 વિવેકાનંદ ટ્યુશન ક્લાસીસ. સર્વ હક્ક સહિલ.</div>
          <div>Powered by Vivekanand Classes</div>
        </footer>
      </div>
    </div>
  );
}