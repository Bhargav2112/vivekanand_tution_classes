import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";

const STATUS_OPTS = [
  { value: "active", label: "સક્રિય" },
  { value: "inactive", label: "નિષ્ક્રિય" },
];

export default function Courses() {
  return (
    <CrudModule
      entityName="Course"
      title="અભ્યાસક્રમ"
      description="કોર્સ બનાવો અને મેનેજ કરો"
      searchFields={["name", "duration", "eligibility"]}
      columns={[
        { key: "image_url", label: "ઈમેજ", type: "image" },
        { key: "name", label: "કોર્સ નામ", sortable: true },
        { key: "duration", label: "સમયગાળો" },
        { key: "fees", label: "ફી", type: "currency", sortable: true },
        { key: "display_order", label: "ઓર્ડર", type: "number", sortable: true },
        { key: "status", label: "સ્ટેટસ", type: "status", sortable: true },
      ]}
      formFields={[
        { key: "name", label: "કોર્સ નામ", required: true },
        { key: "short", label: "ટૂંકું નામ (Short Code)" },
        { key: "badge", label: "બેજ (Badge text)" },
        { key: "image_url", label: "ઈમેજ", type: "file" },
        { key: "description", label: "વર્ણન", fullWidth: true, type: "textarea" },
        { key: "eligibility", label: "લાયકાત / લઘુત્તમ ધોરણ" },
        { key: "grade", label: "ધોરણ (કોષ્ટક માટે - દા.ત. ધોરણ 5)" },
        { key: "duration", label: "સમયગાળો" },
        { key: "classes", label: "બેચ કલાકો/દિવસો (Classes)" },
        { key: "fees", label: "ફી", type: "number" },
        { key: "has_weekly_test", label: "સાપ્તાહિક ટેસ્ટ છે?", type: "select", options: [
          { value: "true", label: "હા (Yes)" },
          { value: "false", label: "ના (No)" }
        ]},
        { key: "has_study_material", label: "નોંધપોથી / સાહિત્ય છે?", type: "select", options: [
          { value: "true", label: "હા (Yes)" },
          { value: "false", label: "ના (No)" }
        ]},
        { key: "has_personal_guidance", label: "વ્યક્તિગત માર્ગદર્શન છે?", type: "select", options: [
          { value: "true", label: "હા (Yes)" },
          { value: "false", label: "ના (No)" }
        ]},
        { key: "features", label: "લક્ષણો (અલ્પવિરામ અથવા નવી લાઇનથી નવો મુદ્દો)", fullWidth: true, type: "textarea" },
        { key: "display_order", label: "ડિસ્પ્લે ઓર્ડર", type: "number" },
        { key: "status", label: "સ્ટેટસ", type: "select", options: STATUS_OPTS },
      ]}
    />
  );
}