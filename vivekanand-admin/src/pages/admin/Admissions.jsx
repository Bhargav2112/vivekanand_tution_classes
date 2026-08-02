import React, { useMemo } from "react";
import CrudModule from "@/components/admin/shared/CrudModule";
import { useEntityData } from "@/components/admin/shared/useEntityData";

const STATUS_OPTS = [
  { value: "pending", label: "પેન્ડિંગ" },
  { value: "approved", label: "મંજૂર" },
  { value: "rejected", label: "રિજેક્ટ" },
];
const PAY_OPTS = [
  { value: "pending", label: "પેન્ડિંગ" },
  { value: "paid", label: "ચૂકવેલ" },
  { value: "partial", label: "આંશિક" },
];

export default function Admissions() {
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
    const opts = [];
    courses.forEach(c => {
      opts.push({ value: c._id || c.id, label: c.name });
      if (c.name && c.name !== (c._id || c.id)) {
        opts.push({ value: c.name, label: c.name });
      }
    });
    return opts;
  }, [courses]);

  return (
    <CrudModule
      entityName="Admission"
      title="વિદ્યાર્થી પ્રવેશ"
      description="બધા પ્રવેશ અરજીઓ મેનેજ કરો"
      searchFields={["student_name", "course", "mobile", "parent_name"]}
      columns={[
        { key: "student_name", label: "વિદ્યાર્થીનું નામ", sortable: true },
        { key: "course", label: "કોર્સ", sortable: true, render: (row) => courseMap[row.course] || row.course || "—" },
        { key: "mobile", label: "મોબાઈલ" },
        { key: "parent_name", label: "વાલી" },
        { key: "status", label: "સ્ટેટસ", type: "status", sortable: true },
        { key: "payment_status", label: "પેમેન્ટ", type: "status" },
        { key: "admission_date", label: "તારીખ", type: "date", sortable: true },
      ]}
      formFields={[
        { key: "student_name", label: "વિદ્યાર્થીનું નામ", required: true },
        { key: "course", label: "કોર્સ", required: true, type: "select", options: courseOptions },
        { key: "mobile", label: "મોબાઈલ", required: true },
        { key: "parent_name", label: "વાલીનું નામ" },
        { key: "parent_mobile", label: "વાલીનો મોબાઈલ" },
        { key: "address", label: "સરનામું", fullWidth: true, type: "textarea" },
        { key: "photo_url", label: "ફોટો", type: "file" },
        { key: "status", label: "સ્ટેટસ", type: "select", options: STATUS_OPTS },
        { key: "payment_status", label: "પેમેન્ટ સ્ટેટસ", type: "select", options: PAY_OPTS },
        { key: "admission_date", label: "પ્રવેશ તારીખ", type: "date" },
        { key: "remarks", label: "નોંધ", fullWidth: true, type: "textarea" },
      ]}
    />
  );
}