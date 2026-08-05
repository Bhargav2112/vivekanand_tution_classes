import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import AnnouncementTicker from './AnnouncementTicker';
import PushNotificationPrompt from './PushNotificationPrompt';

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Global Floating Watermark Overlay - Visible on ALL pages */}
      <div
        className="fixed inset-0 pointer-events-none select-none z-[35] overflow-hidden flex flex-col justify-around items-center opacity-[0.038]"
        aria-hidden="true"
      >
        <div className="w-[160vw] flex justify-around items-center gap-12 -rotate-[20deg] whitespace-nowrap font-heading font-extrabold text-[32px] sm:text-[50px] lg:text-[68px] text-primary tracking-widest">
          <span>વિવેકાનંદ ટ્યુશન ક્લાસીસ</span>
          <span className="text-accent">•</span>
          <span>વિવેકાનંદ ટ્યુશન ક્લાસીસ</span>
        </div>
        <div className="w-[160vw] flex justify-around items-center gap-12 -rotate-[20deg] whitespace-nowrap font-heading font-extrabold text-[32px] sm:text-[50px] lg:text-[68px] text-primary tracking-widest">
          <span>વિવેકાનંદ ટ્યુશન ક્લાસીસ</span>
          <span className="text-accent">•</span>
          <span>વિવેકાનંદ ટ્યુશન ક્લાસીસ</span>
        </div>
        <div className="w-[160vw] flex justify-around items-center gap-12 -rotate-[20deg] whitespace-nowrap font-heading font-extrabold text-[32px] sm:text-[50px] lg:text-[68px] text-primary tracking-widest">
          <span>વિવેકાનંદ ટ્યુશન ક્લાસીસ</span>
          <span className="text-accent">•</span>
          <span>વિવેકાનંદ ટ્યુશન ક્લાસીસ</span>
        </div>
        <div className="w-[160vw] flex justify-around items-center gap-12 -rotate-[20deg] whitespace-nowrap font-heading font-extrabold text-[32px] sm:text-[50px] lg:text-[68px] text-primary tracking-widest">
          <span>વિવેકાનંદ ટ્યુશન ક્લાસીસ</span>
          <span className="text-accent">•</span>
          <span>વિવેકાનંદ ટ્યુશન ક્લાસીસ</span>
        </div>
      </div>

      <Header />
      <AnnouncementTicker />
      <main className="flex-1 relative pt-[10px]">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
      <PushNotificationPrompt />
    </div>
  );
}