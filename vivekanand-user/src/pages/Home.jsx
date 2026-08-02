import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Check, Phone, MessageCircle, ArrowRight, Users, TrendingUp, Award, Star,
  GraduationCap, Lightbulb, Brain, BookOpen, ShieldCheck, Target, Building2,
  BookMarked, MessageSquare, UserCheck, Users2, ClipboardCheck, Eye, Flag,
  Play, X, Bell
} from 'lucide-react';
import Btn from '@/components/ui/Btn';
import ImgPlaceholder from '@/components/ui/ImgPlaceholder';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/site/Reveal';
import StatCounter from '@/components/site/StatCounter';
import Marquee from '@/components/site/Marquee';
import { SITE, STATS, WHY_CHOOSE_US, COURSES as FALLBACK_COURSES } from '@/data/site';
import { apiClient } from '@/api/apiClient';
import FaqSection from '@/components/site/FaqSection';

const ICONS = {
  Users, TrendingUp, Award, Star, GraduationCap, Lightbulb, Brain, BookOpen,
  ShieldCheck, Target, Building2, BookMarked, MessageSquare, UserCheck, Users2,
  ClipboardCheck, Eye, Flag,
};

const HERO_FEATURES = ['અનુભવી શિક્ષકો', 'નિયમિત ટેસ્ટ', 'વ્યક્તિગત માર્ગદર્શન', 'નાના બેચ', 'માતા-પિતા મીટિંગ'];

