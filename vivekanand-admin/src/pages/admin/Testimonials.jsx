import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";

const STATUS_OPTS = [
  { value: "active", label: "સક્રિય" },
  { value: "inactive", label: "નિષ્ક્રિય" },
];

export default function Testimonials() {
  return (
    <CrudModule
      entityName="Testimonial"
      title="વાલીઓના અભિપ્રાય"
      description="વાલીઓના વિડિઓ રિવ્યૂ અને YouTube Shorts મેનેજ કરો"
      searchFields={["student_name", "video_url"]}
      columns={[
        { key: "photo_url", label: "વિડિઓ થમ્બનેલ", type: "image" },
        { key: "student_name", label: "વિડિઓ શીર્ષક / નામ", sortable: true },
        { key: "video_url", label: "YouTube લિંક" },
        { key: "status", label: "સ્ટેટસ", type: "status", sortable: true },
      ]}
      formFields={[
        { key: "student_name", label: "વિડિઓ શીર્ષક / નામ", required: true, placeholder: "દા.ત. વિવેકાનંદ ક્લાસીસ વાલી રિવ્યૂ" },
        { key: "video_url", label: "YouTube Shorts / વિડિઓ લિંક", required: true, placeholder: "https://youtube.com/shorts/..." },
        { key: "status", label: "સ્ટેટસ", type: "select", options: STATUS_OPTS },
      ]}
    />
  );
}