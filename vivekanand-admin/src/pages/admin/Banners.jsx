import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";

const STATUS_OPTS = [
  { value: "true", label: "સક્રિય" },
  { value: "false", label: "નિષ્ક્રિય" },
];

export default function Banners() {
  return (
    <CrudModule
      entityName="Banner"
      title="હોમ પેજ બેનર સ્લાઇડર"
      description="હોમ પેજ પર દેખાતા મલ્ટીપલ મુખ્ય બેનર સ્લાઇડર ફોટા મેનેજ કરો"
      searchFields={["title"]}
      columns={[
        { key: "image_url", label: "બેનર ફોટો", type: "image" },
        { key: "title", label: "શીર્ષક / હેડલાઇન", sortable: true },
        { key: "display_order", label: "ડિસ્પ્લે ક્રમ", type: "number", sortable: true },
        { key: "isActive", label: "સ્ટેટસ", render: (row) => row.isActive ? "🟢 સક્રિય" : "🔴 નિષ્ક્રિય" },
      ]}
      formFields={[
        { key: "title", label: "શીર્ષક / હેડલાઇન (ઓપ્શનલ)", placeholder: "દા.ત. નવોદય એડમિશન ઓપન ૨૦૨૬" },
        { key: "image_url", label: "બેનર છબી / ફોટો *", required: true, type: "file" },
        { key: "display_order", label: "ડિસ્પ્લે ક્રમ", type: "number" },
        { key: "isActive", label: "સ્ટેટસ", type: "select", options: STATUS_OPTS },
      ]}
    />
  );
}
