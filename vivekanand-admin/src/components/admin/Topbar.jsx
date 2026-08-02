import React from "react";
import { Menu } from "lucide-react";

export default function Topbar({ onToggleSidebar, title = "ડેશબોર્ડ" }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border">
      <div className="flex items-center justify-between gap-4 px-4 lg:px-6 h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5 text-[#7a1d1d]" />
          </button>
          <h1 className="text-lg font-bold text-[#7a1d1d] hidden sm:block">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3 lg:gap-4">
          {/* Profile */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-border">
            <div className="w-9 h-9 bg-[#7a1d1d] text-white flex items-center justify-center font-bold text-sm">
              A
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-semibold">Admin</div>
              <div className="text-[11px] text-muted-foreground">Super Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}