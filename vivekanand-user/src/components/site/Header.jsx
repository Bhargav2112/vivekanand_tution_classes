import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Menu, X, Instagram, Youtube, Facebook, ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE, SOCIAL as FALLBACK_SOCIAL, NAV_ITEMS } from '@/data/site';
import Logo from './Logo';
import Btn from '@/components/ui/Btn';
import { apiClient } from '@/api/apiClient';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

const SOCIAL_ICONS = { Instagram, Youtube, Facebook };

export default function Header() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState(null);
  const [settings, setSettings] = useState(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileExpandedMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div
        className={cn(
          'bg-primary text-white transition-all duration-300 overflow-visible relative z-[60]',
          scrolled ? 'h-0 opacity-0 hidden' : 'h-[42px] opacity-100 flex'
        )}
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 w-full h-full flex items-center justify-between">
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
          <div className="flex items-center gap-4 flex-shrink-0 relative">
            <a href={`mailto:${email}`} className="hidden lg:flex items-center gap-1.5 text-[13px] hover:text-golden transition-colors">
              <Mail className="w-3.5 h-3.5 text-golden" />
              <span className="font-body truncate">{email}</span>
            </a>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 text-[13px] font-semibold hover:text-golden transition-colors py-1"
              >
                <Globe className="w-4 h-4 text-golden" />
                <span>{i18n.language === 'en' ? 'EN' : 'GU'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              
              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-1 w-32 bg-white rounded-md shadow-lg overflow-hidden border border-border z-[70]"
                  >
                    <button 
                      onClick={() => changeLanguage('gu')}
                      className={cn("w-full text-left px-4 py-2 text-sm font-semibold transition-colors", i18n.language === 'gu' ? "bg-primary/10 text-primary" : "text-foreground hover:bg-gray-100")}
                    >
                      ગુજરાતી (GU)
                    </button>
                    <button 
                      onClick={() => changeLanguage('en')}
                      className={cn("w-full text-left px-4 py-2 text-sm font-semibold transition-colors", i18n.language === 'en' ? "bg-primary/10 text-primary" : "text-foreground hover:bg-gray-100")}
                    >
                      English (EN)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
          'bg-white border-b transition-all duration-300 relative z-50',
          scrolled ? 'border-border shadow-[0_4px_20px_rgba(0,0,0,0.06)] h-[70px] md:h-[80px]' : 'border-transparent h-[80px] md:h-[90px]'
        )}
      >
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 h-full flex items-center justify-between gap-4">
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 h-full">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname.startsWith(item.path) && (item.path !== '/' || location.pathname === '/');
              const hasDropdown = Boolean(item.dropdown);

              return (
                <div 
                  key={item.path} 
                  className="relative group h-full flex items-center"
                  onMouseEnter={() => hasDropdown && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      'relative px-3.5 py-2 font-heading text-[18px] font-semibold tracking-[0.3px] transition-colors duration-250 flex items-center gap-1',
                      active ? 'text-accent' : 'text-foreground group-hover:text-accent'
                    )}
                  >
                    {t(item.label)}
                    {hasDropdown && <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />}
                    <span
                      className={cn(
                        'absolute bottom-0 left-0 right-0 h-[2px] bg-accent transition-all duration-250',
                        active ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                      )}
                    />
                  </Link>

                  {/* Desktop Dropdown Mega Menu Style */}
                  <AnimatePresence>
                    {hasDropdown && activeDropdown === item.label && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-0 w-64 bg-white border border-border shadow-2xl rounded-b-lg overflow-hidden z-50 pointer-events-auto"
                      >
                        <div className="py-2 flex flex-col">
                          {item.dropdown.map(dropItem => (
                            <Link 
                              key={dropItem.path}
                              to={dropItem.path}
                              onClick={() => setActiveDropdown(null)}
                              className="px-5 py-3 text-[15px] font-semibold text-foreground hover:bg-accent/5 hover:text-accent transition-colors border-b border-border/40 last:border-0"
                            >
                              {t(dropItem.label)}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
              {t("header.call_now")}
            </a>
            <Link
              to="/admission"
              className="bg-[#FF6600] hover:bg-[#E65100] text-white font-heading font-extrabold text-[15px] tracking-wider px-5 py-2.5 shadow-md transition-all uppercase"
            >
              {t("header.admission_open")}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center justify-center w-11 h-11 text-primary"
            aria-label={t("header.menu_open")}
          >
            <Menu className="w-7 h-7" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed inset-0 z-[100] lg:hidden transition-all duration-300',
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 flex flex-col overflow-hidden',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-center justify-between p-5 border-b border-border bg-gray-50">
            <Logo />
            <button
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center w-11 h-11 text-primary hover:bg-gray-200 rounded-full transition-colors"
              aria-label={t("header.menu_close")}
            >
              <X className="w-7 h-7" strokeWidth={2} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname.startsWith(item.path) && (item.path !== '/' || location.pathname === '/');
              const hasDropdown = Boolean(item.dropdown);
              const isExpanded = mobileExpandedMenu === item.label;

              return (
                <div key={item.path} className="border border-border/50 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between">
                    <Link
                      to={item.path}
                      onClick={() => !hasDropdown && setMobileOpen(false)}
                      className={cn(
                        'flex-1 px-4 py-3 font-heading text-[18px] font-semibold transition-all',
                        active ? 'text-accent bg-accent/5' : 'text-foreground hover:bg-gray-50'
                      )}
                    >
                      {t(item.label)}
                    </Link>
                    {hasDropdown && (
                      <button 
                        onClick={() => setMobileExpandedMenu(isExpanded ? null : item.label)}
                        className="p-4 bg-gray-50/50 hover:bg-gray-100 transition-colors border-l border-border/50"
                      >
                        <ChevronDown className={cn("w-5 h-5 transition-transform duration-300 text-muted-foreground", isExpanded && "rotate-180 text-primary")} />
                      </button>
                    )}
                  </div>
                  
                  {/* Mobile Accordion Dropdown */}
                  <AnimatePresence>
                    {hasDropdown && isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 border-t border-border/50"
                      >
                        <div className="py-2 px-2 flex flex-col">
                          {item.dropdown.map(dropItem => (
                            <Link 
                              key={dropItem.path}
                              to={dropItem.path}
                              onClick={() => setMobileOpen(false)}
                              className="px-4 py-2.5 text-[15px] font-semibold text-muted-foreground hover:text-accent hover:bg-white rounded-md transition-all flex items-center gap-2"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                              {t(dropItem.label)}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>
          <div className="p-5 border-t border-border space-y-3 bg-gray-50">
            <Btn href={`tel:${phoneRaw}`} variant="primary" size="md" icon={Phone} fullWidth>
              {t("header.call_now")}
            </Btn>
            <Btn to="/admission" variant="maroon" size="md" fullWidth>
              {t("header.admission_started")}
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
                    className="text-accent hover:text-primary transition-colors bg-white p-2 rounded-full shadow-sm"
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.8} />
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