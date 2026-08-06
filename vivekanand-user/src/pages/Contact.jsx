import { Mail, MapPin, Clock, ArrowRight, Instagram, Youtube, Facebook } from 'lucide-react';
import { CallIcon, WhatsAppIcon } from '@/components/ui/CustomIcons';
import PageHero from '@/components/site/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Btn from '@/components/ui/Btn';
import Reveal from '@/components/site/Reveal';
import { SITE, SOCIAL } from '@/data/site';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const SOCIAL_ICONS = { Instagram, Youtube, Facebook };

export default function Contact() {
  const { t } = useTranslation();
  const contactItems = [
    { icon: "/icons/location.png", isImage: true, label: t("contact.address_label", "સરનામું"), value: SITE.address, href: `https://maps.google.com/?q=${encodeURIComponent(SITE.mapQuery)}` },
    { icon: CallIcon, label: t("contact.phone_label", "ફોન"), value: SITE.phone, href: `tel:${SITE.phoneRaw}` },
    { icon: WhatsAppIcon, label: 'WhatsApp', value: SITE.phone, href: `https://wa.me/${SITE.whatsapp}` },
    { icon: "/icons/mail.png", isImage: true, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  ];

  return (
    <>
      <PageHero
        title={t("nav.contact")}
        subtitle={t("contact.hero_subtitle")}
        breadcrumb={[{ label: t("nav.contact") }]}
      />

      {/* Contact Info Cards */}
      <section className="bg-white py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactItems.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.1}>
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="card-hover border border-border bg-white p-7 text-center h-full block group"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/10 mx-auto mb-4 group-hover:bg-accent transition-colors duration-300">
                    {item.isImage ? (
                      <img src={item.icon} alt={item.label} className="w-6 h-6 object-contain brightness-0 invert-[.4] group-hover:brightness-0 group-hover:invert" />
                    ) : (
                      <item.icon className="w-6 h-6 text-accent group-hover:text-white transition-colors" />
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-[16px] text-foreground mb-2">{item.label}</h3>
                  <p className="font-body text-[14px] text-muted-foreground leading-relaxed">{item.value}</p>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Reveal>
              <div className="bg-primary text-white p-8 h-full">
                <h3 className="font-heading font-bold text-[20px] text-golden mb-4">{t("contact.quick_contact")}</h3>
                <p className="font-body text-[15px] text-white/80 mb-6">{t("contact.quick_desc")}</p>
                <div className="flex flex-col gap-3">
                  <Btn href={`tel:${SITE.phoneRaw}`} variant="accent" size="sm" icon={CallIcon} fullWidth>{t("contact.call_now")}</Btn>
                  <Btn href={`https://wa.me/${SITE.whatsapp}`} variant="golden" size="sm" icon={WhatsAppIcon} fullWidth>{t("contact.whatsapp_now")}</Btn>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="bg-background border border-border p-8 h-full">
                <h3 className="font-heading font-bold text-[20px] text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" strokeWidth={1.8} /> {t("contact.time")}
                </h3>
                <ul className="space-y-3">
                  <li className="flex justify-between pb-2 border-b border-border">
                    <span className="font-body text-[15px] text-muted-foreground">{t("contact.mon_fri")}</span>
                    <span className="font-heading font-bold text-[15px] text-foreground">7:00 - 20:00</span>
                  </li>
                  <li className="flex justify-between pb-2 border-b border-border">
                    <span className="font-body text-[15px] text-muted-foreground">{t("contact.sat")}</span>
                    <span className="font-heading font-bold text-[15px] text-foreground">9:00 - 14:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-body text-[15px] text-muted-foreground">{t("contact.sun")}</span>
                    <span className="font-heading font-bold text-[15px] text-accent">{t("contact.closed")}</span>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="bg-background border border-border p-8 h-full">
                <h3 className="font-heading font-bold text-[20px] text-foreground mb-4">{t("contact.follow_us")}</h3>
                <p className="font-body text-[15px] text-muted-foreground mb-5">{t("contact.follow_desc")}</p>
                <div className="flex items-center gap-3">
                  {SOCIAL.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 transition-all duration-300 hover:-translate-y-1 group/social shadow-sm hover:shadow-md",
                      )}
                      aria-label={social.name}
                    >
                      <img src={social.image} alt={social.name} className="w-6 h-6 object-contain group-hover/social:scale-110 transition-transform" />
                    </a>
                  ))}
                </div>
                <div className="mt-6">
                  <Btn to="/admission" variant="primary" size="sm" iconRight={ArrowRight} fullWidth>{t("home.btn_admission")}</Btn>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section className="bg-background pb-20 lg:pb-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <div className="border-2 border-border overflow-hidden">
              <iframe
                title="Google Map - વિવેકાનંદ ટ્યુશન ક્લાસીસ"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`}
                width="100%"
                height="500"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}