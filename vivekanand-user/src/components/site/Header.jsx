import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Menu, X, Instagram, Youtube, Facebook, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE, SOCIAL as FALLBACK_SOCIAL, NAV_ITEMS } from '@/data/site';
import Logo from './Logo';
import Btn from '@/components/ui/Btn';
import { apiClient } from '@/api/apiClient';

const SOCIAL_ICONS = { Instagram, Youtube, Facebook };

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);
  const [settings, setSettings] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiClient.get('/settings');
        const data = Array.isArray(res.data) ? res.data[0] : (res.data?.data?.[0] || res.data?.data || null);
        if (data) setSettings(data);
      } catch (e) {
        console.error("Failed to fetch settings:", e);
      }
    };
    fetchSettings();
  }, []);

  const phone = settings?.phone || SITE.phone;
  const phoneRaw = settings?.phone ? settings.phone.replace(/[^0-9]/g, '') : SITE.phoneRaw;
  const email = settings?.email || SITE.email;
  const address = settings?.address || SITE.address;

  const socialLinks = [
    { name: "Instagram", url: settings?.social_links?.instagram || FALLBACK_SOCIAL[0].url, icon: "Instagram" },
    { name: "YouTube", url: settings?.social_links?.youtube || FALLBACK_SOCIAL[1].url, icon: "Youtube" },
    { name: "Facebook", url: settings?.social_links?.facebook || FALLBACK_SOCIAL[2].url, icon: "Facebook" },
  ];

  const YEARS = Array.from({length: 10}, (_, i) => String(2026 - i));
  const EXAMS = ['ધોરણ 10', 'ધોરણ 12', 'જવાહર નવોદય', 'જ્ઞાન શક્તિ', 'CET', 'ધોરણ 6-9', 'અન્ય'];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div
        className={cn(
          'bg-primary text-white transition-all duration-300 overflow-hidden',
          scrolled ? 'h-0 opacity-0' : 'h-[42px] opacity-100'
        )}
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-5 text-[13px] min-w-0">
            <span className="hidden md:flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-golden flex-shrink-0" />
              <span className="truncate font-body">{address}</span>
            </span>
            <a href={`tel:${phoneRaw}`} className="flex items-center gap-1.5 hover:text-golden transition-colors flex-shrink-0">
              <Phone className="w-3.5 h-3.5 text-golden" />
              <span className="font-display">{phone}</span>
            </a>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <a href={`mailto:${email}`} className="hidden lg:flex items-center gap-1.5 text-[13px] hover:text-golden transition-colors">
              <Mail className="w-3.5 h-3.5 text-golden" />
              <span className="font-body truncate">{email}</span>
            </a>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2.5">
              {socialLinks.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon];
                return Icon && s.url ? (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="text-golden hover:text-white transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.8} />
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={cn(
          'bg-white border-b transition-all duration-300',
          scrolled ? 'border-border shadow-[0_4px_20px_rgba(0,0,0,0.06)] h-[70px] md:h-[80px]' : 'border-transparent h-[80px] md:h-[90px]'
        )}
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 h-full flex items-center justify-between gap-4">
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              const hasDropdown = item.label === "પરિણામ";

              return (
                <div 
                  key={item.path} 
                  className="relative group"
                  onMouseEnter={() => hasDropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => {
                    setActiveDropdown(null);
                    setActiveSubDropdown(null);
                  }}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      'relative px-3.5 py-2 font-heading text-[18px] font-semibold tracking-[0.3px] transition-colors duration-250 flex items-center gap-1',
                      active ? 'text-accent' : 'text-foreground hover:text-accent'
                    )}
                  >
                    {item.label}
                    {hasDropdown && <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />}
                    <span
                      className={cn(
                        'absolute bottom-0 left-0 right-0 h-[2px] bg-accent transition-all duration-250',
                        active ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                      )}
                    />
                  </Link>

                  {/* Level 1 Dropdown (Years) */}
                  {hasDropdown && (
                    <div 
                      className={cn(
                        "absolute top-full left-0 mt-0 w-48 bg-white border border-border shadow-xl rounded-b-md overflow-hidden transition-all duration-200 transform origin-top-left z-50",
                        activeDropdown === item.label ? "opacity-100 scale-y-100 pointer-events-auto visible" : "opacity-0 scale-y-0 pointer-events-none invisible"
                      )}
                    >
                      <div className="py-2 h-[320px] overflow-y-auto no-scrollbar">
                        {YEARS.map(year => (
                          <div 
                            key={year}
                            className="relative group/sub"
                            onMouseEnter={() => setActiveSubDropdown(year)}
                          >
                            <Link 
                              to={`/results?year=${year}`}
                              className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent/10 hover:text-accent transition-colors"
                            >
                              <span>{year} ના પરિણામો</span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </Link>

                            {/* Level 2 Dropdown (Exams) */}
                            <div 
                              className={cn(
                                "absolute top-0 left-full ml-0 w-48 bg-white border border-border shadow-xl rounded-md overflow-hidden transition-all duration-200 transform origin-top-left z-50",
                                activeSubDropdown === year ? "opacity-100 scale-100 pointer-events-auto visible" : "opacity-0 scale-95 pointer-events-none invisible"
                              )}
                            >
                              <div className="py-2">
                                <div className="px-4 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border mb-1">{year} પરીક્ષાઓ</div>
                                {EXAMS.map(exam => (
                                  <Link 
                                    key={`${year}-${exam}`}
                                    to={`/results?year=${year}&exam=${exam}`}
                                    className="block px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent/10 hover:text-accent transition-colors"
                                  >
                                    {exam}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#7A0C0C] border border-[#7A0C0C]/30 hover:bg-[#7A0C0C]/5 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#7A0C0C]" />
              હમણાં કોલ કરો
            </a>
            <Link
              to="/admission"
              className="bg-[#FF6600] hover:bg-[#E65100] text-white font-heading font-extrabold text-[15px] tracking-wider px-5 py-2.5 shadow-md transition-all uppercase"
            >
              ADMISSION OPEN
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center justify-center w-11 h-11 text-primary"
            aria-label="મેનુ ખોલો"
          >
            <Menu className="w-7 h-7" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden transition-all duration-300',
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 flex flex-col',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-center justify-between p-5 border-b border-border">
            <Logo />
            <button
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-11 h-11 text-primary"
              aria-label="મેનુ બંધ કરો"
            >
              <X className="w-7 h-7" strokeWidth={2} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-5 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'block px-4 py-3.5 font-heading text-[22px] font-semibold border-l-2 transition-all',
                    active ? 'text-accent border-accent bg-accent/5' : 'text-foreground border-transparent hover:text-accent hover:border-accent hover:bg-accent/5'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-5 border-t border-border space-y-3">
            <Btn href={`tel:${phoneRaw}`} variant="primary" size="md" icon={Phone} fullWidth>
              હમણાં કોલ કરો
            </Btn>
            <Btn to="/admission" variant="maroon" size="md" fullWidth>
              પ્રવેશ શરૂ
            </Btn>
            <div className="flex items-center justify-center gap-5 pt-2">
              {socialLinks.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon];
                return Icon && s.url ? (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="text-accent hover:text-primary transition-colors"
                  >
                    <Icon className="w-6 h-6" strokeWidth={1.8} />
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}