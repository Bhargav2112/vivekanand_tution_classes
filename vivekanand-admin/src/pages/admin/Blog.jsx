import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";

const STATUS_OPTS = [
  { value: "draft", label: "ડ્રાફ્ટ" },
  { value: "published", label: "પ્રકાશિત" },
];

export default function Blog() {
  return (
    <CrudModule
      entityName="BlogPost"
      title="બ્લોગ"
      description="બ્લોગ પોસ્ટ મેનેજ કરો"
      searchFields={["title", "category", "slug"]}
      columns={[
        { key: "featured_image_url", label: "ઈમેજ", type: "image" },
        { key: "title", label: "શીર્ષક", sortable: true },
        { key: "category", label: "કેટેગરી", sortable: true },
        { key: "slug", label: "સ્લગ" },
        { key: "status", label: "સ્ટેટસ", type: "status", sortable: true },
      ]}
      formFields={[
        { key: "title", label: "શીર્ષક", required: true, fullWidth: true },
        { key: "slug", label: "સ્લગ" },
        { key: "category", label: "કેટેગરી" },
        { key: "featured_image_url", label: "ફીચર્ડ ઈમેજ", type: "file" },
        { key: "content", label: "કન્ટેન્ટ", required: true, fullWidth: true, type: "rich" },
        { key: "meta_title", label: "મેટા ટાઇટલ", fullWidth: true },
        { key: "meta_description", label: "મેટા ડિસ્ક્રિપ્શન", fullWidth: true, type: "textarea" },
        { key: "status", label: "સ્ટેટસ", type: "select", options: STATUS_OPTS },
      ]}
    />
  );
}