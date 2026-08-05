import { useState, useEffect, useCallback } from "react";
import { api } from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";

const entityToEndpoint = {
  User: "admins",
  Teacher: "teachers",
  Student: "students",
  Admission: "admissions",
  Course: "courses",
  CourseCategory: "coursecategories",
  Batch: "batches",
  Result: "results",
  GalleryImage: "galleries",
  Video: "videos",
  ShortVideo: "shortvideos",
  Testimonial: "testimonials",
  Event: "events",
  Notice: "notices",
  BlogPost: "blogs",
  FAQ: "faqs",
  WebsitePage: "websitepages",
  Setting: "settings",
  ContactMessage: "contactenquiries",
  BookCategory: "bookcategories",
  Book: "books",
  Topper: "toppers"
};

export function useEntityData(entityName) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const endpoint = entityToEndpoint[entityName] || entityName.toLowerCase() + "s";

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/${endpoint}`);
      const rawData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setItems(rawData.map((item) => ({ ...item, id: item.id || item._id })));
    } catch (err) {
      console.error(err);
      setError(err);
      setItems([]);
      toast({ title: "ડેટા લાવવામાં ભૂલ", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [endpoint, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (payload) => {
    try {
      const res = await api.post(`/${endpoint}`, payload);
      const created = res.data?.data || res.data;
      setItems((prev) => [created, ...prev]);
      toast({ title: "સફળતાપૂર્વક બનાવ્યું" });
      return created;
    } catch (err) {
      toast({ title: "ભૂલ", description: err.message || "Cannot create", variant: "destructive" });
      throw err;
    }
  };

  const update = async (id, payload) => {
    try {
      const res = await api.put(`/${endpoint}/${id}`, payload);
      const updated = res.data?.data || res.data;
      // In MongoDB, the ID is usually _id, but our API might return it as id or _id. Ensure we match correctly.
      setItems((prev) => prev.map((it) => (it._id === id || it.id === id ? updated : it)));
      toast({ title: "સફળતાપૂર્વક અપડેટ થયું" });
      return updated;
    } catch (err) {
      toast({ title: "ભૂલ", description: err.message || "Cannot update", variant: "destructive" });
      throw err;
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/${endpoint}/${id}`);
      setItems((prev) => prev.filter((it) => it._id !== id && it.id !== id));
      toast({ title: "ડિલીટ થયું" });
    } catch (err) {
      toast({ title: "ભૂલ", description: err.message || "Cannot delete", variant: "destructive" });
      throw err;
    }
  };

  const bulkDelete = async (ids) => {
    try {
      await Promise.all(ids.map((id) => api.delete(`/${endpoint}/${id}`)));
      setItems((prev) => prev.filter((it) => !ids.includes(it._id) && !ids.includes(it.id)));
      toast({ title: `${ids.length} રેકોર્ડ ડિલીટ થયા` });
    } catch (err) {
      toast({ title: "ભૂલ", description: "Bulk delete failed", variant: "destructive" });
      throw err;
    }
  };

  const bulkUpdate = async (ids, payload) => {
    try {
      await Promise.all(ids.map((id) => api.put(`/${endpoint}/${id}`, payload)));
      setItems((prev) => prev.map((it) => (ids.includes(it._id) || ids.includes(it.id) ? { ...it, ...payload } : it)));
      toast({ title: `${ids.length} રેકોર્ડ અપડેટ થયા` });
    } catch (err) {
      toast({ title: "ભૂલ", description: "Bulk update failed", variant: "destructive" });
      throw err;
    }
  };

  return { items, loading, error, reload: load, create, update, remove, bulkDelete, bulkUpdate };
}