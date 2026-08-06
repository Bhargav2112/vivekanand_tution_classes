import { useState, useEffect } from 'react';
import {
  Check, ArrowRight, Target, Eye, Heart, ShieldCheck, BookOpen, Lightbulb, Flag,
  Users, Award, UserCheck, Building2, BookMarked,
} from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Btn from '@/components/ui/Btn';
import ImgPlaceholder from '@/components/ui/ImgPlaceholder';
import Reveal from '@/components/site/Reveal';
import { VALUES } from '@/data/site';
import { apiClient } from '@/api/apiClient';
import { useTranslation } from 'react-i18next';

const VALUE_ICONS = { Heart, ShieldCheck, BookOpen, Lightbulb, Flag, Target };

export default function About() {
  const { t } = useTranslation();
  const T_VALUES = t("values_data", { returnObjects: true });
  const [teachers, setTeachers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [shortVideos, setShortVideos] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, settingsRes, shortsRes] = await Promise.allSettled([
          apiClient.get('/teachers'),
          apiClient.get('/settings'),
          apiClient.get('/youtube/shorts')
        ]);
        if (teacherRes.status === 'fulfilled') {
          const data = Array.isArray(teacherRes.value.data) ? teacherRes.value.data : (teacherRes.value.data?.data || []);
          setTeachers(data);
        }
        if (settingsRes.status === 'fulfilled') {
          const data = Array.isArray(settingsRes.value.data) ? settingsRes.value.data : (settingsRes.value.data?.data || []);
          if (data && data.length > 0) setSettings(data[0]);
        }
        if (shortsRes.status === 'fulfilled') {
          const data = Array.isArray(shortsRes.value.data) ? shortsRes.value.data : (shortsRes.value.data?.data || []);
          setShortVideos(data.filter(v => v.isActive));
        }
      } catch (err) {
        console.error("Failed to fetch about data:", err);
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <PageHero
        title={t("nav.about")}
        subtitle={t("about.hero_subtitle")}
        breadcrumb={[{ label: t("nav.about") }]}
      />

      {/* About Detail */}
      <section className="bg-white py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <div className="relative">
                {settings?.about_banner_url || settings?.classroom_img_url ? (
                  <img
                    src={settings.about_banner_url || settings.classroom_img_url}
                    alt="સંસ્થા કેમ્પસ અને ક્લાસરૂમ"
                    className="w-full aspect-[4/3] object-cover border-4 border-[#7a1d1d] shadow-xl rounded-none"
                  />
                ) : (
                  <img
                    src="/swami-vivekanand-hero.png"
                    alt="સંસ્થા છબી"
                    className="w-full aspect-[4/3] object-cover border-4 border-[#7a1d1d] shadow-xl bg-[#58070A]"
                  />
                )}
                <div className="absolute -bottom-6 -left-6 bg-primary text-white px-8 py-6 premium-shadow-lg hidden sm:block">
                  <div className="font-heading font-extrabold text-4xl text-golden">{t("stats_data.2.value" , "15")}+</div>
                  <div className="font-body text-[14px] mt-1">{t("home.stats_experience")}</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <SectionHeading label={t("nav.about")} align="left" title={t("home.about_title")} />
              <p className="mt-5 font-body text-[18px] leading-[1.8] text-muted-foreground">
                {t("home.about_desc")}
              </p>
              <p className="mt-4 font-body text-[18px] leading-[1.8] text-muted-foreground">
                {t("about.mission_desc_2")}
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Users, title: t("home.about_f1_title"), desc: t("home.about_f1_desc") },
                  { icon: Award, title: t("home.about_f2_title"), desc: t("home.about_f2_desc") },
                  { icon: UserCheck, title: t("home.about_f3_title"), desc: t("home.about_f3_desc") },
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
            </Reveal>
          </div>
        </div>
      </section>

      {/* Shorts Videos */}
      {shortVideos && shortVideos.length > 0 && (
        <section className="bg-background py-16 lg:py-24 border-t border-border">
          <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
            <Reveal>
              <SectionHeading label={t("about.shorts_label")} title={t("about.shorts_title")} subtitle={t("about.shorts_desc")} />
            </Reveal>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {shortVideos.map((video, i) => {
                let embedUrl = video.embedUrl || video.youtube_url;
                if (video.videoId) {
                  embedUrl = `https://www.youtube.com/embed/${video.videoId}?rel=0`;
                } else {
                  const ytId = String(embedUrl).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
                  if (ytId && ytId[1]) {
                    embedUrl = `https://www.youtube.com/embed/${ytId[1]}?rel=0`;
                  }
                }
                return (
                  <Reveal key={video._id || i} delay={i * 0.1}>
                    <div className="card-hover border border-border bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                      <div className="aspect-[9/16] relative bg-black">
                        <iframe
                          src={embedUrl}
                          title={video.title}
                          className="absolute inset-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="p-4 bg-white flex-1 flex items-center">
                        <h3 className="font-heading font-bold text-[16px] text-foreground line-clamp-2">{video.title}</h3>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Faculty - Right below Gujarat's Trusted Institution section */}
      <section className="bg-background py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading label={t("about.faculty_label")} title={t("about.faculty_title")} subtitle={t("about.faculty_desc")} />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingTeachers ? (
              <div className="col-span-full py-8 text-center text-muted-foreground font-body">{t("about.loading")}</div>
            ) : teachers.length > 0 ? (
              teachers.map((t, i) => (
                <Reveal key={t._id || i} delay={i * 0.1}>
                  <div className="card-hover group border border-border bg-white overflow-hidden h-full flex flex-col">
                    <div className="aspect-[3/4] overflow-hidden bg-slate-100 relative">
                      {t.photo_url ? (
                        <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <ImgPlaceholder label="શિક્ષક છબી" ratio="3/4" className="border-0 group-hover:scale-105 transition-transform duration-500" showLabel={false} />
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-heading font-bold text-[18px] text-foreground">{t.name}</h3>
                        <p className="font-body text-[14px] text-accent font-semibold mt-1">{t.subject}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[13px] text-muted-foreground">
                        <span>{t.experience || ''}</span>
                        <span>{t.qualification || ''}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-muted-foreground font-body">
                {t("about.no_teachers")}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Director Message */}
      <section className="bg-background py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 lg:gap-16 items-center">
              <div className="relative">
                {settings?.founder_img_url ? (
                  <img
                    src={settings.founder_img_url}
                    alt="સ્થાપક છબી"
                    className="w-full aspect-square object-cover border-4 border-[#7a1d1d] shadow-xl rounded-xl"
                  />
                ) : (
                  <ImgPlaceholder label="સ્થાપક છબી" ratio="1/1" className="premium-shadow" iconClassName="w-14 h-14" />
                )}
              </div>
            <Reveal delay={0.15}>
              <SectionHeading label={t("about.msg_label")} align="left" title={t("about.msg_title")} />
              <p className="mt-6 font-body text-[20px] leading-[1.9] text-muted-foreground italic">
                {t("about.founder_msg")}
              </p>
              <div className="mt-6">
                <div className="font-heading font-bold text-[20px] text-golden">{t("about.founder_name")}</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Reveal>
              <div className="bg-primary text-white p-10 lg:p-12 h-full relative overflow-hidden">
                <Target className="absolute top-6 right-6 w-24 h-24 text-white/5" strokeWidth={1} />
                <Target className="w-12 h-12 text-golden mb-5" strokeWidth={1.8} />
                <h3 className="font-heading font-extrabold text-3xl mb-4">{t("home.mission")}</h3>
                <p className="font-body text-[18px] leading-[1.8] text-white/85">
                  {t("home.mission_desc")}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="bg-secondary text-white p-10 lg:p-12 h-full relative overflow-hidden">
                <Eye className="absolute top-6 right-6 w-24 h-24 text-white/5" strokeWidth={1} />
                <Eye className="w-12 h-12 text-golden mb-5" strokeWidth={1.8} />
                <h3 className="font-heading font-extrabold text-3xl mb-4">{t("home.vision")}</h3>
                <p className="font-body text-[18px] leading-[1.8] text-white/85">
                  {t("home.vision_desc")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values Timeline */}
      <section className="bg-background py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading label={t("about.values_label")} title={t("about.values_title")} subtitle={t("about.values_desc")} />
          </Reveal>
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="relative pl-8 border-l-2 border-accent space-y-8">
              {Array.isArray(T_VALUES) && T_VALUES.map((val, i) => {
                const Icon = VALUE_ICONS[val.icon] || Target;
                return (
                  <Reveal key={val.title} delay={i * 0.1}>
                    <div className="relative">
                      <div className="absolute -left-[41px] flex items-center justify-center w-12 h-12 bg-accent text-white">
                        <Icon className="w-6 h-6" strokeWidth={1.8} />
                      </div>
                      <div className="bg-white border border-border p-6 ml-4 card-hover">
                        <h3 className="font-heading font-bold text-[20px] text-foreground mb-2">{val.title}</h3>
                        <p className="font-body text-[16px] text-muted-foreground leading-relaxed">{val.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>



      {/* CTA */}
      <section className="bg-accent text-white py-16 lg:py-20">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-heading font-extrabold text-3xl md:text-[40px] !leading-[1.5] md:!leading-[1.45] pb-1">
              {t("about.cta_title")}
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