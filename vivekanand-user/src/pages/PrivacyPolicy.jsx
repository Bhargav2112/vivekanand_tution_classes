import { ShieldCheck } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import Reveal from '@/components/site/Reveal';
import { SITE } from '@/data/site';

const SECTIONS = [
  { title: 'પરિચય', body: 'આ ગોપનીયતા નીતિ વિવેકાનંદ ટ્યુશન ક્લાસીસ ("અમે", "અમારી", "અમને") દ્વારા એકત્રિત કરેલ માહિતીના ઉપયોગ અને સંરક્ષણને સમજાવે છે.' },
  { title: 'એકત્રિત કરેલ માહિતી', body: 'અમે વિદ્યાર્થીઓ અને વાલીઓનું નામ, મોબાઇલ નંબર, ઇમેઇલ, ધોરણ, શાળા અને શહેરની માહિતી એકત્રિત કરીએ છીએ. આ માહિતી માત્ર શૈક્ષણિક હેતુ માટે વપરાય છે.' },
  { title: 'માહિતીનો ઉપયોગ', body: 'એકત્રિત કરેલ માહિતીનો ઉપયોગ પ્રવેશ પ્રક્રિયા, અભ્યાસ અપડેટ, પરીક્ષા પરિણામ, અને મહત્વની જાહેરાતો મોકલવા માટે થાય છે.' },
  { title: 'માહિતીનું સંરક્ષણ', body: 'અમે તમારી માહિતીને સુરક્ષિત રાખવા માટે પૂરતા પગલા લઈએ છીએ. તમારી વ્યક્તિગત માહિતી તૃતીય પક્ષ સાથે વેચાતી નથી અથવા વહેંચાતી નથી.' },
  { title: 'કૂકીઝ', body: 'અમારી વેબસાઇટ વપરાશકર્તા અનુભવ સુધારવા માટે કૂકીઝનો ઉપયોગ કરે છે. તમે બ્રાઉઝર સેટિંગ્સમાં કૂકીઝ અક્ષમ કરી શકો છો.' },
  { title: 'તમારા અધિકારો', body: 'તમને તમારી વ્યક્તિગત માહિતી જોવા, સુધારવા અથવા કાઢી નાખવાનો અધિકાર છે. આ માટે અમારો સંપર્ક કરો.' },
  { title: 'નીતિમાં ફેરફાર', body: 'અમે ક્યારેય આ ગોપનીયતા નીતિમાં ફેરફાર કરી શકીએ છીએ. ફેરફારો આ પૃષ્ઠ પર પ્રકાશિત થશે.' },
  { title: 'સંપર્ક', body: `ગોપનીયતા નીતિ સંબંધિત કોઈપણ પ્રશ્ન માટે અમારો સંપર્ક કરો: ${SITE.email} અથવા ${SITE.phone}.` },
];

export default function PrivacyPolicy() {
  return (
    <>
      <PageHero
        title="ગોપનીયતા નીતિ"
        subtitle="તમારી ગોપનીયતા અમારી પ્રાથમિકતા છે."
        breadcrumb={[{ label: 'ગોપનીયતા નીતિ' }]}
      />
      <section className="bg-white py-20 lg:py-[120px]">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <Reveal>
            <div className="flex items-center gap-3 mb-8 text-muted-foreground">
              <ShieldCheck className="w-6 h-6 text-accent" strokeWidth={1.8} />
              <span className="font-body text-[15px]">છેલ્લો અપડેટ: જાન્યુઆરી 2026</span>
            </div>
          </Reveal>
          <div className="space-y-8">
            {SECTIONS.map((s, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div>
                  <h2 className="font-heading font-bold text-[22px] text-foreground mb-2 flex items-start gap-3">
                    <span className="text-accent font-display font-extrabold text-[18px] mt-1">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </h2>
                  <p className="font-body text-[17px] leading-[1.8] text-muted-foreground pl-9">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}