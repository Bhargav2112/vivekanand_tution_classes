import { FileText } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import Reveal from '@/components/site/Reveal';
import { SITE } from '@/data/site';

const SECTIONS = [
  { title: 'સ્વીકૃતિ', body: 'અમારી સેવાઓનો ઉપયોગ કરીને તમે આ નિયમો અને શરતોને સ્વીકારો છો. જો તમે સહમત નથી, તો કૃપા કરીને સેવાઓનો ઉપયોગ ન કરો.' },
  { title: 'પ્રવેશ નિયમો', body: 'પ્રવેશ માટે વિદ્યાર્થીએ નિર્ધારિત ફોર્મ ભરવો પડશે અને જરૂરી દસ્તાવેજો રજૂ કરવા પડશે. પ્રવેશ અમારી નીતિઓના આધારે આપવામાં આવશે.' },
  { title: 'ફી અને ચુકવણી', body: 'ફી નિર્ધારિત સમયગાળામાં ચૂકવવી પડશે. ફી એકવાર ચૂકવાયા પછી પરત કરવામાં આવશે નહીં, સિવાય કે વિશેષ પરિસ્થિતિમાં.' },
  { title: 'હાજરી', body: 'વિદ્યાર્થીએ નિયમિત હાજર રહેવું જરૂરી છે. 75% થી ઓછી હાજરી પર પરીક્ષામાં બેસવાની મંજૂરી મળી શકે નહીં.' },
  { title: 'શિસ્ત', body: 'વિદ્યાર્થીએ સંસ્થાના નિયમોનું પાલન કરવું જરૂરી છે. અસ્વીકાર્ય વર્તન પર સંસ્થા પ્રવેશ રદ કરી શકે છે.' },
  { title: 'અભ્યાસ સામગ્રી', body: 'અમારી દ્વારા પૂરી પાડવામાં આવેલ અભ્યાસ સામગ્રીનો ઉપયોગ માત્ર વ્યક્તિગત અભ્યાસ માટે થઈ શકે. તેને પુનઃપ્રકાશિત કરવી નહીં.' },
  { title: 'જવાબદારીની મર્યાદા', body: 'સંસ્થા પરીક્ષામાં સફળતાની ખાતરી આપતી નથી. પરિણામ વિદ્યાર્થીના પ્રયત્નો પર આધાર રાખે છે.' },
  { title: 'નિયમોમાં ફેરફાર', body: 'સંસ્થા ક્યારેય આ નિયમો અને શરતોમાં ફેરફાર કરી શકે છે. ફેરફારો આ પૃષ્ઠ પર પ્રકાશિત થશે.' },
  { title: 'સંપર્ક', body: `નિયમો અને શરતો સંબંધિત કોઈપણ પ્રશ્ન માટે અમારો સંપર્ક કરો: ${SITE.email} અથવા ${SITE.phone}.` },
];

export default function Terms() {
  return (
    <>
      <PageHero
        title="નિયમો અને શરતો"
        subtitle="અમારી સેવાઓના ઉપયોગના નિયમો અને શરતો."
        breadcrumb={[{ label: 'નિયમો અને શરતો' }]}
      />
      <section className="bg-white py-20 lg:py-[120px]">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <Reveal>
            <div className="flex items-center gap-3 mb-8 text-muted-foreground">
              <FileText className="w-6 h-6 text-accent" strokeWidth={1.8} />
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