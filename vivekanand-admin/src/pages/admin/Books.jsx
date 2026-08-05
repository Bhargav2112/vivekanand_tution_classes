import React, { useState, useEffect } from "react";
import CrudModule from "@/components/admin/shared/CrudModule";
import { api } from "@/api/axios";

const STATUS_OPTS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "out_of_stock", label: "Out of Stock" }
];

export default function Books() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/bookcategories');
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setCategories(data.map(c => ({ value: c._id, label: c.name })));
      } catch (err) {
        console.error("Failed to fetch book categories", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <CrudModule
      entityName="Book"
      title="Books"
      description="Manage store books and materials"
      searchFields={["title", "author", "isbn"]}
      columns={[
        { key: "thumbnail_url", label: "Image", type: "image" },
        { key: "title", label: "Title", sortable: true },
        { key: "price", label: "Price", sortable: true },
        { key: "isBestSeller", label: "Best Seller", type: "boolean" },
        { key: "status", label: "Status", type: "status", sortable: true },
      ]}
      formFields={[
        { key: "title", label: "Book Title", required: true },
        { key: "subtitle", label: "Subtitle" },
        { key: "slug", label: "URL Slug", required: true },
        { key: "author", label: "Author" },
        { key: "category", label: "Category", type: "select", options: categories, required: true },
        { key: "price", label: "Price (₹)", type: "number", required: true },
        { key: "discount_price", label: "Discount Price (₹)", type: "number" },
        { key: "language", label: "Language", type: "select", options: [{value: "Gujarati", label: "Gujarati"}, {value: "English", label: "English"}, {value: "Hindi", label: "Hindi"}] },
        { key: "pages", label: "Pages", type: "number" },
        { key: "isbn", label: "ISBN" },
        { key: "description", label: "Description", type: "textarea", fullWidth: true },
        { key: "thumbnail_url", label: "Thumbnail Image", type: "file", accept: "image/*" },
        { key: "pdf_preview_url", label: "PDF Preview (Sample)", type: "file", accept: "application/pdf" },
        { key: "isBestSeller", label: "Best Seller", type: "boolean" },
        { key: "status", label: "Status", type: "select", options: STATUS_OPTS },
      ]}
    />
  );
}
