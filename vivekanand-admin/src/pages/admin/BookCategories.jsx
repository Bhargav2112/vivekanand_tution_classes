import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";

const STATUS_OPTS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function BookCategories() {
  return (
    <CrudModule
      entityName="BookCategory"
      title="Book Categories"
      description="Manage book categories for the online store"
      searchFields={["name", "slug"]}
      columns={[
        { key: "name", label: "Name", sortable: true },
        { key: "slug", label: "Slug", sortable: true },
        { key: "status", label: "Status", type: "status", sortable: true },
      ]}
      formFields={[
        { key: "name", label: "Category Name", required: true },
        { key: "slug", label: "URL Slug", required: true },
        { key: "description", label: "Description", type: "textarea", fullWidth: true },
        { key: "image_url", label: "Cover Image", type: "file", accept: "image/*" },
        { key: "status", label: "Status", type: "select", options: STATUS_OPTS },
      ]}
      exportColumns={[]}
      extraActions={[]}
    />
  );
}
