import { useState, useEffect } from 'react';
import { Check, ArrowRight, Clock, Calendar, GraduationCap, Lightbulb, Brain, BookOpen } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Btn from '@/components/ui/Btn';
import Reveal from '@/components/site/Reveal';
import { apiClient } from '@/api/apiClient';
import { cn } from '@/lib/utils';
import { BATCH_TIMINGS } from '@/data/site'; // Fallback if backend doesn't have it yet

const ICONS = { GraduationCap, Lightbulb, Brain, BookOpen };

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, batchRes] = await Promise.all([
          apiClient.get('/courses'),
          apiClient.get('/batches')
        ]);
        const courseData = Array.isArray(courseRes.data) ? courseRes.data : (courseRes.data?.data || []);
        const batchData = Array.isArray(batchRes.data) ? batchRes.data : (batchRes.data?.data || []);
        
        setCourses(courseData);
        setBatches(batchData.length > 0 ? batchData : BATCH_TIMINGS);
        
        if (courseData.length > 0) {
          setActiveCourse(courseData[0]._id || courseData[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const active = courses.find((c) => (c._id || c.id) === activeCourse);

  if (loading) {
    return <div className="py-20 text-center font-heading text-lg">લોડ થઈ રહ્યું છે...</div>;
  }

  return (
    <>
      <PageHero
        title="અમારા અભ્યાસક્રમો"
        subtitle="દરેક વિદ્યાર્થી માટે યોગ્ય માર્ગદર્શન અને પરિણામ આધારિત અભ્યાસ."
        breadcrumb={[{ label: 'અભ્યાસક્રમો' }]}
      />

      {/* Course Detail with Tabs */}
      <section className="bg-white py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading label="અભ્યાસક્રમો" title="કોર્સ વિગત" subtitle="દરેક કોર્સની સંપૂર્ણ માહિતી અહીં જુઓ." />
          </Reveal>

          {courses.length === 0 ? (
            <div className="text-center mt-10 text-muted-foreground">કોઈ કોર્સ ઉપલબ્ધ નથી.</div>
          ) : (
            <>
              {/* Tabs */}
              <Reveal>
                <div className="mt-10 flex flex-wrap justify-center gap-3">
                  {courses.map((c) => {
                    const id = c._id || c.id;
                    return (
                      <button
                        key={id}
                        onClick={() => setActiveCourse(id)}
                        className={cn(
                          'px-6 py-3 font-heading font-bold text-[15px] border-2 transition-all duration-250',
                          activeCourse === id
                            ? 'bg-accent text-white border-accent'
                            : 'bg-white text-foreground border-border hover:border-accent hover:text-accent'
                        )}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </Reveal>

              {/* Active Course Detail */}
              {active && (
                <Reveal key={active._id || active.id}>
                  <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div>
                      <div className="flex items-center gap-4 mb-5">
                        {(() => {
                          const Icon = ICONS[active.icon] || BookOpen;
                          return (
                            <div className="flex items-center justify-center w-16 h-16 bg-accent/10">
                              <Icon className="w-8 h-8 text-accent" strokeWidth={1.8} />
                            </div>
                          );
                        })()}
                        <div>
                          <h3 className="font-heading font-extrabold text-[28px] text-foreground leading-[2.1] pb-1 pt-1">{active.name}</h3>
                          {active.badge && <span className="inline-block mt-1 bg-primary text-white px-3 py-1 text-[12px] font-heading font-semibold">{active.badge}</span>}
                        </div>
                      </div>
                      <p className="font-body text-[18px] leading-[1.8] text-muted-foreground mb-6">{active.description}</p>
                      <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-accent" strokeWidth={1.8} />
                          <span className="font-body text-[15px] text-foreground"><b>સમયગાળો:</b> {active.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-accent" strokeWidth={1.8} />
                          <span className="font-body text-[15px] text-foreground"><b>બેચ:</b> {active.classes}</span>
                        </div>
                      </div>
                      <h4 className="font-heading font-bold text-[18px] text-foreground mb-3">ખાસિયતો</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                        {(active.features || []).map((f) => (
                          <li key={f} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-accent flex-shrink-0" strokeWidth={2.5} />
                            <span className="font-body text-[15px] text-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Btn to="/admission" variant="primary" size="md">પ્રવેશ લો</Btn>
                        <Btn to="/contact" variant="secondary" size="md">વધુ માહિતી</Btn>
                      </div>
                    </div>
                    <div className="bg-background border border-border p-8">
                      <h4 className="font-heading font-bold text-[18px] text-foreground mb-5">પાત્રતા અને વિગત</h4>
                      <dl className="space-y-4">
                        <div className="flex justify-between pb-3 border-b border-border">
                          <dt className="font-body text-[15px] text-muted-foreground">ધોરણ</dt>
                          <dd className="font-heading font-bold text-[15px] text-foreground">{active.grade}</dd>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-border">
                          <dt className="font-body text-[15px] text-muted-foreground">સમયગાળો</dt>
                          <dd className="font-heading font-bold text-[15px] text-foreground">{active.duration}</dd>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-border">
                          <dt className="font-body text-[15px] text-muted-foreground">ક્લાસ આવૃત્તિ</dt>
                          <dd className="font-heading font-bold text-[15px] text-foreground">{active.classes}</dd>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-border">
                          <dt className="font-body text-[15px] text-muted-foreground">સાપ્તાહિક ટેસ્ટ</dt>
                          <dd className="font-heading font-bold text-[15px] text-accent">✓ ઉપલબ્ધ</dd>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-border">
                          <dt className="font-body text-[15px] text-muted-foreground">અભ્યાસ સામગ્રી</dt>
                          <dd className="font-heading font-bold text-[15px] text-accent">✓ પ્રિન્ટેડ નોંધપોથી</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="font-body text-[15px] text-muted-foreground">વ્યક્તિગત માર્ગદર્શન</dt>
                          <dd className="font-heading font-bold text-[15px] text-accent">✓ ઉપલબ્ધ</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </Reveal>
              )}
            </>
          )}
        </div>
      </section>

      {/* Course Comparison Table */}
      <section className="bg-background py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading label="તુલના" title="તમારા બાળક માટે કયો કોર્સ?" subtitle="સરળ તુલનાથી યોગ્ય નિર્ણય લો." />
          </Reveal>
          <Reveal>
            <div className="mt-12 overflow-x-auto">
              <table className="w-full border-collapse bg-white border border-border">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-4 text-left font-heading font-bold text-[16px]">કોર્સ</th>
                    <th className="p-4 text-left font-heading font-bold text-[16px]">ધોરણ</th>
                    <th className="p-4 text-left font-heading font-bold text-[16px]">સમયગાળો</th>
                    <th className="p-4 text-center font-heading font-bold text-[16px]">સાપ્તાહિક ટેસ્ટ</th>
                    <th className="p-4 text-center font-heading font-bold text-[16px]">નોંધપોથી</th>
                    <th className="p-4 text-center font-heading font-bold text-[16px]">વ્યક્તિગત માર્ગદર્શન</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.filter(c => c.status !== 'inactive').map((row, i) => (
                    <tr key={row._id || i} className="border-t border-border hover:bg-accent/5 transition-colors">
                      <td className="p-4 font-heading font-bold text-[15px] text-foreground">{row.name}</td>
                      <td className="p-4 font-body text-[15px] text-muted-foreground">{row.grade || row.eligibility || "—"}</td>
                      <td className="p-4 font-body text-[15px] text-muted-foreground">{row.duration || "—"}</td>
                      <td className="p-4 text-center font-heading font-extrabold text-[18px] text-accent">
                        {row.has_weekly_test !== false ? "✓" : "—"}
                      </td>
                      <td className="p-4 text-center font-heading font-extrabold text-[18px] text-accent">
                        {row.has_study_material !== false ? "✓" : "—"}
                      </td>
                      <td className="p-4 text-center font-heading font-extrabold text-[18px] text-accent">
                        {row.has_personal_guidance !== false ? "✓" : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Batch Timings */}
      <section className="bg-white py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading label="સમય" title="બેચ સમય" subtitle="તમારી સુવિધાનુસાર બેચ પસંદ કરો." />
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {batches.map((b, i) => {
              const Icon = ICONS[b.icon] || Clock;
              return (
                <Reveal key={b._id || b.name} delay={i * 0.1}>
                  <div className="card-hover border border-border bg-white p-7 text-center h-full">
                    <div className="flex items-center justify-center w-14 h-14 bg-accent/10 mx-auto mb-4">
                      <Icon className="w-7 h-7 text-accent" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-heading font-bold text-[18px] text-foreground mb-1">{b.name}</h3>
                    <div className="font-heading font-extrabold text-[20px] text-accent my-2">{b.time}</div>
                    <p className="font-body text-[14px] text-muted-foreground">{b.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="bg-background py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading label="પ્રવેશ પ્રક્રિયા" title="પ્રવેશ કેવી રીતે લેવો?" subtitle="સરળ 5 પગલામાં પ્રવેશ મેળવો." />
          </Reveal>
          <div className="mt-14">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-[2px] bg-accent/30" />
              {['સંપર્ક કરો', 'કાઉન્સેલિંગ', 'ડેમો ક્લાસ', 'પ્રવેશ', 'અભ્યાસ શરૂ'].map((step, i) => (
                <Reveal key={step} delay={i * 0.12}>
                  <div className="flex flex-col items-center text-center relative">
                    <div className="flex items-center justify-center w-14 h-14 bg-accent text-white font-heading font-extrabold text-[20px] z-10 relative">
                      {i + 1}
                    </div>
                    <div className="mt-4 font-heading font-bold text-[16px] text-foreground">{step}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal>
            <div className="mt-14 text-center">
              <Btn to="/admission" variant="primary" size="lg" iconRight={ArrowRight}>
                હમણાં જ પ્રવેશ લો
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}