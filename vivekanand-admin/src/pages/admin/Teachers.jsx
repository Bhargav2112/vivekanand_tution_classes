import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";

const STATUS_OPTS = [
  { value: "active", label: "સક્રિય" },
  { value: "inactive", label: "નિષ્ક્રિય" },
];

export default function Teachers() {
  return (
    <CrudModule
      entityName="Teacher"
      title="શિક્ષકો"
      description="શિક્ષકોની પ્રોફાઇલ મેનેજ કરો"
      searchFields={["name", "subject", "qualification"]}
      columns={[
        { key: "photo_url", label: "ફોટો", type: "image" },
        { key: "name", label: "નામ", sortable: true },
        { key: "subject", label: "વિષય", sortable: true },
        { key: "qualification", label: "લાયકાત" },
        { key: "experience", label: "અનુભવ" },
        { key: "display_order", label: "ઓર્ડર", type: "number", sortable: true },
        { key: "status", label: "સ્ટેટસ", type: "status", sortable: true },
      ]}
      formFields={[
        { key: "name", label: "શિક્ષકનું નામ", required: true },
        { key: "photo_url", label: "ફોટો", type: "file" },
        { key: "subject", label: "વિષય", required: true },
        { key: "qualification", label: "લાયકાત" },
        { key: "experience", label: "અનુભવ" },
        { key: "description", label: "વર્ણન", fullWidth: true, type: "textarea" },
        { key: "display_order", label: "ડિસ્પ્લે ઓર્ડર", type: "number" },
        { key: "status", label: "સ્ટેટસ", type: "select", options: STATUS_OPTS },
      ]}
    />
  );
}