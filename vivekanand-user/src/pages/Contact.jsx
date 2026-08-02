import { Phone, Mail, MapPin, MessageCircle, Clock, ArrowRight, Instagram, Youtube, Facebook } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Btn from '@/components/ui/Btn';
import Reveal from '@/components/site/Reveal';
import { SITE, SOCIAL } from '@/data/site';

const SOCIAL_ICONS = { Instagram, Youtube, Facebook };

export default function Contact() {
  const contactItems = [
    { icon: MapPin, label: 'સરનામું', value: SITE.address, href: `https://maps.google.com/?q=${encodeURIComponent(SITE.mapQuery)}` },
    { icon: Phone, label: 'ફોન', value: SITE.phone, href: `tel:${SITE.phoneRaw}` },
    { icon: MessageCircle, label: 'WhatsApp', value: SITE.phone, href: `https://wa.me/${SITE.whatsapp}` },
    { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  ];

  return (
    <>
      <PageHero
        title="અમારો સંપર્ક કરો"
        subtitle="કોઈપણ માહિતી માટે અમારો સંપર્ક કરો. અમારી ટીમ તમને યોગ્ય માર્ગદર્શન આપશે."
        breadcrumb={[{ label: 'સંપર્ક' }]}
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
                  className="card-hover border border-border bg-white p-7 text-center h-full block"
                >
                  <div className="flex items-center justify-center w-14 h-14 bg-accent/10 mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-accent" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-heading font-bold text-[16px] text-foreground mb-2">{item.label}</h3>
                  <p className="font-body text-[14px] text-muted-foreground leading-relaxed">{item.value}</p>
                </a>
              </Reveal>
            ))}
          </div>

          {/* Quick Contact + Hours */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Reveal>
              <div className="bg-primary text-white p-8 h-full">
                <h3 className="font-heading font-bold text-[20px] text-golden mb-4">ઝડપી સંપર્ક</h3>
                <p className="font-body text-[15px] text-white/80 mb-6">તાત્કાલિક માહિતી માટે નીચેના વિકલ્પો વાપરો.</p>
                <div className="flex flex-col gap-3">
                  <Btn href={`tel:${SITE.phoneRaw}`} variant="accent" size="sm" icon={Phone} fullWidth>હમણાં કોલ કરો</Btn>
                  <Btn href={`https://wa.me/${SITE.whatsapp}`} variant="golden" size="sm" icon={MessageCircle} fullWidth>WhatsApp કરો</Btn>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="bg-background border border-border p-8 h-full">
                <h3 className="font-heading font-bold text-[20px] text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" strokeWidth={1.8} /> સમય
                </h3>
                <ul className="space-y-3">
                  <li className="flex justify-between pb-2 border-b border-border">
                    <span className="font-body text-[15px] text-muted-foreground">સોમ - શુક્ર</span>
                    <span className="font-heading font-bold text-[15px] text-foreground">7:00 - 20:00</span>
                  </li>
                  <li className="flex justify-between pb-2 border-b border-border">
                    <span className="font-body text-[15px] text-muted-foreground">શનિ</span>
                    <span className="font-heading font-bold text-[15px] text-foreground">9:00 - 14:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-body text-[15px] text-muted-foreground">રવિ</span>
                    <span className="font-heading font-bold text-[15px] text-accent">રજા</span>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="bg-background border border-border p-8 h-full">
                <h3 className="font-heading font-bold text-[20px] text-foreground mb-4">અમને અનુસરો</h3>
                <p className="font-body text-[15px] text-muted-foreground mb-5">સોશિયલ મીડિયા પર અમે જોડાઓ.</p>
                <div className="flex items-center gap-3">
                  {SOCIAL.map((s) => {
                    const Icon = SOCIAL_ICONS[s.icon];
                    return Icon ? (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.name}
                        className="flex items-center justify-center w-12 h-12 border-2 border-border text-accent hover:border-accent hover:bg-accent hover:text-white transition-all duration-250"
                      >
                        <Icon className="w-5 h-5" strokeWidth={1.8} />
                      </a>
                    ) : null;
                  })}
                </div>
                <div className="mt-6">
                  <Btn to="/admission" variant="primary" size="sm" iconRight={ArrowRight} fullWidth>પ્રવેશ લો</Btn>
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