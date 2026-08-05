import { useEffect, useState } from 'react';
import { apiClient } from '@/api/apiClient';
import { Megaphone, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnnouncementTicker() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchTickerNotices = async () => {
      try {
        const res = await apiClient.get('/notices');
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        
        const activeTickers = data.filter(notice => 
          notice.type === 'ticker' && 
          notice.status === 'active' &&
          notice.isActive
        ).sort((a, b) => a.order - b.order);

        setNotices(activeTickers);
      } catch (err) {
        console.error("Failed to fetch ticker notices", err);
      }
    };
    fetchTickerNotices();
  }, []);

  if (notices.length === 0) return null;

  return (
    <div className="bg-[#7A0C0C] text-white border-b border-white/10 relative z-40 mt-[80px] md:mt-[90px] overflow-hidden">
      <div className="max-w-[1320px] mx-auto flex items-center h-10">
        
        {/* Label */}
        <div className="flex items-center gap-2 bg-[#FF6600] h-full px-4 lg:px-6 z-10 shrink-0 font-heading font-bold shadow-[4px_0_15px_rgba(0,0,0,0.3)]">
          <Megaphone className="w-4 h-4 animate-pulse" />
          <span className="hidden sm:inline tracking-wider">UPDATE</span>
        </div>

        {/* Scrolling Area */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center group">
          <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
            {/* Double the list to create infinite loop effect seamlessly */}
            {[...notices, ...notices].map((notice, i) => (
              <div key={i} className="flex items-center gap-3 px-8 text-sm font-medium">
                {notice.link ? (
                  <Link to={notice.link} className="hover:text-golden transition-colors hover:underline flex items-center gap-1" style={{ color: notice.color !== '#000000' ? notice.color : undefined }}>
                    {notice.title} <ChevronRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <span style={{ color: notice.color !== '#000000' ? notice.color : undefined }}>
                    {notice.title}
                  </span>
                )}
                {notice.priority === 'high' && (
                  <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold animate-pulse">NEW</span>
                )}
                <span className="text-white/30 ml-4">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