function getYouTubeDetails(url) {
  if (!url) return { embedUrl: '', thumbnailUrl: '' };
  let videoId = '';
  const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    videoId = match[1];
  }
  if (videoId) {
    return {
      videoId,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  }
  return { embedUrl: url, thumbnailUrl: '' };
}

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [banners, setBanners] = useState([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [settings, setSettings] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [activeNoticeImage, setActiveNoticeImage] = useState(null);

  const displayStats = settings ? [
    {
      value: settings.stats_students_value !== undefined ? settings.stats_students_value : 5000,
      suffix: settings.stats_students_suffix || "+",
      label: settings.stats_students_label || "વિદ્યાર્થીઓ",
      icon: "Users"
    },
    {
      value: settings.stats_results_value !== undefined ? settings.stats_results_value : 98,
      suffix: settings.stats_results_suffix || "%",
      label: settings.stats_results_label || "પરિણામ",
      icon: "TrendingUp"
    },
    {
      value: settings.stats_experience_value !== undefined ? settings.stats_experience_value : 15,
      suffix: settings.stats_experience_suffix || "+",
      label: settings.stats_experience_label || "વર્ષનો અનુભવ",
      icon: "Award"
    },
    {
      value: settings.stats_merit_value !== undefined ? settings.stats_merit_value : 500,
      suffix: settings.stats_merit_suffix || "+",
      label: settings.stats_merit_label || "મેરિટ વિદ્યાર્થીઓ",
      icon: "Star"
    }
  ] : STATS;

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [courseRes, noticeRes, photoRes, videoRes, settingsRes, bannersRes] = await Promise.allSettled([
          apiClient.get('/courses'),
          apiClient.get('/notices'),
          apiClient.get('/galleries'),
          apiClient.get('/youtube/videos'),
          apiClient.get('/settings'),
          apiClient.get('/banners')
        ]);
        
        if (courseRes.status === 'fulfilled') {
          const data = Array.isArray(courseRes.value.data) ? courseRes.value.data : (courseRes.value.data?.data || []);
          setCourses(data.length > 0 ? data : FALLBACK_COURSES);
        } else {
          setCourses(FALLBACK_COURSES);
        }

        if (noticeRes.status === 'fulfilled') {
          const data = Array.isArray(noticeRes.value.data) ? noticeRes.value.data : (noticeRes.value.data?.data || []);
          setNotices(data.filter(n => n.status !== 'inactive'));
        }

        if (photoRes.status === 'fulfilled') {
          const data = Array.isArray(photoRes.value.data) ? photoRes.value.data : (photoRes.value.data?.data || []);
          setPhotos(data.filter(p => p.isActive !== false));
        }

        if (videoRes.status === 'fulfilled') {
          const data = Array.isArray(videoRes.value.data) ? videoRes.value.data : (videoRes.value.data?.data || []);
          setVideos(data.filter(v => v.isActive !== false));
        }

        if (settingsRes.status === 'fulfilled') {
          const data = Array.isArray(settingsRes.value.data) ? settingsRes.value.data : (settingsRes.value.data?.data || []);
          if (data && data.length > 0) setSettings(data[0]);
        }

        if (bannersRes.status === 'fulfilled') {
          const data = Array.isArray(bannersRes.value.data) ? bannersRes.value.data : (bannersRes.value.data?.data || []);
          setBanners(data.filter(b => b.isActive !== false));
        }
      } catch (err) {
        console.error("Home data fetch error:", err);
        setCourses(FALLBACK_COURSES);
      }
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setActiveBanner((prev) => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const marqueeItems = notices.length > 0
    ? notices.map(n => n.title)
    : ['પ્રવેશ શરૂ 2026-27', 'જવાહર નવોદય બેચ શરૂ', 'સ્કોલરશિપ પરીક્ષા', 'નવો બેચ જાન્યુઆરીમાં', 'મફત ડેમો ક્લાસ ઉપલબ્ધ'];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative bg-[#58070A] text-white pt-[140px] md:pt-[170px] pb-16 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D0305] via-[#58070A] to-[#450406]" />
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[52%_48%] gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <Reveal>
              <div className="inline-block mb-2">
                <span className="font-heading text-[32px] sm:text-[46px] lg:text-[56px] font-black uppercase tracking-wider text-white">
                  ADMISSION <span className="text-[#FF6600]">OPEN</span>
                </span>
                <span className="block font-heading text-[48px] sm:text-[68px] lg:text-[80px] font-black text-[#FFD54F] !leading-[1.4] mt-1 pb-1">
                  2026-27
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-[28px] sm:text-[36px] lg:text-[42px] !leading-[1.45] text-[#FFE082] mt-3 pb-1">
                આજનું યોગ્ય માર્ગદર્શન,
                <span className="block text-white">આવતીકાલનું ઉજ્જવળ ભવિષ્ય.</span>
              </h1>
              <p className="mt-4 max-w-[600px] font-body text-[16px] lg:text-[18px] leading-[1.7] text-white/90">
                અનુભવી શિક્ષકો, ગુણવત્તાસભર અભ્યાસ, નિયમિત પરીક્ષણ અને વ્યક્તિગત માર્ગદર્શન સાથે હજારો વિદ્યાર્થીઓના વિશ્વાસનું નામ — વિવેકાનંદ ટ્યુશન ક્લાસીસ.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Btn to="/admission" className="bg-[#FF6600] text-white hover:bg-[#E65100] text-base font-bold px-8 py-3.5 shadow-lg flex items-center gap-2">
                  <Check className="w-5 h-5" /> આજે જ પ્રવેશ લો
                </Btn>
                <Btn href={`https://wa.me/${SITE.whatsapp}`} className="bg-[#420405] text-white border border-white/30 hover:bg-[#58070A] text-base font-bold px-8 py-3.5 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" /> વોટ્સએપ પર સંપર્ક કરો
                </Btn>
              </div>
            </Reveal>

            {/* Right - Hero Banner Slider */}
            <Reveal delay={0.2}>
              <div className="relative flex items-center justify-center w-full min-h-[350px] sm:min-h-[500px]">
                <div className="relative w-full max-w-[550px] aspect-[4/3] sm:aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl bg-black/20">
                  {banners.length > 0 ? (
                    banners.map((b, idx) => (
                      <div
                        key={b._id || idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                          idx === activeBanner ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                      >
                        <img
                          src={b.image_url}
                          alt={b.title || "વિવેકાનંદ સ્લાઇડર"}
                          className="w-full h-full object-cover"
                        />
                        {b.title && (
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs text-white p-3 text-center text-sm font-semibold">
                            {b.title}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    // Default Fallback Hero Image
                    <img
                      src={settings?.hero_banner_url || "/swami-vivekanand-hero.png"}
                      alt="સંસ્થા મુખ્ય ચિત્ર"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/swami-vivekanand-hero.png'; }}
                    />
                  )}
                  
                  {/* Slider Indicators */}
                  {banners.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                      {banners.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveBanner(idx)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            idx === activeBanner ? "bg-[#FF6600] w-6" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== NOTICE MARQUEE ===== */}
      <Marquee items={marqueeItems} />

      {/* ===== YOUTUBE VIDEOS PREVIEW (HEADER BELO) ===== */}
      <section className="bg-background py-16 lg:py-[90px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading
              label="વિડિઓ ગેલેરી"
              title="અમારા ખાસ વિડિઓઝ"
              subtitle="વિવેકાનંદ ટ્યુશન ક્લાસીસના યુટ્યુબ વિડિઓઝ જુઓ."
            />
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.length > 0 ? (
              videos.slice(0, 6).map((v, i) => {
                const details = getYouTubeDetails(v.youtube_url);
                const thumb = v.thumbnail_url || details.thumbnailUrl;
                return (
                  <Reveal key={v._id || i} delay={i * 0.1}>
                    <div
                      onClick={() => setActiveVideoModal(details.embedUrl)}
                      className="card-hover group border border-border bg-white overflow-hidden h-full cursor-pointer"
                    >
                      <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                        {thumb ? (
                          <img src={thumb} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <ImgPlaceholder label="વિડિયો થમ્બનેલ" ratio="16/9" className="border-0" showLabel={false} />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/20 group-hover:bg-primary/35 transition-colors">
                          <div className="flex items-center justify-center w-14 h-14 bg-accent text-white rounded-full shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 ml-1" fill="white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading font-bold text-[16px] text-foreground line-clamp-2">{v.title}</h3>
                        {v.category && <span className="inline-block mt-2 text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5">{v.category}</span>}
                      </div>
                    </div>
                  </Reveal>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-muted-foreground font-body">
                કોઈ વિડિયોઝ હાલ ઉપલબ્ધ નથી.
              </div>
            )}
          </div>
          <Reveal>
            <div className="mt-8 text-center">
              <Btn to="/gallery" variant="primary" size="md" iconRight={ArrowRight}>
                વધુ વિડિઓઝ જુઓ
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== ABOUT PREVIEW ===== */}
      <section className="bg-white py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <div className="relative">
                {settings?.classroom_img_url || settings?.about_banner_url || settings?.hero_banner_url ? (
                  <img
                    src={settings.classroom_img_url || settings.about_banner_url || settings.hero_banner_url}
                    alt="ક્લાસરૂમ અને કેમ્પસ છબી"
                    className="w-full aspect-[4/5] object-cover border-4 border-[#7a1d1d] shadow-2xl"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/swami-vivekanand-hero.png'; }}
                  />
                ) : (
                  <img
                    src="/swami-vivekanand-hero.png"
                    alt="ક્લાસરૂમ અને કેમ્પસ છબી"
                    className="w-full aspect-[4/5] object-cover border-4 border-[#7a1d1d] shadow-2xl bg-[#58070A]"
                  />
                )}
                <div className="absolute -bottom-6 -left-6 bg-primary text-white px-8 py-6 premium-shadow-lg hidden sm:block">
                  <div className="font-heading font-extrabold text-4xl text-golden">15+</div>
                  <div className="font-body text-[14px] mt-1">વર્ષનો અનુભવ</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <SectionHeading
                label="અમારા વિશે"
                align="left"
                title="ગુજરાતની વિશ્વાસપાત્ર શૈક્ષણિક સંસ્થા"
              />
              <p className="mt-5 font-body text-[18px] leading-[1.8] text-muted-foreground">
                વિવેકાનંદ ટ્યુશન ક્લાસીસ માત્ર ટ્યુશન સંસ્થા નથી, પરંતુ વિદ્યાર્થીઓના સર્વાંગી વિકાસ માટે પ્રતિબદ્ધ એક શૈક્ષણિક પરિવાર છે. વર્ષોના અનુભવ, ગુણવત્તાસભર શિક્ષણ, અનુભવી શિક્ષકો અને પરિણામકેન્દ્રિત અભ્યાસક્રમ દ્વારા અમે વિદ્યાર્થીઓને સફળતાની દિશામાં આગળ વધારીએ છીએ.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: BookOpen, title: 'અનુભવી શિક્ષકો', desc: 'વિષય નિષ્ણાત શિક્ષકો.' },
                  { icon: Award, title: 'શ્રેષ્ઠ પરિણામો', desc: 'દર વર્ષે ઉત્તમ પરિણામ.' },
                  { icon: UserCheck, title: 'વ્યક્તિગત માર્ગદર્શન', desc: 'દરેક વિદ્યાર્થી પર ખાસ ધ્યાન.' },
                ].map((f, i) => (
                  <Reveal key={f.title} delay={0.2 + i * 0.1}>
                    <div className="card-hover border border-border p-5 h-full">
                      <f.icon className="w-7 h-7 text-accent mb-3" strokeWidth={1.8} />
                      <div className="font-heading font-bold text-[16px] text-foreground">{f.title}</div>
                      <div className="font-body text-[14px] text-muted-foreground mt-1">{f.desc}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <div className="mt-8">
                <Btn to="/about" variant="primary" size="md" iconRight={ArrowRight}>
                  વધુ જાણો
                </Btn>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="bg-background py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading
              label="અમારી ખાસિયતો"
              title="શા માટે પસંદ કરો વિવેકાનંદ ટ્યુશન ક્લાસીસ?"
              subtitle="ગુણવત્તાસભર શિક્ષણ અને વ્યક્તિગત માર્ગદર્શન સાથે વિદ્યાર્થીઓના ઉજ્જવળ ભવિષ્ય માટે પ્રતિબદ્ધ."
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <Reveal key={item.num} delay={i * 0.08}>
                  <div className="card-hover group border border-border bg-white p-7 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      {Icon && <Icon className="w-9 h-9 text-accent transition-transform duration-300 group-hover:rotate-6" strokeWidth={1.8} />}
                      <span className="font-display font-extrabold text-2xl text-border">{item.num}</span>
                    </div>
                    <h3 className="font-heading font-bold text-[18px] text-foreground mb-2">{item.title}</h3>
                    <p className="font-body text-[14px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== COURSES PREVIEW ===== */}
      <section className="bg-white py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading
              label="અભ્યાસક્રમો"
              title="અમારા અભ્યાસક્રમો"
              subtitle="દરેક વિદ્યાર્થી માટે યોગ્ય માર્ગદર્શન અને પરિણામ આધારિત અભ્યાસ."
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.slice(0, 4).map((course, i) => {
              const Icon = ICONS[course.icon] || BookOpen;
              return (
                <Reveal key={course._id || course.id} delay={i * 0.1}>
                  <div className="card-hover border border-border bg-white overflow-hidden h-full flex flex-col shadow-sm">
                    {/* Top Maroon Header Badge */}
                    <div className="bg-[#640D0D] text-white p-5 relative flex items-center gap-3">
                      {course.badge && (
                        <span className="absolute -top-1 right-2 bg-[#FF6600] text-white text-[10px] font-bold px-2 py-0.5 shadow">
                          {course.badge}
                        </span>
                      )}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FF6600] text-white shrink-0 shadow">
                        <Icon className="w-5 h-5" strokeWidth={2} />
                      </div>
                      <h3 className="font-heading font-extrabold text-[18px] text-white !leading-[1.5] pb-1">
                        {course.name}
                      </h3>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-body text-[14px] text-muted-foreground leading-relaxed mb-4">
                          {course.description}
                        </p>
                        <ul className="space-y-2 mb-5">
                          {(course.features || []).slice(0, 6).map((f) => (
                            <li key={f} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-[#27AE60] flex-shrink-0" strokeWidth={3} />
                              <span className="font-body text-[13px] text-foreground font-medium">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="pt-3 border-t border-border/80 text-[12px] text-muted-foreground space-y-1 mb-4">
                          <div>📅 સમયગાળો: <span className="font-semibold text-foreground">{course.duration}</span></div>
                          <div>🏫 ક્લાસ: <span className="font-semibold text-foreground">{course.classes}</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to="/courses"
                            className="bg-[#FF6600] hover:bg-[#E65100] text-white font-heading font-bold text-xs py-2.5 text-center shadow transition-colors"
                          >
                            વધુ માહિતી
                          </Link>
                          <Link
                            to="/admission"
                            className="border border-border text-foreground hover:bg-muted font-heading font-bold text-xs py-2.5 text-center transition-colors"
                          >
                            પ્રવેશ લો
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal>
            <div className="mt-10 text-center">
              <Btn to="/courses" variant="outline" size="md" iconRight={ArrowRight}>
                બધા અભ્યાસક્રમો જુઓ
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="bg-background py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Reveal>
              <div className="bg-primary text-white p-10 lg:p-12 h-full relative overflow-hidden">
                <Target className="absolute top-6 right-6 w-24 h-24 text-white/5" strokeWidth={1} />
                <Target className="w-12 h-12 text-golden mb-5" strokeWidth={1.8} />
                <h3 className="font-heading font-extrabold text-3xl mb-4">અમારું ધ્યેય</h3>
                <p className="font-body text-[18px] leading-[1.8] text-white/85">
                  દરેક વિદ્યાર્થીમાં જ્ઞાન, શિસ્ત, આત્મવિશ્વાસ અને જવાબદારીનો વિકાસ કરીને તેને ઉજ્જવળ ભવિષ્ય માટે તૈયાર કરવો.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="bg-secondary text-white p-10 lg:p-12 h-full relative overflow-hidden">
                <Eye className="absolute top-6 right-6 w-24 h-24 text-white/5" strokeWidth={1} />
                <Eye className="w-12 h-12 text-golden mb-5" strokeWidth={1.8} />
                <h3 className="font-heading font-extrabold text-3xl mb-4">અમારું વિઝન</h3>
                <p className="font-body text-[18px] leading-[1.8] text-white/85">
                  ગુજરાતની સૌથી વિશ્વાસપાત્ર અને પરિણામકેન્દ્રિત શૈક્ષણિક સંસ્થા તરીકે વિદ્યાર્થીઓ અને વાલીઓનો પ્રથમ વિશ્વાસ બનવો.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== RESULTS PREVIEW ===== */}
      <section className="bg-primary text-white py-20 lg:py-[120px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 lg:px-8 text-center">
          <Reveal>
            <SectionHeading
              label="પરિણામો"
              title="અમારા ગૌરવપૂર્ણ પરિણામો"
              subtitle="અમારા વિદ્યાર્થીઓની સફળતા અમારી સૌથી મોટી ઓળખ છે."
              light
            />
          </Reveal>
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {displayStats.map((stat, i) => {
              const Icon = ICONS[stat.icon];
              return (
                <Reveal key={stat.label} delay={i * 0.1}>
                  <div className="border border-white/15 p-8">
                    {Icon && <Icon className="w-10 h-10 text-golden mx-auto mb-4" strokeWidth={1.8} />}
                    <div className="font-heading font-extrabold text-4xl lg:text-5xl text-white">
                      <StatCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="mt-2 font-body text-[16px] text-white/75">{stat.label}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal>
            <div className="mt-12">
              <Btn to="/results" variant="golden" size="md" iconRight={ArrowRight}>
                બધા પરિણામો જુઓ
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== GALLERY PREVIEW ===== */}
      <section className="bg-white py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading
              label="ગેલેરી"
              title="અમારી પ્રવૃત્તિઓ"
              subtitle="વર્ગખંડથી લઈને સફળતા સુધીની યાદગાર ક્ષણો."
            />
          </Reveal>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {photos.length > 0 ? (
              photos.slice(0, 8).map((photo, i) => (
                <Reveal key={photo._id || i} delay={i * 0.06}>
                  <div className="group relative overflow-hidden border border-border aspect-square cursor-pointer">
                    {photo.image_url ? (
                      <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ImgPlaceholder label={photo.title || "ગેલેરી"} ratio="1/1" className="border-0 group-hover:scale-105 transition-transform duration-500" showLabel={false} />
                    )}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex items-end p-4">
                      <span className="text-white font-heading font-bold text-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">{photo.title || photo.label}</span>
                    </div>
                  </div>
                </Reveal>
              ))
            ) : (
              ['વર્ગખંડ', 'પ્રવૃત્તિઓ', 'પારિતોષિક વિતરણ', 'વાલી મીટિંગ', 'નવોદય બેચ', 'પ્રેક્ટિકલ', 'ઉજવણી', 'સફળતા'].map((label, i) => (
                <Reveal key={label} delay={i * 0.06}>
                  <div className="group relative overflow-hidden border border-border aspect-square cursor-pointer">
                    <ImgPlaceholder label={label} ratio="1/1" className="border-0 group-hover:scale-105 transition-transform duration-500" showLabel={false} />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors duration-300 flex items-end p-4">
                      <span className="text-white font-heading font-bold text-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">{label}</span>
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>
          <Reveal>
            <div className="mt-10 text-center">
              <Btn to="/gallery" variant="outline" size="md" iconRight={ArrowRight}>
                સંપૂર્ણ ગેલેરી જુઓ
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== NOTICES & ANNOUNCEMENTS SECTION ===== */}
      {notices.length > 0 && (
        <section className="bg-[#FAF5EE] py-16 lg:py-20 border-t border-b border-border/60">
          <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
            <Reveal>
              <SectionHeading
                label="જાહેરાતો"
                title="મહત્વપૂર્ણ સૂચનાઓ અને નવી જાહેરાતો"
                subtitle="વિવેકાનંદ ટ્યુશન ક્લાસીસની તાજી સત્તાવાર જાહેરાતો."
              />
            </Reveal>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.map((n, i) => (
                <Reveal key={n._id || i} delay={i * 0.08}>
                  <div className="bg-white border-2 border-[#7a1d1d]/20 p-6 rounded-none shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="bg-[#7a1d1d] text-white text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider">
                          {n.priority === 'high' ? 'ખાસ જાહેરાત' : 'સૂચના'}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                          <Bell className="w-3.5 h-3.5 text-accent" />
                          {new Date(n.createdAt || Date.now()).toLocaleDateString('gu-IN')}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-lg text-[#7a1d1d] mb-2">
                        {n.title}
                      </h3>
                      <p className="font-body text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                        {n.content}
                      </p>
                    </div>

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
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* ===== VIDEO MODAL PLAYER ===== */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden aspect-video shadow-2xl">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-3 right-3 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              src={activeVideoModal}
              title="YouTube Video"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ===== FAQ SECTION ===== */}
      <FaqSection limit={5} />

      {/* ===== FREE DEMO CTA ===== */}
      <section className="bg-accent text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <Reveal>
            <h2 className="font-heading font-extrabold text-3xl md:text-[40px] !leading-[1.5] md:!leading-[1.45] pb-1">
              મફત ડેમો ક્લાસ બુક કરો
            </h2>
            <p className="mt-3 font-body text-[18px] text-white/85 max-w-xl">
              પસંદ કરેલા કોર્સ માટે મફત ડેમો ક્લાસ ઉપલબ્ધ છે. આજે જ બુક કરો.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Btn to="/admission" variant="maroon" size="lg" iconRight={ArrowRight}>
                આજે જ બુક કરો
              </Btn>
              <Btn href={`tel:${SITE.phoneRaw}`} variant="white" size="lg" icon={Phone}>
                કોલ કરો
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}