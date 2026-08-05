import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";

const STATUS_OPTS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function Toppers() {
  return (
    <CrudModule
      entityName="Topper"
      title="Toppers"
      description="Manage top performing students to show on Homepage slider"
      searchFields={["name", "standard", "year"]}
      columns={[
        { key: "photo_url", label: "Photo", type: "image" },
        { key: "name", label: "Student Name", sortable: true },
        { key: "percentage", label: "Result", sortable: true },
        { key: "year", label: "Year", sortable: true },
        { key: "status", label: "Status", type: "status", sortable: true },
      ]}
      formFields={[
        { key: "name", label: "Student Name", required: true },
        { key: "photo_url", label: "Student Photo", type: "file", accept: "image/*", required: true },
        { key: "standard", label: "Standard / Course", required: true },
        { key: "year", label: "Year (e.g. 2024)", required: true },
        { key: "percentage", label: "Percentage / Marks", required: true },
        { key: "rank", label: "Rank (e.g. 1st in Gujarat)" },
        { key: "achievement", label: "Achievement Details", type: "textarea", fullWidth: true },
        { key: "order", label: "Display Order", type: "number", defaultValue: 0 },
        { key: "isActive", label: "Active in Slider", type: "boolean", defaultValue: true },
        { key: "status", label: "Status", type: "select", options: STATUS_OPTS, defaultValue: "active" },
      ]}
    />
  );
}
