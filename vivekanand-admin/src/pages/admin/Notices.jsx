import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";

const TYPE_OPTS = [
  { value: "normal", label: "સામાન્ય" },
  { value: "scrolling", label: "સ્ક્રોલિંગ" },
  { value: "popup", label: "પોપઅપ" },
  { value: "ticker", label: "Ticker" },
];
const PRIORITY_OPTS = [
  { value: "high", label: "ઊંચી" },
  { value: "medium", label: "મધ્યમ" },
  { value: "low", label: "નીચી" },
];
const STATUS_OPTS = [
  { value: "active", label: "સક્રિય" },
  { value: "inactive", label: "નિષ્ક્રિય" },
];

export default function Notices() {
  return (
    <CrudModule
      entityName="Notice"
      title="જાહેરાતો"
      description="નોટિસ બોર્ડ મેનેજ કરો"
      searchFields={["title", "content"]}
      columns={[
        { key: "title", label: "શીર્ષક", sortable: true },
        { key: "type", label: "પ્રકાર", type: "status", sortable: true },
        { key: "priority", label: "પ્રાથમિકતા", type: "status", sortable: true },
        { key: "pinned", label: "પિન", type: "boolean" },
        { key: "expiry_date", label: "સમાપ્તિ", type: "date", sortable: true },
        { key: "status", label: "સ્ટેટસ", type: "status", sortable: true },
      ]}
      formFields={[
        { key: "title", label: "શીર્ષક", required: true },
        { key: "content", label: "વિગત", required: true, fullWidth: true, type: "textarea" },
        { key: "type", label: "પ્રકાર", type: "select", options: TYPE_OPTS },
        { key: "priority", label: "પ્રાથમિકતા", type: "select", options: PRIORITY_OPTS },
        { key: "color", label: "Ticker Color", type: "color", defaultValue: "#000000" },
        { key: "link", label: "Link URL (optional)" },
        { key: "animationSpeed", label: "Animation Speed", type: "number", defaultValue: 20 },
        { key: "order", label: "Display Order", type: "number", defaultValue: 0 },
        { key: "startDate", label: "Start Date", type: "date" },
        { key: "endDate", label: "End Date", type: "date" },
        { key: "expiry_date", label: "સમાપ્તિ તારીખ", type: "date" },
        { key: "autoExpire", label: "Auto Expire", type: "boolean" },
        { key: "attachment_url", label: "અટેચમેન્ટ", type: "file", accept: "application/pdf,image/*" },
        { key: "pinned", label: "પિન કરો", type: "boolean", checkLabel: "ટોપ પર પિન કરો" },
        { key: "status", label: "સ્ટેટસ", type: "select", options: STATUS_OPTS },
      ]}
      exportColumns={[]}
      extraActions={[]}
    />
  );
}