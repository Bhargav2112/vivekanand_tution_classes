import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";

const STATUS_OPTS = [
  { value: "upcoming", label: "આગામી" },
  { value: "past", label: "પૂર્વ" },
  { value: "cancelled", label: "રદ થયેલ" },
];

export default function Events() {
  return (
    <CrudModule
      entityName="Event"
      title="કાર્યક્રમો"
      description="આગામી અને પૂર્વ કાર્યક્રમો"
      searchFields={["title", "description"]}
      columns={[
        { key: "banner_url", label: "બેનર", type: "image" },
        { key: "title", label: "શીર્ષક", sortable: true },
        { key: "date", label: "તારીખ", type: "date", sortable: true },
        { key: "time", label: "સમય" },
        { key: "status", label: "સ્ટેટસ", type: "status", sortable: true },
      ]}
      formFields={[
        { key: "title", label: "શીર્ષક", required: true },
        { key: "banner_url", label: "બેનર", type: "file" },
        { key: "description", label: "વર્ણન", fullWidth: true, type: "textarea" },
        { key: "date", label: "તારીખ", type: "date", required: true },
        { key: "time", label: "સમય" },
        { key: "registration_link", label: "રજિસ્ટ્રેશન લિંક", fullWidth: true },
        { key: "status", label: "સ્ટેટસ", type: "select", options: STATUS_OPTS },
      ]}
    />
  );
}