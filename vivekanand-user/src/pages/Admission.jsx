import { useState, useEffect } from 'react';
import { Check, ArrowRight, User, Users, Smartphone, GraduationCap, BookOpen, Building, MapPin, Send } from 'lucide-react';
import { CallIcon, WhatsAppIcon } from '@/components/ui/CustomIcons';
import PageHero from '@/components/site/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Btn from '@/components/ui/Btn';
import Reveal from '@/components/site/Reveal';
import { SITE } from '@/data/site';
import { apiClient } from '@/api/apiClient';
import { useTranslation } from 'react-i18next';

export default function Admission() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    studentName: '', parentName: '', mobile: '', whatsapp: '', grade: '', school: '', course: '', city: '', message: '',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiClient.get('/courses');
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses for admission form:", err);
      }
    };
    fetchCourses();
  }, []);

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentName || !form.mobile) {
      alert("કૃપા કરીને નામ અને મોબાઇલ નંબર દાખલ કરો.");
      return;
    }
    setSubmitting(true);
    try {
      // Post strictly to contactenquiries so inquiries land ONLY in 'ઈન્ક્વાયરી / સંપર્ક' section
      await apiClient.post('/contactenquiries', {
        name: form.studentName,
        phone: form.mobile,
        subject: `પ્રવેશ અરજી: ${form.course || 'કોર્સ'} (${form.grade || 'ધોરણ'})`,
        message: `વિદ્યાર્થી: ${form.studentName}\nવાલી: ${form.parentName || '-'}\nવોટ્સએપ: ${form.whatsapp || '-'}\nધોરણ: ${form.grade || '-'}\nશાળા: ${form.school || '-'}\nશહેર: ${form.city || '-'}\nકોર્સ: ${form.course || '-'}\nસંદેશ: ${form.message || '-'}`,
        status: 'new'
      });

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Admission submission error:", err);
      alert("અરજી મોકલવામાં ભૂલ થઈ. કૃપા કરીને ફોર્મ ફરી ચકાસી પ્રયાસ કરો.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <PageHero title={t("admission.success")} breadcrumb={[{ label: t("nav.admission") }]} />
        <section className="bg-white py-20 lg:py-[120px]">
          <div className="max-w-2xl mx-auto px-4 lg:px-8 text-center">
            <Reveal>
              <div className="flex items-center justify-center w-20 h-20 bg-[#27AE60] text-white mx-auto mb-6">
                <Check className="w-10 h-10" strokeWidth={2.5} />
              </div>
              <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground mb-4">
                {t("admission.success")}
              </h2>
              <p className="font-body text-[18px] text-muted-foreground leading-[1.8] mb-8">
                અમારી ટીમ ટૂક સમયમાં તમારો સંપર્ક કરશે.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Btn href={`https://wa.me/${SITE.whatsapp}`} variant="primary" size="md" icon={WhatsAppIcon}>
                  વોટ્સએપ પર સંપર્ક કરો
                </Btn>
                <Btn to="/" variant="secondary" size="md">
                  મુખ્ય પૃષ્ઠ પર જાઓ
                </Btn>
              </div>
            </Reveal>
          </div>
        </section>
      </>
    );
  }

  const FIELDS = [
    { name: 'studentName', label: t("admission.fname"), icon: User, type: 'text', placeholder: t("admission.fname") },
    { name: 'parentName', label: t("admission.pname"), icon: Users, type: 'text', placeholder: t("admission.pname") },
    { name: 'mobile', label: t("contact.phone"), icon: Smartphone, type: 'tel', placeholder: t("contact.phone") },
    { name: 'whatsapp', label: t("admission.phone"), icon: WhatsAppIcon, type: 'tel', placeholder: t("admission.phone") },
    { name: 'grade', label: t("home.class"), icon: GraduationCap, type: 'text', placeholder: t("home.class") },
    { name: 'school', label: t("admission.school"), icon: Building, type: 'text', placeholder: t("admission.school") },
    { name: 'city', label: t("admission.address", "શહેર"), icon: MapPin, type: 'text', placeholder: t("admission.address", "શહેર") },
  ];

  return (
    <>
      <PageHero
        title={t("admission.form_title")}
        subtitle={t("admission.hero_subtitle")}
        breadcrumb={[{ label: t("nav.admission") }]}
      />

      {/* Scholarship Banner */}
      <section className="bg-primary text-white py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <div>
            <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-golden mb-2">સ્કોલરશિપ યોજના</h2>
            <p className="font-body text-[17px] text-white/85 max-w-xl">પ્રતિભાશાળી વિદ્યાર્થીઓ માટે વિશેષ સ્કોલરશિપ ઉપલબ્ધ છે.</p>
          </div>
          <Btn to="/contact" variant="golden" size="md">હવે અરજી કરો</Btn>
        </div>
      </section>

      {/* Admission Form */}
      <section className="bg-white py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left - Info */}
            <Reveal>
              <SectionHeading label={t("nav.admission")} align="left" title={t("admission.form_title")} />
              <p className="mt-5 font-body text-[18px] leading-[1.8] text-muted-foreground">
                {t("admission.form_desc")}
              </p>
              <div className="mt-8 space-y-4">
                <a href={`tel:${SITE.phoneRaw}`} className="flex items-center gap-4 group">
                  <div className="flex items-center justify-center w-12 h-12 bg-accent/10 group-hover:bg-accent transition-colors">
                    <CallIcon className="w-5 h-5 transition-colors" />
                  </div>
                  <div>
                    <div className="font-body text-[13px] text-muted-foreground">ફોન</div>
                    <div className="font-display font-bold text-[16px] text-foreground">{SITE.phone}</div>
                  </div>
                </a>
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="flex items-center justify-center w-12 h-12 bg-accent/10 group-hover:bg-accent transition-colors">
                    <WhatsAppIcon className="w-5 h-5 transition-colors" />
                  </div>
                  <div>
                    <div className="font-body text-[13px] text-muted-foreground">WhatsApp</div>
                    <div className="font-display font-bold text-[16px] text-foreground">{SITE.phone}</div>
                  </div>
                </a>
              </div>

              {/* Admission Steps */}
              <div className="mt-10 bg-background border border-border p-6">
                <h3 className="font-heading font-bold text-[18px] text-foreground mb-4">{t("admission.steps_title")}</h3>
                <ol className="space-y-3">
                  {[
                    t("admission.step1", "સંપર્ક કરો"),
                    t("admission.step2", "કાઉન્સેલિંગ"),
                    t("admission.step3", "ડેમો ક્લાસ"),
                    t("admission.step4", "પ્રવેશ"),
                    t("admission.step5", "અભ્યાસ શરૂ")
                  ].map((step, i) => (
                    <li key={step} className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 bg-accent text-white font-heading font-bold text-[13px] flex-shrink-0">{i + 1}</span>
                      <span className="font-body text-[15px] text-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            {/* Right - Form */}
            <Reveal delay={0.15}>
              <form onSubmit={handleSubmit} className="bg-background border border-border p-8 lg:p-10">
                <h3 className="font-heading font-bold text-[22px] text-foreground mb-6">{t("admission.form_label")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FIELDS.map((f) => (
                    <div key={f.name} className={f.name === 'school' || f.name === 'city' ? 'sm:col-span-1' : ''}>
                      <label className="block font-body text-[14px] font-semibold text-foreground mb-1.5">{f.label}</label>
                      <div className="relative flex">
                        <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" strokeWidth={1.8} />
                        {f.type === 'tel' ? (
                          <div className="flex w-full h-14 border border-[#DDD] bg-white focus-within:border-accent transition-colors">
                            <span className="flex items-center pl-10 pr-2 bg-muted/40 font-display font-semibold text-[14px] text-muted-foreground border-r border-[#DDD] select-none shrink-0">
                              +91
                            </span>
                            <input
                              type="tel"
                              name={f.name}
                              value={form[f.name] ? String(form[f.name]).replace(/^\+91\s?/, "") : ""}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                                setForm({ ...form, [f.name]: digits ? `+91 ${digits}` : "" });
                              }}
                              placeholder={f.placeholder}
                              required={f.name !== 'whatsapp'}
                              className="w-full h-full px-3 bg-transparent text-foreground placeholder:text-muted-foreground/60 font-body text-[15px] focus:outline-none"
                            />
                          </div>
                        ) : (
                          <input
                            type={f.type}
                            name={f.name}
                            value={form[f.name]}
                            onChange={handleChange}
                            placeholder={f.placeholder}
                            required={f.name !== 'whatsapp' && f.name !== 'message'}
                            className="w-full h-14 pl-10 pr-4 border border-[#DDD] bg-white text-foreground placeholder:text-muted-foreground/60 font-body text-[15px] focus:border-accent focus:outline-none transition-colors"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block font-body text-[14px] font-semibold text-foreground mb-1.5">{t("admission.course")}</label>
                    <select
                      name="course"
                      value={form.course}
                      onChange={handleChange}
                      required
                      className="w-full h-14 px-4 border border-[#DDD] bg-white text-foreground font-body text-[15px] focus:border-accent focus:outline-none transition-colors"
                    >
                      <option value="">{t("admission.course")}</option>
                      {courses.map((c) => (
                        <option key={c._id || c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-body text-[14px] font-semibold text-foreground mb-1.5">{t("contact.message")}</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t("contact.message")}
                      rows={4}
                      className="w-full p-4 border border-[#DDD] bg-white text-foreground placeholder:text-muted-foreground/60 font-body text-[15px] focus:border-accent focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-[58px] mt-6 bg-accent text-white font-heading font-bold text-[18px] tracking-[0.2px] hover:bg-[#D96D00] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(245,124,0,0.35)] transition-all duration-250 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" strokeWidth={2} />
                  {submitting ? t("admission.submitting") : t("admission.submit")}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}