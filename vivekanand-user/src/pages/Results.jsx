import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  const urlYear = searchParams.get('year');
  const urlExam = searchParams.get('exam');

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

  const yearsAvailable = useMemo(() => {
    const years = [...new Set(results.map(r => r.year).filter(Boolean))];
    return years.sort((a, b) => b.localeCompare(a));
  }, [results]);

  const activeYear = urlYear || (yearsAvailable.length > 0 ? yearsAvailable[0] : '2024');

  const filteredResultsByYear = useMemo(() => {
    return results.filter(r => r.year === activeYear);
  }, [results, activeYear]);

  const examsAvailableForYear = useMemo(() => {
    return [...new Set(filteredResultsByYear.map(r => r.exam || r.category || 'અન્ય'))];
  }, [filteredResultsByYear]);

  // Group by exam for rendering
  const groupedResults = useMemo(() => {
    const groups = {};
    filteredResultsByYear.forEach(r => {
      const exam = r.exam || r.category || 'અન્ય';
      if (!groups[exam]) groups[exam] = [];
      groups[exam].push(r);
    });
    return groups;
  }, [filteredResultsByYear]);

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

          {/* Year Filter Tabs */}
          <Reveal>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {yearsAvailable.map((year) => (
                <button
                  key={year}
                  onClick={() => setSearchParams({ year, ...(urlExam ? {exam: urlExam} : {}) })}
                  className={cn(
                    'px-6 py-2.5 font-heading font-bold text-[16px] border-2 rounded-full transition-all duration-250',
                    activeYear === year
                      ? 'bg-accent text-white border-accent shadow-md'
                      : 'bg-white text-foreground border-border hover:border-accent hover:text-accent'
                  )}
                >
                  {year}
                </button>
              ))}
              {yearsAvailable.length === 0 && (
                <div className="text-muted-foreground">કોઈ વર્ષના પરિણામો ઉપલબ્ધ નથી.</div>
              )}
            </div>
          </Reveal>

          {/* Render Groups */}
          <div className="mt-14 space-y-16">
            {loading ? (
               <div className="py-10 text-center text-muted-foreground">લોડ થઈ રહ્યું છે...</div>
            ) : filteredResultsByYear.length === 0 ? (
               <div className="py-10 text-center text-muted-foreground">{activeYear} ના કોઈ પરિણામ મળ્યું નથી.</div>
            ) : (
              (urlExam && groupedResults[urlExam] ? [urlExam] : examsAvailableForYear).map((examType) => (
                <div key={examType}>
                  <Reveal>
                    <div className="flex items-center gap-4 mb-8 border-b-2 border-border/60 pb-2">
                      <h3 className="font-heading font-extrabold text-2xl text-[#7a1d1d]">{examType} પરિણામો</h3>
                      <div className="flex-1 border-b border-dashed border-border/80"></div>
                      <span className="font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full text-sm">
                        {groupedResults[examType]?.length || 0} વિદ્યાર્થીઓ
                      </span>
                    </div>
                  </Reveal>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedResults[examType]?.map((t, i) => (
                      <Reveal key={t._id || i} delay={i * 0.08}>
                        <div className="card-hover group border border-border bg-white overflow-hidden h-full flex flex-col shadow-sm rounded-lg">
                          <div className="relative">
                            {t.photo_url ? (
                               <img src={t.photo_url} alt={t.student_name} className="w-full aspect-square object-cover border-0 group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                               <ImgPlaceholder label="વિદ્યાર્થી છબી" ratio="1/1" className="border-0 group-hover:scale-105 transition-transform duration-500" showLabel={false} />
                            )}
                            {t.rank && (
                              <div className="absolute top-3 right-3 bg-golden text-white w-12 h-12 flex flex-col items-center justify-center rounded-full shadow-lg border-2 border-white">
                                <Trophy className="w-4 h-4" strokeWidth={2} />
                                <span className="font-heading font-extrabold text-[13px] !leading-[1.4] mt-0.5">#{t.rank}</span>
                              </div>
                            )}
                          </div>
                          <div className="p-6 text-center flex-grow flex flex-col bg-slate-50/50">
                            <h3 className="font-heading font-bold text-[20px] text-foreground mb-1">{t.student_name}</h3>
                            <div className="mt-3 mb-4">
                              <div className="inline-block bg-[#7a1d1d] text-white px-5 py-1.5 rounded-full font-heading font-extrabold text-[20px] shadow-sm">
                                {t.marks ? `${t.marks} માર્ક્સ` : `${t.percentage}%`}
                              </div>
                            </div>
                            {t.school && <p className="font-body text-[14px] text-muted-foreground mt-auto">{t.school}</p>}
                            <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-2">
                              <Award className="w-5 h-5 text-golden" strokeWidth={2} />
                              <span className="font-body text-[15px] font-bold text-foreground">{t.achievement || t.category || 'મેરિટ સ્ટુડન્ટ'}</span>
                            </div>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent text-white py-16 lg:py-20">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-heading font-extrabold text-3xl md:text-[40px] !leading-[1.5] md:!leading-[1.45] pb-1">
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