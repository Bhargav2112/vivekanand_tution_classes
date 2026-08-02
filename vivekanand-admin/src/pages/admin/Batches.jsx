import React, { useMemo } from "react";
import CrudModule from "@/components/admin/shared/CrudModule";
import { useEntityData } from "@/components/admin/shared/useEntityData";

const ICON_OPTS = [
  { value: "Clock", label: "Clock (ઘડિયાળ)" },
  { value: "Calendar", label: "Calendar (કેલેન્ડર)" },
  { value: "Sun", label: "Sun (દિવસ)" },
  { value: "Moon", label: "Moon (રાત્રિ)" },
];

const STATUS_OPTS = [
  { value: "true", label: "સક્રિય" },
  { value: "false", label: "નિષ્ક્રિય" },
];

export default function Batches() {
  const { items: courses } = useEntityData("Course");

  const courseMap = useMemo(() => {
    const map = {};
    courses.forEach(c => {
      if (c._id) map[c._id] = c.name;
      if (c.id) map[c.id] = c.name;
    });
    return map;
  }, [courses]);

  const courseOptions = useMemo(() => {
    return courses.map(c => ({ value: c._id || c.id, label: c.name }));
  }, [courses]);

  return (
    <CrudModule
      entityName="Batch"
      title="બેચ"
      description="અભ્યાસક્રમ વાઇઝ બેચ અને તેના સમયનું સંચાલન કરો"
      searchFields={["name", "time", "desc"]}
      columns={[
        { key: "name", label: "બેચ નામ", sortable: true },
        { key: "time", label: "સમય", sortable: true },
        { key: "desc", label: "બેચ વિગત" },
        { key: "course", label: "અભ્યાસક્રમ (કોર્સ)", render: (row) => courseMap[row.course] || "—" },
        { key: "icon", label: "આઇકોન" },
        { key: "isActive", label: "સ્ટેટસ", render: (row) => row.isActive ? "🟢 સક્રિય" : "🔴 નિષ્ક્રિય" },
      ]}
      formFields={[
        { key: "name", label: "બેચ નામ *", required: true, placeholder: "દા.ત. નવોદય સવારની બેચ" },
        { key: "time", label: "સમય (Time) *", required: true, placeholder: "દા.ત. સવારે ૭:૦૦ થી ૯:૦૦" },
        { key: "desc", label: "બેચ વિગત / વર્ણન *", required: true, fullWidth: true, type: "textarea", placeholder: "બેચ વિશે ટૂંકી વિગત..." },
        { key: "course", label: "સંબંધિત કોર્સ (અભ્યાસક્રમ)", type: "select", options: courseOptions },
        { key: "icon", label: "આઇકોન (Icon)", type: "select", options: ICON_OPTS },
        { key: "isActive", label: "સ્ટેટસ", type: "select", options: STATUS_OPTS },
      ]}
    />
  );
}