import React, { useState } from "react";
import { Send, BellRing, Loader2 } from "lucide-react";
import { api } from "@/api/axios";
import { useToast } from "@/components/ui/use-toast";

export default function PushDashboard() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    url: "",
    icon: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.body) {
      toast({ title: "Title and Body are required", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      const res = await api.post('/push/send', formData);
      toast({ title: "Notification Sent Successfully", description: res.data?.message });
      setFormData({ title: "", body: "", url: "", icon: "" });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to send notification", description: err.response?.data?.message || err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#7a1d1d] flex items-center gap-2">
          <BellRing className="w-6 h-6" /> Push Notifications
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Send manual push notifications to all subscribed users</p>
      </div>

      <div className="admin-card border-2 border-[#7a1d1d]/20">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Notification Title *</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-border focus:outline-none focus:border-[#7a1d1d] rounded"
              placeholder="e.g. Admission Started 2026!"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Notification Body *</label>
            <textarea 
              name="body"
              value={formData.body}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border focus:outline-none focus:border-[#7a1d1d] rounded"
              placeholder="Enter message body..."
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Target URL (Optional)</label>
            <input 
              type="text" 
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-border focus:outline-none focus:border-[#7a1d1d] rounded"
              placeholder="https://vivekanandclasses.com/admission"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Custom Icon URL (Optional)</label>
            <input 
              type="text" 
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-border focus:outline-none focus:border-[#7a1d1d] rounded"
              placeholder="https://.../icon.png"
            />
          </div>
          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={sending}
              className="admin-btn admin-btn-primary flex items-center gap-2"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Broadcast Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
