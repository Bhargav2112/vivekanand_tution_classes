import { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiClient';
import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

export default function TopperSlider() {
  const [toppers, setToppers] = useState([]);

  useEffect(() => {
    const fetchToppers = async () => {
      try {
        const res = await apiClient.get('/toppers');
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        
        const activeToppers = data.filter(t => t.isActive && t.status === 'active')
                                 .sort((a, b) => a.order - b.order);
        setToppers(activeToppers);
      } catch (err) {
        console.error("Failed to fetch toppers", err);
      }
    };
    fetchToppers();
  }, []);

  if (toppers.length === 0) return null;

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        <SectionHeading 
          title="અમારા ગૌરવશાળી તારલાઓ" 
          subtitle="Vivekanand Tuition Classes Toppers" 
          centered 
        />
        
        <div className="mt-16 relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="flex overflow-hidden group">
            <div className="flex gap-6 animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap py-4">
              {[...toppers, ...toppers, ...toppers].map((topper, i) => (
                <div 
                  key={`${topper._id}-${i}`}
                  className="w-[280px] sm:w-[320px] shrink-0 bg-white rounded-2xl shadow-lg border border-border p-6 flex flex-col items-center text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF6600] to-[#7A0C0C]" />
                  <div className="absolute top-4 right-4 text-golden/20">
                    <Trophy className="w-12 h-12" />
                  </div>
                  
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-golden to-primary mb-4 shadow-md relative z-10">
                    <img 
                      src={topper.photo_url || '/placeholder-user.jpg'} 
                      alt={topper.name} 
                      className="w-full h-full object-cover rounded-full border-2 border-white"
                    />
                  </div>
                  
                  <h4 className="font-heading font-bold text-xl text-primary mb-1">{topper.name}</h4>
                  <div className="text-sm font-semibold text-accent mb-3">{topper.standard} | {topper.year}</div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-golden text-golden" />
                    ))}
                  </div>
                  
                  <div className="w-full bg-gray-50 rounded-xl p-3 border border-border">
                    <div className="font-display font-bold text-2xl text-primary mb-1">{topper.percentage}</div>
                    <div className="text-sm text-muted-foreground font-medium">{topper.rank}</div>
                  </div>
                  
                  {topper.achievement && (
                    <p className="mt-4 text-sm text-muted-foreground italic line-clamp-2">"{topper.achievement}"</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
