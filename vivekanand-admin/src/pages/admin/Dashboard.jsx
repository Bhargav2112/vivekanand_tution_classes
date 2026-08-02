import React, { useState, useEffect } from "react";
import { Filter, Loader2 } from "lucide-react";
import { api } from "@/api/axios";
import KpiCards from "@/components/admin/dashboard/KpiCards";
import ChartsSection from "@/components/admin/dashboard/ChartsSection";
import RecentAdmissions from "@/components/admin/dashboard/RecentAdmissions";
import TodayNotices from "@/components/admin/dashboard/TodayNotices";
import NewInquiriesWidget from "@/components/admin/dashboard/NewInquiriesWidget";

export default function Dashboard() {
  const today = new Date().toLocaleDateString("gu-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const [showFilter, setShowFilter] = useState(false);
  const [counts, setCounts] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [
          admissionsRes, studentsRes, teachersRes, coursesRes, batchesRes,
          galleryRes, videosRes, noticesRes, eventsRes, testimonialsRes, faqsRes,
          contactsRes, blogRes,
        ] = await Promise.all([
          api.get("/admissions"),
          api.get("/students"),
          api.get("/teachers"),
          api.get("/courses"),
          api.get("/batches"),
          api.get("/galleries"),
          api.get("/videos"),
          api.get("/notices"),
          api.get("/events"),
          api.get("/testimonials"),
          api.get("/faqs"),
          api.get("/contactenquiries"),
          api.get("/blogs"),
        ]);
        
        const extractData = (res) => Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        
        const admissionsList = extractData(admissionsRes);
        const students = extractData(studentsRes);
        const teachers = extractData(teachersRes);
        const courses = extractData(coursesRes);
        const batches = extractData(batchesRes);
        const gallery = extractData(galleryRes);
        const videos = extractData(videosRes);
        const noticesList = extractData(noticesRes);
        const events = extractData(eventsRes);
        const testimonials = extractData(testimonialsRes);
        const faqs = extractData(faqsRes);
        const contacts = extractData(contactsRes);
        const blog = extractData(blogRes);

        const todayStr = new Date().toDateString();
        const monthStart = new Date();
        monthStart.setDate(1);

        setCounts({
          todayAdmissions: admissionsList.filter((a) => new Date(a.created_date || a.createdAt).toDateString() === todayStr).length,
          monthlyAdmissions: admissionsList.filter((a) => new Date(a.created_date || a.createdAt) >= monthStart).length,
          pendingAdmissions: admissionsList.filter((a) => a.status === "pending").length,
          totalStudents: students.length,
          activeCourses: courses.filter((c) => c.status === "active").length,
          teachers: teachers.filter((t) => t.status === "active").length,
          galleryImages: gallery.length,
          videos: videos.length,
          batches: batches.length,
          events: events.length,
          testimonials: testimonials.length,
          faqs: faqs.length,
          contactMessages: contacts.filter((c) => c.status === "new").length,
          blogPosts: blog.length,
        });

        const combinedInquiries = [
          ...contacts.map((c) => ({ ...c, name: c.name, phone: c.phone, subject: c.subject || 'સંપર્ક ઈન્ક્વાયરી', message: c.message, status: c.status })),
          ...admissionsList.filter((a) => a.status === 'pending').map((a) => ({ ...a, name: a.student_name, phone: a.mobile, subject: `પ્રવેશ અરજી (${a.course})`, message: a.remarks || `વાલી: ${a.parent_name || '-'}`, status: a.status }))
        ];

        setInquiries(combinedInquiries);
        setAdmissions(admissionsList.slice(0, 6));
        setNotices(noticesList.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#7a1d1d]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#7a1d1d]">સ્વાગત છે, Admin!</h2>
          <p className="text-sm text-muted-foreground mt-1">આજનું અવલોકન અને મહત્વપૂર્ણ માહિતી</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">{today}</span>
          <button onClick={() => setShowFilter((v) => !v)} className="admin-btn admin-btn-primary text-sm">
            <Filter className="w-4 h-4" /> ફિલ્ટર
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="admin-card flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">શિક્ષણ વર્ષ</label>
            <select className="border border-border px-3 py-2 text-sm bg-white">
              <option>2025-2026</option>
              <option>2024-2025</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">કોર્સ</label>
            <select className="border border-border px-3 py-2 text-sm bg-white">
              <option>બધા</option>
              <option>નવોદય</option>
              <option>ફાઉન્ડેશન</option>
            </select>
          </div>
          <button className="admin-btn admin-btn-secondary text-sm">લાગુ કરો</button>
        </div>
      )}

      <KpiCards counts={counts} />
      <ChartsSection admissions={admissions} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <NewInquiriesWidget inquiries={inquiries} />
          <RecentAdmissions admissions={admissions} />
        </div>
        <div>
          <TodayNotices notices={notices} />
        </div>
      </div>
    </div>
  );
}