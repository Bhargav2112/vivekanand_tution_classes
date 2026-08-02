import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";

const STATUS_OPTS = [
  { value: "true", label: "સક્રિય" },
  { value: "false", label: "નિષ્ક્રિય" },
];

export default function FAQ() {
  return (
    <CrudModule
      entityName="FAQ"
      title="FAQ"
      description="વારંવાર પૂછાતા પ્રશ્નો"
      searchFields={["q", "a"]}
      columns={[
        { key: "q", label: "પ્રશ્ન", sortable: true },
        { key: "a", label: "જવાબ" },
        { key: "isActive", label: "સ્ટેટસ", render: (row) => row.isActive ? "🟢 સક્રિય" : "🔴 નિષ્ક્રિય" },
      ]}
      formFields={[
        { key: "q", label: "પ્રશ્ન *", required: true, fullWidth: true, placeholder: "પ્રશ્ન પૂછો..." },
        { key: "a", label: "જવાબ *", required: true, fullWidth: true, type: "textarea", placeholder: "જવાબ લખો..." },
        { key: "isActive", label: "સ્ટેટસ", type: "select", options: STATUS_OPTS },
      ]}
    />
  );
}