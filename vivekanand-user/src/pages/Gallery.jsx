import { useState, useEffect } from 'react';
import { ArrowRight, Play, Clock, X } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Btn from '@/components/ui/Btn';
import ImgPlaceholder from '@/components/ui/ImgPlaceholder';
import Reveal from '@/components/site/Reveal';
import { apiClient } from '@/api/apiClient';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const CATEGORIES = ['બધા', 'વર્ગખંડ', 'પ્રવૃત્તિઓ', 'પારિતોષિક વિતરણ', 'વાલી મીટિંગ', 'નવોદય'];

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

export default function Gallery() {
  const { t } = useTranslation();
  const [activeCat, setActiveCat] = useState('બધા');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [photoRes, videoRes, shortsRes] = await Promise.all([
          apiClient.get('/galleries'),
          apiClient.get('/youtube/videos'),
          apiClient.get('/youtube/shorts')
        ]);
        const photoData = Array.isArray(photoRes.data) ? photoRes.data : (photoRes.data?.data || []);
        const videoData = Array.isArray(videoRes.data) ? videoRes.data : (videoRes.data?.data || []);
        const shortsData = Array.isArray(shortsRes.data) ? shortsRes.data : (shortsRes.data?.data || []);
        
        setPhotos(photoData);
        // Ensure videos don't include shorts if they were mixed, though they are separate endpoints.
        setVideos(videoData.filter(v => v.isActive !== false));
        // We'll append shorts to the videos section or handle them separately, but the prompt says: "and shorts ma click karu to ema thavu joiae" so let's separate them.
        setShorts(shortsData.filter(s => s.isActive !== false));
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPhotos = activeCat === 'બધા' ? photos : photos.filter((p) => p.category === activeCat);

  useEffect(() => {
    if (!loading && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [loading, window.location.hash]);

  return (
    <>
      <PageHero
        title={t("gallery_page.hero_title")}
        subtitle={t("gallery_page.hero_subtitle")}
        breadcrumb={[{ label: t("nav.gallery") }]}
      />

      {/* Video Gallery - Right below Header/PageHero */}
      <section id="videos" className="bg-background py-20 lg:py-[120px] scroll-mt-20">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading label={t("gallery_page.video_label")} title={t("gallery_page.video_title")} subtitle={t("gallery_page.video_desc")} />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
               <div className="col-span-full py-12 text-center text-muted-foreground">{t("about.loading")}</div>
            ) : videos.length === 0 ? (
               <div className="col-span-full py-12 text-center text-muted-foreground">{t("gallery_page.no_videos")}</div>
            ) : (
              videos.map((v, i) => {
                const details = getYouTubeDetails(v.youtube_url);
                const thumb = v.thumbnailUrl || v.thumbnail_url || details.thumbnailUrl;
                const embed = v.embedUrl || details.embedUrl;
                return (
                  <Reveal key={v._id || i} delay={i * 0.1}>
                    <div
                      onClick={() => setActiveVideoModal(embed)}
                      className="block card-hover group border border-border bg-white overflow-hidden h-full cursor-pointer"
                    >
                      <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                        {thumb ? (
                          <img src={thumb} alt={v.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <ImgPlaceholder label="વિડિયો થમ્બનેલ" ratio="16/9" className="border-0 group-hover:scale-105 transition-transform duration-500" showLabel={false} />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/20 group-hover:bg-primary/30 transition-colors">
                          <div className="flex items-center justify-center w-14 h-14 bg-accent text-white group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 ml-0.5" strokeWidth={2} fill="white" />
                          </div>
                        </div>
                        {v.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 flex items-center gap-1 text-[12px] font-display">
                            <Clock className="w-3 h-3" />{v.duration}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading font-bold text-[15px] text-foreground">{v.title}</h3>
                        {v.category && <span className="inline-block mt-2 text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5">{v.category}</span>}
                      </div>
                    </div>
                  </Reveal>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Shorts Gallery */}
      <section id="shorts" className="bg-slate-50 py-20 lg:py-[120px] scroll-mt-20 border-t border-border">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading label={t("gallery_page.shorts_label")} title={t("gallery_page.shorts_title")} subtitle={t("gallery_page.shorts_desc")} />
          </Reveal>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {loading ? (
               <div className="col-span-full py-12 text-center text-muted-foreground">{t("about.loading")}</div>
            ) : shorts.length === 0 ? (
               <div className="col-span-full py-12 text-center text-muted-foreground">{t("gallery_page.no_shorts")}</div>
            ) : (
              shorts.map((v, i) => {
                const details = getYouTubeDetails(v.youtube_url);
                const thumb = v.thumbnailUrl || v.thumbnail_url || details.thumbnailUrl;
                const embed = v.embedUrl || details.embedUrl;
                return (
                  <Reveal key={v._id || i} delay={i * 0.1}>
                    <div
                      onClick={() => setActiveVideoModal(embed)}
                      className="block card-hover group bg-white overflow-hidden h-full cursor-pointer rounded-xl border border-border shadow-sm"
                    >
                      <div className="relative aspect-[9/16] bg-slate-900 overflow-hidden">
                        {thumb ? (
                          <img src={thumb} alt={v.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <ImgPlaceholder label="શોર્ટ્સ" ratio="9/16" className="border-0 group-hover:scale-105 transition-transform duration-500" showLabel={false} />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 group-hover:bg-primary/40 transition-colors">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 ml-1" fill="white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-heading font-bold text-[13px] text-foreground line-clamp-2">{v.title}</h3>
                      </div>
                    </div>
                  </Reveal>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section id="photos" className="bg-white py-20 lg:py-[120px] scroll-mt-20">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading label={t("gallery_page.photo_label")} title={t("gallery_page.photo_title")} subtitle="" />
          </Reveal>

          {/* Categories */}
          <Reveal>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={cn(
                    'px-5 py-2.5 font-heading font-bold text-[14px] border-2 transition-all duration-250',
                    activeCat === cat
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-foreground border-border hover:border-accent hover:text-accent'
                  )}
                >
                  {cat === 'બધા' ? t("gallery_page.all_photos") : cat}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
               <div className="col-span-full py-12 text-center text-muted-foreground">{t("about.loading")}</div>
            ) : filteredPhotos.length === 0 ? (
               <div className="col-span-full py-12 text-center text-muted-foreground">{t("gallery_page.no_photos")}</div>
            ) : (
              filteredPhotos.map((photo, i) => (
                <Reveal key={photo._id || i} delay={(i % 4) * 0.08}>
                  <div className="group relative overflow-hidden border border-border aspect-square cursor-pointer">
                    {photo.image_url ? (
                       <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover border-0 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                       <ImgPlaceholder label={photo.title || photo.label} ratio="1/1" className="border-0 group-hover:scale-105 transition-transform duration-500" showLabel={false} />
                    )}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex items-end p-4">
                      <span className="text-white font-heading font-bold text-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">{photo.title || photo.label}</span>
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* VIDEO MODAL PLAYER */}
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

      {/* CTA */}
      <section className="bg-accent text-white py-16 lg:py-20">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-heading font-extrabold text-3xl md:text-[40px] !leading-[1.5] md:!leading-[1.45] pb-1">
              {t("results_page.cta_title", "આજે જ તમારા બાળકના ભવિષ્યની શરૂઆત કરો.")}
            </h2>
            <div className="mt-8">
              <Btn to="/admission" variant="maroon" size="lg" iconRight={ArrowRight}>
                {t("home.btn_admission")}
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}