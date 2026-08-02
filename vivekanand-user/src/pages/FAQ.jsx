import PageHero from '@/components/site/PageHero';
import FaqSection from '@/components/site/FaqSection';

export default function FAQ() {
  return (
    <>
      <PageHero
        title="પ્રશ્નો અને જવાબો"
        subtitle="વાલીઓ અને વિદ્યાર્થીઓના સામાન્ય પ્રશ્નોના જવાબો."
        breadcrumb={[{ label: 'પ્રશ્નો' }]}
      />
      <FaqSection />
    </>
  );
}