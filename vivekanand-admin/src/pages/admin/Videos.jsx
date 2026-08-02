import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";

export default function Videos() {
  return (
    <CrudModule
      entityName="Video"
      title="વિડિઓ"
      description="યુટ્યુબ વિડિઓ મેનેજ કરો"
      searchFields={["title", "category"]}
      columns={[
        { key: "thumbnail_url", label: "થમ્બનેલ", type: "image" },
        { key: "title", label: "શીર્ષક", sortable: true },
        { key: "category", label: "કેટેગરી", sortable: true },
        { key: "youtube_url", label: "URL", render: (row) => <a href={row.youtube_url} target="_blank" rel="noreferrer" className="text-[#7a1d1d] hover:underline">જુઓ</a> },
        { key: "display_order", label: "ઓર્ડર", type: "number", sortable: true },
      ]}
      formFields={[
        { key: "title", label: "શીર્ષક", required: true },
        { key: "youtube_url", label: "યુટ્યુબ URL", required: true },
        { key: "thumbnail_url", label: "થમ્બનેલ", type: "file" },
        { key: "category", label: "કેટેગરી" },
        { key: "description", label: "વર્ણન", fullWidth: true, type: "textarea" },
        { key: "display_order", label: "ડિસ્પ્લે ઓર્ડર", type: "number" },
      ]}
    />
  );
}