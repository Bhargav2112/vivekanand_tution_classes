import React, { useState, useMemo } from "react";
import { Plus, Search, Trash2, Pencil, Eye, FileSpreadsheet } from "lucide-react";
import { useEntityData } from "./useEntityData";
import DataTable from "./DataTable";
import FormModal from "./FormModal";
import ConfirmDialog from "./ConfirmDialog";
import { exportToCsv, exportToExcel } from "@/lib/export";

export default function CrudModule({
  entityName,
  title,
  description,
  columns,
  formFields,
  searchFields = [],
  exportColumns,
  rowActions = ["edit", "delete"],
  extraActions,
  filter = {},
  defaultValues = {},
}) {
  const { items, loading, create, update, remove, bulkDelete, bulkUpdate } = useEntityData(entityName);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewing, setViewing] = useState(null);

  const filtered = useMemo(() => {
    let result = items;
    // Apply hard filter
    if (Object.keys(filter).length > 0) {
      result = result.filter(item => {
        return Object.entries(filter).every(([k, v]) => item[k] === v);
      });
    }
    
    if (!search) return result;
    const q = search.toLowerCase();
    return result.filter((it) =>
      searchFields.some((f) => String(it[f] ?? "").toLowerCase().includes(q))
    );
  }, [items, search, searchFields, filter]);

  const toggleSelect = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleSelectAll = (pageItems) => {
    const pageIds = pageItems.map((it) => it.id);
    const allIn = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allIn ? prev.filter((id) => !pageIds.includes(id)) : [...new Set([...prev, ...pageIds])]
    );
  };

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    const finalValues = { ...defaultValues, ...values };
    const targetId = editing ? (editing.id || editing._id) : null;
    if (targetId) {
      await update(targetId, finalValues);
    } else {
      await create(finalValues);
    }
    setModalOpen(false);
  };

  const handleRowAction = (action, row) => {
    const rowId = row.id || row._id;
    if (action === "edit") openEdit(row);
    else if (action === "delete") setDeleteId(rowId);
    else if (action === "view") setViewing(row);
    else extraActions?.[action]?.(row);
  };

  const actionDefs = [];
  if (rowActions.includes("view")) actionDefs.push({ label: "view", icon: Eye, color: "#2563eb" });
  if (rowActions.includes("edit")) actionDefs.push({ label: "edit", icon: Pencil, color: "#7a1d1d" });
  if (rowActions.includes("delete")) actionDefs.push({ label: "delete", icon: Trash2, color: "#dc2626" });

  const expCols = exportColumns || columns.filter((c) => !c.type || c.type === "text" || c.type === "number" || c.type === "status");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#7a1d1d]">{title}</h2>
          {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => exportToExcel(entityName, filtered, expCols)} className="admin-btn admin-btn-outline text-sm">
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button onClick={openAdd} className="admin-btn admin-btn-primary text-sm">
            <Plus className="w-4 h-4" /> ઉમેરો
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 bg-[#7a1d1d] text-white px-4 py-2 text-sm">
          <span>{selectedIds.length} પસંદ થયેલ</span>
          <button onClick={() => setBulkDeleteIds([...selectedIds])} className="flex items-center gap-1 hover:text-[#f59e0b]">
            <Trash2 className="w-4 h-4" /> બલ્ક ડિલીટ
          </button>
          <button onClick={() => setSelectedIds([])} className="hover:text-[#f59e0b] ml-auto">
            રદ કરો
          </button>
        </div>
      )}

      {/* Search */}
      {searchFields.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="શોધો..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-border bg-white focus:outline-none focus:border-[#7a1d1d]"
          />
        </div>
      )}

      {/* Table */}
      <div className="admin-card !p-0 overflow-hidden">
        <DataTable
          columns={columns}
          items={filtered}
          loading={loading}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onRowAction={handleRowAction}
          actions={actionDefs}
        />
      </div>

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `${title} એડિટ કરો` : `${title} ઉમેરો`}
        fields={formFields}
        initialValues={editing}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="ડિલીટ કરી દો?"
        message="શું તમે ખરેખર આ રેકોર્ડ ડિલીટ કરવા માંગો છો? આ ક્રિયા પાછી નહીં થાય."
        onConfirm={async () => {
          await remove(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />

      <ConfirmDialog
        open={!!bulkDeleteIds}
        title="બલ્ક ડિલીટ"
        message={`શું તમે ${bulkDeleteIds?.length || 0} રેકોર્ડ ડિલીટ કરવા માંગો છો?`}
        onConfirm={async () => {
          await bulkDelete(bulkDeleteIds);
          setBulkDeleteIds(null);
          setSelectedIds([]);
        }}
        onCancel={() => setBulkDeleteIds(null)}
      />

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setViewing(null)}>
          <div className="bg-white w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 bg-[#7a1d1d] text-white">
              <h3 className="font-bold">વિગત</h3>
              <button type="button" onClick={() => setViewing(null)} className="hover:text-[#f59e0b]">✕</button>
            </div>
            <div className="p-5 space-y-2">
              {columns.map((c) => (
                <div key={c.key} className="flex gap-2 text-sm border-b border-border pb-2">
                  <span className="font-semibold w-1/3 text-muted-foreground">{c.label}:</span>
                  <span className="flex-1">{String(viewing[c.key] ?? "—")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}