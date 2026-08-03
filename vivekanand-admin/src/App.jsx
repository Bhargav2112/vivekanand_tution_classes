import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';

import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import Admissions from '@/pages/admin/Admissions';
import Students from '@/pages/admin/Students';
import Teachers from '@/pages/admin/Teachers';
import Courses from '@/pages/admin/Courses';
import Batches from '@/pages/admin/Batches';
import Results from '@/pages/admin/Results';
import Gallery from '@/pages/admin/Gallery';
import Notices from '@/pages/admin/Notices';
import Events from '@/pages/admin/Events';
import Testimonials from '@/pages/admin/Testimonials';
import FAQ from '@/pages/admin/FAQ';
import ContactMessages from '@/pages/admin/ContactMessages';
import WebsitePages from '@/pages/admin/WebsitePages';
import SEO from '@/pages/admin/SEO';
import Settings from '@/pages/admin/Settings';
import AdminUsers from '@/pages/admin/AdminUsers';
import Banners from '@/pages/admin/Banners';
import YoutubeDashboard from '@/pages/admin/YoutubeDashboard';

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/results" element={<Results />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/events" element={<Events />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/youtube" element={<YoutubeDashboard />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact-enquiry" element={<ContactMessages />} />
          <Route path="/pages" element={<WebsitePages />} />
          <Route path="/seo" element={<SEO />} />
          <Route path="/settings" element={<Settings />} />
          <Route element={<ProtectedRoute superAdminOnly={true} />}>
            <Route path="/admin-users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <ScrollToTop />
          <AuthenticatedApp />
        </AuthProvider>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;