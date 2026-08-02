import { useState, useEffect } from 'react';
import { Star, ArrowRight, Trophy, Award, TrendingUp, Users } from 'lucide-react';
import PageHero from '@/components/site/PageHero';
import SectionHeading from '@/components/ui/SectionHeading';
import Btn from '@/components/ui/Btn';
import ImgPlaceholder from '@/components/ui/ImgPlaceholder';
import Reveal from '@/components/site/Reveal';
import StatCounter from '@/components/site/StatCounter';
import { STATS } from '@/data/site';
import { apiClient } from '@/api/apiClient';
import { cn } from '@/lib/utils';

const TABS = ['બધા', 'જવાહર નવોદય', 'જ્ઞાન શક્તિ', 'CET', 'ધોરણ 6-10'];

export default function Results() {
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  const displayStats = settings ? [
    {
      value: settings.stats_students_value !== undefined ? settings.stats_students_value : 5000,
      suffix: settings.stats_students_suffix || "+",
      label: settings.stats_students_label || "વિદ્યાર્થીઓ"
    },
    {
      value: settings.stats_results_value !== undefined ? settings.stats_results_value : 98,
      suffix: settings.stats_results_suffix || "%",
      label: settings.stats_results_label || "પરિણામ"
    },
    {
      value: settings.stats_experience_value !== undefined ? settings.stats_experience_value : 15,
      suffix: settings.stats_experience_suffix || "+",
      label: settings.stats_experience_label || "વર્ષનો અનુભવ"
    },
    {
      value: settings.stats_merit_value !== undefined ? settings.stats_merit_value : 500,
      suffix: settings.stats_merit_suffix || "+",
      label: settings.stats_merit_label || "મેરિટ વિદ્યાર્થીઓ"
    }
  ] : STATS;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resultsRes, settingsRes] = await Promise.allSettled([
          apiClient.get('/results'),
          apiClient.get('/settings')
        ]);

        if (resultsRes.status === 'fulfilled') {
          const data = Array.isArray(resultsRes.value.data) ? resultsRes.value.data : (resultsRes.value.data?.data || []);
          setResults(data);
        }

        if (settingsRes.status === 'fulfilled') {
          const data = Array.isArray(settingsRes.value.data) ? settingsRes.value.data : (settingsRes.value.data?.data || []);
          if (data && data.length > 0) setSettings(data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeCategory = TABS[activeTab];
  const filteredResults = activeCategory === 'બધા' ? results : results.filter(r => r.category === activeCategory || r.course === activeCategory);

  return (
    <>
      <PageHero
        title="અમારા ગૌરવપૂર્ણ પરિણામો"
        subtitle="વિદ્યાર્થીઓની સફળતા જ અમારી સૌથી મોટી સિદ્ધિ છે."
        breadcrumb={[{ label: 'પરિણામ' }]}
      />

      {/* Success Counter */}
      <section className="bg-primary text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {displayStats.map((stat, i) => {
            const Icon = [Users, TrendingUp, Award, Star][i];
            return (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div>
                  <Icon className="w-10 h-10 text-golden mx-auto mb-3" strokeWidth={1.8} />
                  <div className="font-heading font-extrabold text-4xl lg:text-5xl">
                    <StatCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-2 font-body text-[16px] text-white/75">{stat.label}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Toppers Grid */}
      <section className="bg-white py-20 lg:py-[120px]">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          <Reveal>
            <SectionHeading label="ટોપર્સ" title="અમારા મેરિટ વિદ્યાર્થીઓ" subtitle="દર વર્ષે ઉત્તમ પરિણામોની પરંપરા." />
          </Reveal>

          {/* Filter Tabs */}
          <Reveal>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    'px-6 py-3 font-heading font-bold text-[15px] border-2 transition-all duration-250',
                    activeTab === i
                      ? 'bg-accent text-white border-accent'
                      : 'bg-white text-foreground border-border hover:border-accent hover:text-accent'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
               <div className="col-span-full py-10 text-center text-muted-foreground">લોડ થઈ રહ્યું છે...</div>
            ) : filteredResults.length === 0 ? (
               <div className="col-span-full py-10 text-center text-muted-foreground">કોઈ પરિણામ મળ્યું નથી.</div>
            ) : (
              filteredResults.map((t, i) => (
                <Reveal key={t._id || i} delay={i * 0.08}>
                  <div className="card-hover group border border-border bg-white overflow-hidden h-full flex flex-col">
                    <div className="relative">
                      {t.photo_url ? (
                         <img src={t.photo_url} alt={t.student_name} className="w-full aspect-square object-cover border-0 group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                         <ImgPlaceholder label="વિદ્યાર્થી છબી" ratio="1/1" className="border-0 group-hover:scale-105 transition-transform duration-500" showLabel={false} />
                      )}
                      {t.rank && (
                        <div className="absolute top-3 right-3 bg-golden text-white w-12 h-12 flex flex-col items-center justify-center">
                          <Trophy className="w-4 h-4" strokeWidth={2} />
                          <span className="font-heading font-extrabold text-[13px] !leading-loose mt-0.5">#{t.rank}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 text-center flex-grow flex flex-col">
                      <h3 className="font-heading font-bold text-[20px] text-foreground">{t.student_name}</h3>
                      <div className="mt-auto mb-4">
                        <div className="mt-2 inline-block bg-accent/10 text-accent px-4 py-1 font-heading font-extrabold text-[22px]">{t.marks || t.percentage}</div>
                      </div>
                      {t.school && <p className="font-body text-[14px] text-muted-foreground">{t.school}</p>}
                      <div className="mt-2 flex items-center justify-center gap-1.5">
                        <Award className="w-4 h-4 text-golden" strokeWidth={1.8} />
                        <span className="font-body text-[14px] font-semibold text-foreground">{t.achievement || t.category || 'મેરિટ'}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent text-white py-16 lg:py-20">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-heading font-extrabold text-3xl md:text-[40px] !leading-loose pb-4 pt-2">
              તમારા બાળકને પણ સફળતાના શિખરે પહોંચાડો.
            </h2>
            <div className="mt-8">
              <Btn to="/admission" variant="maroon" size="lg" iconRight={ArrowRight}>
                હમણાં જ પ્રવેશ લો
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}