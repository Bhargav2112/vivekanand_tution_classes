import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Bell, Megaphone, X } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Btn from '@/components/ui/Btn';
import Reveal from '@/components/site/Reveal';
import { apiClient } from '@/api/apiClient';

const NEWS_COLORS = {
  'પ્રવેશ': 'bg-accent text-white',
  'નવો બેચ': 'bg-primary text-white',
  'સ્કોલરશિપ': 'bg-golden text-white',
  'રજા': 'bg-secondary text-white',
  'પરિણામ': 'bg-accent text-white',
  'normal': 'bg-primary text-white',
  'scrolling': 'bg-accent text-white',
  'popup': 'bg-golden text-white',
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNoticeImage, setActiveNoticeImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, noticeRes] = await Promise.all([
          apiClient.get('/events'),
          apiClient.get('/notices')
        ]);
        const eventData = Array.isArray(eventRes.data) ? eventRes.data : (eventRes.data?.data || []);
        const noticeData = Array.isArray(noticeRes.data) ? noticeRes.data : (noticeRes.data?.data || []);
        setEvents(eventData.filter(e => e.status !== 'past'));
        setNotices(noticeData.filter(n => n.status === 'active'));
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <PageHero
        title="કાર્યક્રમો અને જાહેરાતો"
        subtitle="સંસ્થામાં યોજાતી પ્રવૃત્તિઓ અને મહત્વપૂર્ણ સૂચનાઓ."
        breadcrumb={[{ label: 'કાર્યક્રમો' }]}
      />

      <section className="bg-white py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Upcoming Events */}
            <div>
              <Reveal>
                <SectionHeading label="કાર્યક્રમો" title="આગામી પ્રવૃત્તિઓ" align="left" />
              </Reveal>
              <div className="mt-8 space-y-6">
                {loading ? (
                  <div className="py-10 text-center text-muted-foreground">લોડ થઈ રહ્યું છે...</div>
                ) : events.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground">કોઈ ઇવેન્ટ ઉપલબ્ધ નથી.</div>
                ) : (
                  events.map((e, i) => (
                    <Reveal key={e._id || i} delay={i * 0.1}>
                      <div className="card-hover border border-border bg-white p-6 flex flex-col sm:flex-row gap-6 items-start">
                        {e.image_url && (
                          <img src={e.image_url} alt={e.title} className="w-full sm:w-28 h-28 object-cover rounded shrink-0" />
                        )}
                        <div>
                          <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground mb-2 font-body">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-accent" />{new Date(e.event_date || e.date || Date.now()).toLocaleDateString('gu-IN')}</span>
                            {e.event_time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-accent" />{e.event_time}</span>}
                          </div>
                          <h3 className="font-heading font-bold text-[18px] text-foreground mb-2">{e.title}</h3>
                          <p className="font-body text-[14px] text-muted-foreground line-clamp-2">{e.description}</p>
                          {e.location && (
                            <div className="mt-3 flex items-center gap-1 text-[13px] text-accent font-semibold font-body">
                              <MapPin className="w-3.5 h-3.5" />{e.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  ))
                )}
              </div>
            </div>

            {/* Notices / Announcements */}
            <div>
              <Reveal>
                <SectionHeading label="જાહેરાતો" title="તાજી સૂચનાઓ" align="left" />
              </Reveal>
              <div className="mt-8 space-y-6 relative pl-6 border-l-2 border-accent/20">
                {loading ? (
                  <div className="py-10 text-center text-muted-foreground">લોડ થઈ રહ્યું છે...</div>
                ) : notices.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground">કોઈ જાહેરાતો ઉપલબ્ધ નથી.</div>
                ) : (
                  notices.map((n, i) => (
                    <Reveal key={n._id || i} delay={i * 0.1}>
                      <div className="relative">
                        <div className="absolute -left-[41px] flex items-center justify-center w-12 h-12 bg-accent text-white">
                          {n.type === 'normal' ? <Bell className="w-5 h-5" strokeWidth={1.8} /> : <Megaphone className="w-5 h-5" strokeWidth={1.8} />}
                        </div>
                        <div className="bg-white border border-border p-6 ml-4 card-hover">
                          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                            <span className={`${NEWS_COLORS[n.type] || 'bg-accent text-white'} px-3 py-1 text-[12px] font-heading font-semibold capitalize`}>{n.type === 'normal' ? 'સામાન્ય' : n.type === 'popup' ? 'પોપઅપ' : 'સ્ક્રોલિંગ'}</span>
                            <span className="font-body text-[13px] text-muted-foreground flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />{new Date(n.createdAt || Date.now()).toLocaleDateString('gu-IN')}
                            </span>
                          </div>
                          <h3 className="font-heading font-bold text-[18px] text-foreground mb-1">{n.title}</h3>
                          <p className="font-body text-[15px] text-muted-foreground whitespace-pre-wrap">{n.content}</p>
                          {n.attachment_url && (
                            <div className="mt-4 pt-3 border-t border-border/60">
                              <button
                                type="button"
                                onClick={() => setActiveNoticeImage(n.attachment_url)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline cursor-pointer"
                              >
                                સંબંધિત ફાઈલ જુઓ <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== NOTICE IMAGE LIGHTBOX POPUP MODAL ===== */}
      {activeNoticeImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl max-h-[90vh] bg-white p-3 shadow-2xl overflow-hidden flex flex-col items-center border-4 border-[#7a1d1d]">
            <button
              type="button"
              onClick={() => setActiveNoticeImage(null)}
              className="absolute top-3 right-3 z-10 bg-[#7a1d1d] hover:bg-black text-white p-2 rounded-full transition-colors shadow"
              title="બંધ કરો"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full overflow-auto flex justify-center p-2 mt-6">
              <img
                src={activeNoticeImage}
                alt="સંબંધિત જાહેરાત ફાઈલ"
                className="max-w-full max-h-[75vh] object-contain shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="bg-accent text-white py-16 lg:py-20">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-heading font-extrabold text-3xl md:text-[40px] !leading-loose pb-4 pt-2">
              આજે જ તમારા બાળકના ભવિષ્યની શરૂઆત કરો.
            </h2>
            <div className="mt-8">
              <Btn to="/admission" variant="maroon" size="lg" iconRight={ArrowRight}>
                હમણાં જ પ્રવેશ લો
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}