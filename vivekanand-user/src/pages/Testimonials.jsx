import { useState, useEffect } from 'react';
import { Play, X, ArrowRight, Video, MessageSquareQuote } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Btn from '@/components/ui/Btn';
import Reveal from '@/components/site/Reveal';
import { apiClient } from '@/api/apiClient';

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  }
  return url;
}

function getYouTubeThumbnail(url, photoUrl) {
  if (photoUrl && photoUrl.includes('http')) return photoUrl;
  const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return photoUrl || '';
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitForm, setSubmitForm] = useState({ student_name: '', mobile: '', review: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchTestimonialsAndResults = async () => {
    try {
      const [testimonialsRes, resultsRes] = await Promise.allSettled([
        apiClient.get('/testimonials'),
        apiClient.get('/results')
      ]);
      if (testimonialsRes.status === 'fulfilled') {
        const data = Array.isArray(testimonialsRes.value.data) ? testimonialsRes.value.data : (testimonialsRes.value.data?.data || []);
        setReviews(data.filter(d => d.status !== 'inactive'));
      }
      if (resultsRes.status === 'fulfilled') {
        const data = Array.isArray(resultsRes.value.data) ? resultsRes.value.data : (resultsRes.value.data?.data || []);
        setResults(data.filter(d => d.isActive !== false));
      }
    } catch (err) {
      console.error("Failed to fetch testimonials and results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonialsAndResults();
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await apiClient.post('/testimonials/submit', submitForm);
      if (res.data?.success || res.status === 201) {
        setSubmitSuccess(true);
        setSubmitForm({ student_name: '', mobile: '', review: '' });
        fetchTestimonialsAndResults(); // Refresh list to show new review
        setTimeout(() => {
          setIsSubmitModalOpen(false);
          setSubmitSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || "અભિપ્રાય મોકલવામાં ભૂલ થઈ. ફરી પ્રયાસ કરો.");
    } finally {
      setSubmitting(false);
    }
  };

  const videoReviews = reviews.filter(r => r.type !== 'text');
  const textReviews = reviews.filter(r => r.type === 'text');

  return (
    <>
      <PageHero
        title="વાલીઓ અને વિદ્યાર્થીઓના અભિપ્રાયો"
        subtitle="વાલીઓ અને વિદ્યાર્થીઓના સાચા પ્રતિસાદ અને સિદ્ધિઓ."
        breadcrumb={[{ label: 'અભિપ્રાય' }]}
      />

      {/* Parents Text Testimonials Section */}
      <section className="bg-background py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
            <Reveal>
              <SectionHeading
                label="લેખિત અભિપ્રાય"
                title="વાલીઓના શબ્દોમાં"
                subtitle="અમારા શિક્ષણ અને વાતાવરણ વિશે વાલીઓના સાચા અનુભવો."
                className="mb-0"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <button 
                onClick={() => setIsSubmitModalOpen(true)}
                className="bg-accent text-white px-6 py-3 font-heading font-bold rounded shadow-md hover:bg-accent/90 transition-colors whitespace-nowrap"
              >
                તમારો અભિપ્રાય આપો
              </button>
            </Reveal>
          </div>

          <div>
            {loading ? (
              <div className="text-center text-muted-foreground py-16">લોડ થઈ રહ્યું છે...</div>
            ) : textReviews.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">કોઈ લેખિત અભિપ્રાય ઉપલબ્ધ નથી.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {textReviews.map((item, idx) => (
                  <Reveal key={item._id || idx} delay={idx * 0.08}>
                    <div className="bg-white border border-border p-8 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col rounded-xl">
                      <div className="mb-6 flex justify-between items-start text-accent opacity-80">
                        <MessageSquareQuote className="w-10 h-10" />
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(star => (
                            <svg key={star} className={`w-4 h-4 ${star <= (item.rating || 5) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-8 italic flex-grow">"{item.review}"</p>
                      <div className="flex items-center gap-4 mt-auto">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold text-lg font-heading">
                          {item.student_name ? item.student_name.charAt(0).toUpperCase() : 'P'}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground font-heading">{item.student_name || item.parent_name || 'વાલી'}</h4>
                          {item.mobile && <p className="text-sm text-muted-foreground font-medium mt-0.5">{item.mobile}</p>}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Parents Video Testimonials Grid Section */}
      <section className="bg-white py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading
              label="વિડિઓ"
              title="વાલીઓના લાઈવ વિડિઓ"
              subtitle="વિવેકાનંદ ટ્યુશન ક્લાસીસ વિશે વાલીઓના લાઈવ વિડિઓ અભિપ્રાયો."
            />
          </Reveal>

          <div className="mt-12">
            {loading ? (
              <div className="text-center text-muted-foreground py-16">લોડ થઈ રહ્યું છે...</div>
            ) : videoReviews.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">કોઈ વિડિઓ અભિપ્રાય ઉપલબ્ધ નથી.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {videoReviews.map((item, idx) => {
                  const thumb = getYouTubeThumbnail(item.video_url, item.photo_url);
                  const embedUrl = getYouTubeEmbedUrl(item.video_url);

                  return (
                    <Reveal key={item._id || idx} delay={idx * 0.08}>
                      <div
                        onClick={() => setActiveVideoModal(embedUrl)}
                        className="group relative bg-black border-2 border-[#7a1d1d]/30 overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer flex flex-col h-full rounded-lg"
                      >
                        {/* Video Thumbnail (Vertical 9:16 Shorts ratio) */}
                        <div className="relative aspect-[9/16] w-full bg-slate-900 overflow-hidden">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={item.student_name || "વાલી અભિપ્રાય"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-white bg-[#58070A]/80 p-4 text-center">
                              <Video className="w-12 h-12 text-[#FF6600] mb-2" />
                              <span className="text-xs font-bold">વિડિઓ જુઓ</span>
                            </div>
                          )}

                          {/* Dark Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 group-hover:from-black/90 transition-colors" />

                          {/* Play Button Icon */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-[#FF6600] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#FF8533] transition-all">
                              <Play className="w-7 h-7 ml-1" fill="white" />
                            </div>
                          </div>

                          {/* Top Badge */}
                          <div className="absolute top-3 left-3 bg-[#7a1d1d] text-white text-[11px] font-extrabold px-2.5 py-1 rounded shadow">
                            વિડિઓ રિવ્યૂ
                          </div>
                        </div>

                        {/* Title Bar */}
                        <div className="p-4 bg-[#7a1d1d] text-white mt-auto">
                          <h3 className="font-heading font-bold text-base line-clamp-2 leading-snug">
                            {item.student_name || item.parent_name || "વાલી નો અભિપ્રાય"}
                          </h3>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Student Merit Testimonials Section */}
      <section className="bg-background py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading
              label="વિદ્યાર્થીઓ"
              title="શ્રેષ્ઠ પરિણામ મેળવનાર વિદ્યાર્થીઓ"
              subtitle="નવોદય, જ્ઞાન શક્તિ, CET અને અન્ય પરીક્ષાઓમાં ઉચ્ચ પરિણામ લાવનાર અમારા તેજસ્વી ભૂતપૂર્વ વિદ્યાર્થીઓ."
            />
          </Reveal>
          
          <div className="mt-12">
            {loading ? (
              <div className="text-center text-muted-foreground py-16">લોડ થઈ રહ્યું છે...</div>
            ) : results.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">કોઈ વિદ્યાર્થી ઉપલબ્ધ નથી.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {results.map((v, i) => (
                  <Reveal key={v._id || i} delay={i * 0.05}>
                    <div className="group border border-border bg-white overflow-hidden shadow hover:shadow-lg transition-all flex flex-col h-full items-center text-center p-4">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#7a1d1d]/20 mb-4 shrink-0">
                        {v.photo_url ? (
                          <img
                            src={v.photo_url}
                            alt={v.student_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <img
                            src="/logo.png"
                            alt={v.student_name}
                            className="w-full h-full object-cover opacity-60"
                          />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-heading font-bold text-base text-foreground !leading-[1.5] pb-1">{v.student_name}</h3>
                          <p className="font-body text-xs text-muted-foreground mt-1">{v.exam} {v.year && `(${v.year})`}</p>
                        </div>
                        {v.percentage ? (
                          <div className="mt-3 inline-block bg-accent/10 text-accent px-2.5 py-0.5 font-heading font-bold text-xs">
                            ટકા: {v.percentage}%
                          </div>
                        ) : v.marks ? (
                          <div className="mt-3 inline-block bg-accent/10 text-accent px-2.5 py-0.5 font-heading font-bold text-xs">
                            ગુણ: {v.marks}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== YOUTUBE SHORTS VIDEO MODAL PLAYER ===== */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm sm:max-w-md bg-black rounded-lg overflow-hidden aspect-[9/16] shadow-2xl border-2 border-white/20">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-3 right-3 z-20 bg-black/70 hover:bg-black text-white p-2 rounded-full transition-colors shadow"
              title="બંધ કરો"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src={activeVideoModal}
              title="YouTube Shorts Video"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ===== SUBMIT REVIEW MODAL ===== */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-accent text-white p-4 flex justify-between items-center">
              <h3 className="font-heading font-bold text-xl">તમારો અભિપ્રાય આપો</h3>
              <button onClick={() => setIsSubmitModalOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="font-bold text-xl mb-2 text-foreground">આભાર!</h4>
                  <p className="text-muted-foreground">તમારો અભિપ્રાય સફળતાપૂર્વક મોકલવામાં આવ્યો છે.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {submitError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 border border-red-100">
                      {submitError}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1.5">તમારું નામ <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required 
                      placeholder="દા.ત. રાહુલ ભાઈ" 
                      className="w-full border border-border rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/50"
                      value={submitForm.student_name}
                      onChange={e => setSubmitForm({...submitForm, student_name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1.5">મોબાઈલ નંબર <span className="text-muted-foreground font-normal">(અન્ય વાલીઓ માટે)</span></label>
                    <input 
                      type="text" 
                      placeholder="દા.ત. 9876543210" 
                      className="w-full border border-border rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/50"
                      value={submitForm.mobile}
                      onChange={e => setSubmitForm({...submitForm, mobile: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground mt-1">તમારો મોબાઈલ નંબર અન્ય વાલીઓને માર્ગદર્શન માટે બતાવવામાં આવશે.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1.5">તમારો અભિપ્રાય <span className="text-red-500">*</span></label>
                    <textarea 
                      required 
                      rows={4}
                      placeholder="અમારા ટ્યુશન વિશે તમારા વિચારો અહીં લખો..." 
                      className="w-full border border-border rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                      value={submitForm.review}
                      onChange={e => setSubmitForm({...submitForm, review: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-accent text-white font-bold py-3 rounded shadow hover:bg-accent/90 transition-colors disabled:opacity-70 mt-2"
                  >
                    {submitting ? 'મોકલી રહ્યા છે...' : 'અભિપ્રાય સબમિટ કરો'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="bg-accent text-white py-16 lg:py-20">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-heading font-extrabold text-3xl md:text-[40px] !leading-[1.5] md:!leading-[1.45] pb-1">
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