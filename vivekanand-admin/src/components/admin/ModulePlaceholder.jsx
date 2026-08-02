import React from "react";

export default function ModulePlaceholder({ title, description }) {
  return (
    <div className="admin-card flex flex-col items-center justify-center text-center py-20">
      <div className="w-16 h-16 bg-[#7a1d1d] flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-[#7a1d1d]">{title}</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        {description || "આ મોડ્યુલ હવે બનશે. તે તમામ ડેટા અને સેટિંગ્સને ડેશબોર્ડથી જ મેનેજ કરી શકશો."}
      </p>
    </div>
  );
}