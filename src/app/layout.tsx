import type { Metadata } from "next";
import { Sarabun, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarMobile from "./components/NavbarMobile";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nonghan Hospital IMT Service Hub",
  description: "ระบบบริหารจัดการสำรวจความต้องการสารสนเทศ กลุ่มงานสุขภาพดิจิทัล โรงพยาบาลหนองหาน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${sarabun.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-[72px] md:pb-0">
        {children}
        <NavbarMobile />
      </body>
    </html>
  );
}
