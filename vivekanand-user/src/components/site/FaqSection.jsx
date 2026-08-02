import { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Btn from '@/components/ui/Btn';
import Reveal from '@/components/site/Reveal';
import { FAQS as FALLBACK_FAQS } from '@/data/site';
import { apiClient } from '@/api/apiClient';
import { cn } from '@/lib/utils';

export default function FaqSection({ hideHeading = false, limit = null }) {
  const [open, setOpen] = useState(0);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await apiClient.get('/faqs?isActive=true');
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        if (data.length > 0) {
          setFaqs(limit ? data.slice(0, limit) : data);
        } else {
          setFaqs(limit ? FALLBACK_FAQS.slice(0, limit) : FALLBACK_FAQS);
        }
      } catch (err) {
        setFaqs(limit ? FALLBACK_FAQS.slice(0, limit) : FALLBACK_FAQS);
      }
    };
    fetchFaqs();
  }, [limit]);

  return (
    <section className="bg-white py-20 lg:py-[120px]">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        {!hideHeading && (
          <Reveal>
            <SectionHeading label="FAQ" title="સામાન્ય પ્રશ્નો" subtitle="તમારા પ્રશ્નોના જવાબો અહીં છે." />
          </Reveal>
        )}

        <div className={cn("space-y-4", !hideHeading && "mt-12")}>
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={faq._id || i} delay={i * 0.08}>
                <div className={cn('border-2 transition-all duration-300', isOpen ? 'border-accent' : 'border-border')}>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className={cn('w-5 h-5 flex-shrink-0 transition-colors', isOpen ? 'text-accent' : 'text-muted-foreground')} strokeWidth={1.8} />
                      <span className="font-heading font-bold text-[17px] text-foreground">{faq.question || faq.q}</span>
                    </div>
                    <ChevronDown
                      className={cn('w-5 h-5 flex-shrink-0 text-accent transition-transform duration-300', isOpen && 'rotate-180')}
                      strokeWidth={2}
                    />
                  </button>
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300',
                      isOpen ? 'max-h-96' : 'max-h-0'
                    )}
                  >
                    <p className="px-5 pb-5 pl-13 font-body text-[16px] leading-[1.8] text-muted-foreground border-t border-border pt-4">
                      {faq.answer || faq.a}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {!hideHeading && (
          <Reveal>
            <div className="mt-12 text-center bg-background border border-border p-8">
              <h3 className="font-heading font-bold text-[22px] text-foreground mb-2">હજુ પ્રશ્ન છે?</h3>
              <p className="font-body text-[16px] text-muted-foreground mb-6">અમારો સંપર્ક કરો, અમે મદદ કરવા તૈયાર છીએ.</p>
              <Btn to="/contact" variant="primary" size="md" iconRight={ArrowRight}>
                સંપર્ક કરો
              </Btn>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
