import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";

export default function Results() {
  return (
    <CrudModule
      entityName="Result"
      title="પરિણામ"
      description="વિદ્યાર્થી રિઝલ્ટ મેનેજ કરો"
      searchFields={["student_name", "exam", "year"]}
      columns={[
        { key: "photo_url", label: "ફોટો", type: "image" },
        { key: "student_name", label: "વિદ્યાર્થી", sortable: true },
        { key: "exam", label: "પરીક્ષા", sortable: true },
        { key: "year", label: "વર્ષ", sortable: true },
        { key: "marks", label: "માર્ક્સ", type: "number", sortable: true },
        { key: "rank", label: "રેન્ક", type: "number", sortable: true },
        { key: "percentage", label: "ટકાવારી", type: "number", sortable: true },
        { key: "display_on_website", label: "વેબસાઈટ", type: "boolean" },
      ]}
      formFields={[
        { key: "student_name", label: "વિદ્યાર્થીનું નામ", required: true },
        { key: "photo_url", label: "ફોટો", type: "file" },
        { key: "exam", label: "પરીક્ષા", required: true, type: "select", options: [
          { value: "ધોરણ 10", label: "ધોરણ 10" },
          { value: "ધોરણ 12", label: "ધોરણ 12" },
          { value: "જવાહર નવોદય", label: "જવાહર નવોદય" },
          { value: "જ્ઞાન શક્તિ", label: "જ્ઞાન શક્તિ" },
          { value: "CET", label: "CET" },
          { value: "ધોરણ 6-9", label: "ધોરણ 6-9" },
          { value: "અન્ય", label: "અન્ય" }
        ]},
        { key: "year", label: "વર્ષ", type: "select", options: Array.from({length: 10}, (_, i) => ({ value: String(2026 - i), label: String(2026 - i) })) },
        { key: "marks", label: "માર્ક્સ", type: "number" },
        { key: "rank", label: "રેન્ક", type: "number" },
        { key: "percentage", label: "ટકાવારી", type: "number" },
        { key: "certificate_url", label: "સર્ટિફિકેટ", type: "file", accept: "application/pdf,image/*" },
        { key: "display_on_website", label: "વેબસાઈટ પર બતાવો", type: "boolean", checkLabel: "બતાવો" },
      ]}
    />
  );
}