import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Facebook, Phone, Mail, MapPin, Send, ChevronRight } from 'lucide-react';
import { SITE, NAV_ITEMS, COURSES } from '@/data/site';
import Logo from './Logo';
import { apiClient } from '@/api/apiClient';

const SOCIAL_ICONS = { Instagram, Youtube, Facebook };

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiClient.get('/settings');
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        if (data && data.length > 0) setSettings(data[0]);
      } catch (e) {
        console.error("Failed to fetch footer settings:", e);
      }
    };
    fetchSettings();
  }, []);

  const phone = settings?.phone || SITE.phone;
  const phoneRaw = settings?.phone ? settings.phone.replace(/[^0-9]/g, '') : SITE.phoneRaw;
  const email = settings?.email || SITE.email;
  const address = settings?.address || SITE.address;
  const name = settings?.institute_name || SITE.name;

  const socialLinks = [
    { name: "Instagram", url: settings?.social_links?.instagram || "https://instagram.com", icon: "Instagram" },
    { name: "YouTube", url: settings?.social_links?.youtube || "https://youtube.com", icon: "Youtube" },
    { name: "Facebook", url: settings?.social_links?.facebook || "https://facebook.com", icon: "Facebook" }
  ];

  return (
    <footer className="bg-[#180404] text-white relative overflow-hidden">
      {/* Footer Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span className="font-heading font-extrabold text-[24px] sm:text-[45px] md:text-[60px] lg:text-[72px] text-white/[0.05] leading-none whitespace-nowrap transform -rotate-[12deg] tracking-wider">
          વિવેકાનંદ ટ્યુશન ક્લાસીસ
        </span>
      </div>

      <div className="relative z-10 max-w-[1320px] mx-auto px-4 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Institute */}
          <div>
            <div className="mb-6 [&_a]:!text-white">
              <Logo light />
            </div>
            <p className="font-body text-[15px] leading-[1.8] text-white/75 mb-6">
              વિદ્યાર્થીઓના ઉજ્જવળ ભવિષ્ય માટે ગુણવત્તાસભર શિક્ષણ અને વિશ્વાસપાત્ર માર્ગદર્શન.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon];
                return Icon ? (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="flex items-center justify-center w-10 h-10 border border-white/20 hover:border-golden hover:bg-golden transition-all duration-250"
                  >
                    <Icon className="w-4 h-4 text-golden" strokeWidth={1.8} />
                  </a>
                ) : null;
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-[18px] text-golden mb-6 tracking-wide">
              ઝડપી લિંક્સ
            </h3>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 font-body text-[15px] text-white/75 hover:text-golden transition-colors group"
                  >
                    <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-heading font-bold text-[18px] text-golden mb-6 tracking-wide">
              અમારા કોર્સ
            </h3>
            <ul className="space-y-3">
              {COURSES.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/courses"
                    className="flex items-center gap-2 font-body text-[15px] text-white/75 hover:text-golden transition-colors group"
                  >
                    <ChevronRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-[18px] text-golden mb-6 tracking-wide">
              સંપર્ક
            </h3>
            <ul className="space-y-4 mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                <span className="font-body text-[15px] text-white/75 leading-relaxed">{address}</span>
              </li>
              <li>
                <a href={`tel:${phoneRaw}`} className="flex items-center gap-3 text-white/75 hover:text-golden transition-colors">
                  <Phone className="w-5 h-5 text-accent flex-shrink-0" strokeWidth={1.8} />
                  <span className="font-display text-[15px]">{phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-3 text-white/75 hover:text-golden transition-colors">
                  <Mail className="w-5 h-5 text-accent flex-shrink-0" strokeWidth={1.8} />
                  <span className="font-body text-[15px]">{email}</span>
                </a>
              </li>
            </ul>
            {/* Newsletter */}
            <div className="flex items-center border border-white/20">
              <input
                type="email"
                placeholder="તમારું ઇમેઇલ સરનામું"
                className="flex-1 bg-transparent px-4 py-3 text-[14px] text-white placeholder:text-white/40 outline-none font-body"
              />
              <button className="flex items-center justify-center w-12 h-12 bg-accent hover:bg-[#D96D00] transition-colors flex-shrink-0" aria-label="સબ્સ્ક્રાઈબ">
                <Send className="w-4 h-4 text-white" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-7 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="font-body text-[14px] text-white/60">
            © 2025 {name}. સર્વાધિકાર સુરક્ષિત.
          </p>
          <p className="font-body text-[14px] text-white/60">
            વિદ્યાર્થીઓની સફળતા માટે ❤ સાથે બનાવેલ
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="font-body text-[14px] text-white/60 hover:text-golden transition-colors">
              ગોપનીયતા નીતિ
            </Link>
            <Link to="/terms" className="font-body text-[14px] text-white/60 hover:text-golden transition-colors">
              નિયમો અને શરતો
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}