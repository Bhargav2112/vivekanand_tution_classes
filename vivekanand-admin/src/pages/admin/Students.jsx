import React, { useMemo } from "react";
import CrudModule from "@/components/admin/shared/CrudModule";
import { useEntityData } from "@/components/admin/shared/useEntityData";

const STATUS_OPTS = [
  { value: "active", label: "સક્રિય" },
  { value: "inactive", label: "નિષ્ક્રિય" },
  { value: "graduated", label: "સમાપ્ત" },
];

export default function Students() {
  const { items: courses } = useEntityData("Course");
  const { items: batches } = useEntityData("Batch");

  const courseMap = useMemo(() => {
    const map = {};
    courses.forEach(c => {
      if (c._id) map[c._id] = c.name;
      if (c.id) map[c.id] = c.name;
    });
    return map;
  }, [courses]);

  const batchMap = useMemo(() => {
    const map = {};
    batches.forEach(b => {
      if (b._id) map[b._id] = b.name;
      if (b.id) map[b.id] = b.name;
    });
    return map;
  }, [batches]);

  const courseOptions = useMemo(() => {
    const opts = [];
    courses.forEach(c => {
      opts.push({ value: c._id || c.id, label: c.name });
      if (c.name && c.name !== (c._id || c.id)) {
        opts.push({ value: c.name, label: c.name });
      }
    });
    return opts;
  }, [courses]);

  const batchOptions = useMemo(() => {
    return batches.map(b => ({ value: b._id || b.id, label: b.name }));
  }, [batches]);

  return (
    <CrudModule
      entityName="Student"
      title="વિદ્યાર્થીઓ"
      description="બધા વિદ્યાર્થીઓની સૂચિ"
      searchFields={["name", "course", "batch", "mobile", "parent_name"]}
      columns={[
        {
          key: "name",
          label: "વિદ્યાર્થી પ્રોફાઇલ કાર્ડ",
          sortable: true,
          render: (row) => (
            <div className="flex items-center gap-3 py-1">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#7a1d1d]/30 bg-muted shrink-0 shadow-sm">
                {row.photo_url ? (
                  <img src={row.photo_url} alt={row.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#7a1d1d] text-white font-bold text-base">
                    {row.name ? row.name.charAt(0).toUpperCase() : "S"}
                  </div>
                )}
              </div>
              <div>
                <div className="font-bold text-[#7a1d1d] text-[14px] leading-tight">{row.name}</div>
                {row.roll_no ? (
                  <div className="text-[11px] text-muted-foreground mt-0.5">રોલ નં: #{row.roll_no}</div>
                ) : (
                  <div className="text-[11px] text-muted-foreground mt-0.5">વિદ્યાર્થી</div>
                )}
              </div>
            </div>
          )
        },
        { key: "course", label: "કોર્સ", sortable: true, render: (row) => courseMap[row.course] || row.course || "—" },
        { key: "batch", label: "બેચ", render: (row) => batchMap[row.batch] || row.batch || "—" },
        { key: "mobile", label: "મોબાઈલ" },
        { key: "parent_name", label: "વાલી" },
        { key: "admission_status", label: "સ્ટેટસ", type: "status", sortable: true },
      ]}
      formFields={[
        { key: "name", label: "વિદ્યાર્થીનું નામ", required: true },
        { key: "photo_url", label: "ફોટો", type: "file" },
        { key: "course", label: "કોર્સ", required: true, type: "select", options: courseOptions },
        { key: "batch", label: "બેચ", type: "select", options: batchOptions },
        { key: "roll_no", label: "રોલ નંબર" },
        { key: "mobile", label: "મોબાઈલ" },
        { key: "parent_name", label: "વાલીનું નામ" },
        { key: "parent_mobile", label: "વાલીનો મોબાઈલ" },
        { key: "address", label: "સરનામું", fullWidth: true, type: "textarea" },
        { key: "admission_status", label: "સ્ટેટસ", type: "select", options: STATUS_OPTS },
      ]}
    />
  );
}