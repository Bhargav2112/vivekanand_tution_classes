import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";

const PAGE_OPTS = [
  { value: "home", label: "Home" },
  { value: "about", label: "About" },
  { value: "courses", label: "Courses" },
  { value: "results", label: "Results" },
  { value: "gallery", label: "Gallery" },
  { value: "admission", label: "Admission" },
  { value: "contact", label: "Contact" },
  { value: "footer", label: "Footer" },
];
const STATUS_OPTS = [
  { value: "active", label: "સક્રિય" },
  { value: "inactive", label: "નિષ્ક્રિય" },
];

export default function WebsitePages() {
  return (
    <CrudModule
      entityName="WebsitePage"
      title="Website Pages"
      description="વેબસાઈટના દરેક પેજનું કન્ટેન્ટ એડિટ કરો"
      searchFields={["page_name", "section", "title"]}
      columns={[
        { key: "page_name", label: "પેજ", type: "status", sortable: true },
        { key: "section", label: "સેક્શન", sortable: true },
        { key: "title", label: "શીર્ષક", sortable: true },
        { key: "display_order", label: "ઓર્ડર", type: "number", sortable: true },
        { key: "status", label: "સ્ટેટસ", type: "status", sortable: true },
      ]}
      formFields={[
        { key: "page_name", label: "પેજ", type: "select", options: PAGE_OPTS, required: true },
        { key: "section", label: "સેક્શન" },
        { key: "title", label: "શીર્ષક", required: true, fullWidth: true },
        { key: "image_url", label: "ઈમેજ", type: "file" },
        { key: "content", label: "કન્ટેન્ટ", fullWidth: true, type: "rich" },
        { key: "display_order", label: "ડિસ્પ્લે ઓર્ડર", type: "number" },
        { key: "status", label: "સ્ટેટસ", type: "select", options: STATUS_OPTS },
      ]}
    />
  );
}