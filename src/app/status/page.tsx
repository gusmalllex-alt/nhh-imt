import type { Metadata } from 'next';
import StatusClient from './StatusClient';

export const metadata: Metadata = {
  title: 'ติดตามสถานะคำขอสารสนเทศ - โรงพยาบาลหนองหาน',
  description: 'ตรวจสอบสถานะการขอดำเนินการข้อมูลสารสนเทศ แดชบอร์ด และรายงาน ของกลุ่มงานสุขภาพดิจิทัล โรงพยาบาลหนองหาน',
  openGraph: {
    title: 'ติดตามสถานะคำขอสารสนเทศ - โรงพยาบาลหนองหาน',
    description: 'ตรวจสอบสถานะการขอดำเนินการข้อมูลสารสนเทศ แดชบอร์ด และรายงาน',
    url: 'https://nhh-imt.vercel.app/status',
    siteName: 'Nonghan Hospital IMT',
    locale: 'th_TH',
    type: 'website',
  },
};

export default function StatusPage() {
  return (
    <div className="font-sans text-slate-800 selection:bg-emerald-200">
      <article itemScope itemType="https://schema.org/WebPage">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "หน้าหลัก",
                  "item": "https://nhh-imt.vercel.app"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "ติดตามสถานะ",
                  "item": "https://nhh-imt.vercel.app/status"
                }
              ]
            })
          }}
        />
        <StatusClient />
      </article>
    </div>
  );
}
