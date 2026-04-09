import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'แบบสำรวจความต้องการระบบสารสนเทศ - โรงพยาบาลหนองหาน',
  description: 'แบบฟอร์มเพื่อขอรับบริการข้อมูลสารสนเทศ แดชบอร์ด รายงาน และตัวชี้วัด ของกลุ่มงานสุขภาพดิจิทัล โรงพยาบาลหนองหาน',
  openGraph: {
    title: 'แบบสำรวจความต้องการระบบสารสนเทศ - โรงพยาบาลหนองหาน',
    description: 'แบบฟอร์มเพื่อขอรับบริการข้อมูลสารสนเทศ แดชบอร์ด รายงาน และตัวชี้วัด ของกลุ่มงานสุขภาพดิจิทัล โรงพยาบาลหนองหาน',
    url: 'https://nhh-imt.vercel.app',
    siteName: 'Nonghan Hospital IMT',
    images: [
      {
        url: '/nhh.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'th_TH',
    type: 'website',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-200">
      <section itemScope itemType="https://schema.org/WebPage">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "หน้าหลัก",
                "item": "https://nhh-imt.vercel.app"
              }]
            })
          }}
        />
        <HomeClient />
      </section>
    </div>
  );
}
