import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";

export default function ShortVideos() {
  return (
    <CrudModule
      entityName="ShortVideo"
      title="શોર્ટ્સ વિડિઓ"
      description="યુટ્યુબ શોર્ટ્સ વિડિઓ મેનેજ કરો"
      searchFields={["title", "category"]}
      columns={[
        { key: "thumbnail_url", label: "થમ્બનેલ", type: "image" },
        { key: "title", label: "શીર્ષક", sortable: true },
        { key: "youtube_url", label: "URL", render: (row) => <a href={row.youtube_url} target="_blank" rel="noreferrer" className="text-[#7a1d1d] hover:underline">જુઓ</a> }
      ]}
      formFields={[
        { key: "title", label: "શીર્ષક / નામ", required: true, placeholder: "વિડિઓ નું નામ" },
        { key: "youtube_url", label: "યુટ્યુબ શોર્ટ્સ URL", required: true, placeholder: "https://youtube.com/shorts/..." }
      ]}
    />
  );
}
