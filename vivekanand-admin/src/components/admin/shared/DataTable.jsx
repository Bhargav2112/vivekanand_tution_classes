import React, { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

const PAGE_SIZE = 10;

export default function DataTable({
  columns,
  items,
  loading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onRowAction,
  actions = [],
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sortKey) return items;
    const sortedItems = [...items].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number") return av - bv;
      return String(av).localeCompare(String(bv), "gu");
    });
    return sortDir === "asc" ? sortedItems : sortedItems.reverse();
  }, [items, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = sorted.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const allSelected = pageItems.length > 0 && pageItems.every((it) => selectedIds?.includes(it.id || it._id));

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#7a1d1d] text-white text-left">
              {onToggleSelect && (
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => onToggleSelectAll(pageItems)}
                    className="w-4 h-4 accent-[#f59e0b]"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold whitespace-nowrap">
                  {col.sortable ? (
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="flex items-center gap-1 hover:text-[#f59e0b]"
                    >
                      {col.label}
                      {sortKey === col.key ? (
                        sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-50" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              {actions.length > 0 && <th className="px-4 py-3 font-semibold text-right">ક્રિયા</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-10 text-center text-muted-foreground">
                  લોડ થઈ રહ્યું છે...
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-10 text-center text-muted-foreground">
                  કોઈ ડેટા મળ્યો નથી
                </td>
              </tr>
            ) : (
              pageItems.map((row, idx) => {
                const rowId = row.id || row._id || `row-${idx}`;
                return (
                  <tr key={rowId} className="border-b border-border hover:bg-muted/40">
                    {onToggleSelect && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds?.includes(rowId) || false}
                          onChange={() => onToggleSelect(rowId)}
                          className="w-4 h-4 accent-[#f59e0b]"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        {col.render ? col.render(row) : renderCell(col, row[col.key])}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {actions.map((act) => {
                          const Icon = act.icon;
                          return (
                            <button
                              key={act.label}
                              onClick={() => onRowAction(act.label, row)}
                              title={act.label}
                              className="p-1.5 hover:bg-muted transition-colors"
                              style={{ color: act.color || "#7a1d1d" }}
                            >
                              <Icon className="w-4 h-4" />
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {sorted.length > PAGE_SIZE && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-sm">
          <div className="text-muted-foreground">
            {sorted.length} માંથી {(current - 1) * PAGE_SIZE + 1}–{Math.min(current * PAGE_SIZE, sorted.length)}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={current === 1}
              className="p-1.5 border border-border disabled:opacity-40 hover:bg-muted"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              {current} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={current === totalPages}
              className="p-1.5 border border-border disabled:opacity-40 hover:bg-muted"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function renderCell(col, value) {
  if (value == null || value === "") return <span className="text-muted-foreground">—</span>;
  if (col.key === "display_order" || col.key === "order") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-[#7a1d1d]/10 text-[#7a1d1d] border border-[#7a1d1d]/20">
        #{value}
      </span>
    );
  }
  if (col.type === "status") return <StatusPill value={value} />;
  if (col.type === "image" && value) {
    return <img src={value} alt="" className="w-10 h-10 object-cover" />;
  }
  if (col.type === "boolean") return value ? "હા" : "ના";
  if (col.type === "date") return new Date(value).toLocaleDateString("gu-IN");
  if (col.type === "currency") return `₹${Number(value).toLocaleString("en-IN")}`;
  if (typeof value === "object") {
    return value.name || value.title || String(value._id || value.id || "[Object]");
  }
  return String(value);
}

function StatusPill({ value }) {
  const map = {
    pending: { bg: "#fcd34d", text: "#78350f", label: "પેન્ડિંગ" },
    approved: { bg: "#34d399", text: "#064e3b", label: "મંજૂર" },
    rejected: { bg: "#fca5a5", text: "#7f1d1d", label: "રિજેક્ટ" },
    active: { bg: "#34d399", text: "#064e3b", label: "સક્રિય" },
    inactive: { bg: "#e5e7eb", text: "#374151", label: "નિષ્ક્રિય" },
    new: { bg: "#fcd34d", text: "#78350f", label: "નવું" },
    read: { bg: "#93c5fd", text: "#1e3a8a", label: "વાંચેલ" },
    replied: { bg: "#34d399", text: "#064e3b", label: "જવાબ આપેલ" },
    draft: { bg: "#e5e7eb", text: "#374151", label: "ડ્રાફ્ટ" },
    published: { bg: "#34d399", text: "#064e3b", label: "પ્રકાશિત" },
    upcoming: { bg: "#fcd34d", text: "#78350f", label: "આગામી" },
    past: { bg: "#e5e7eb", text: "#374151", label: "પૂર્વ" },
    paid: { bg: "#34d399", text: "#064e3b", label: "ચૂકવેલ" },
    partial: { bg: "#fcd34d", text: "#78350f", label: "આંશિક" },
    graduated: { bg: "#93c5fd", text: "#1e3a8a", label: "સમાપ્ત" },
  };
  const s = map[value] || { bg: "#e5e7eb", text: "#374151", label: value };
  return (
    <span className="px-2.5 py-1 text-xs font-semibold inline-block" style={{ backgroundColor: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}