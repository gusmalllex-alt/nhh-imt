"use client";

import { 
  Settings, Server, Database, Globe, Cpu, 
  ShieldCheck, HardDrive, Layout, 
  Terminal, CheckCircle2, Info
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const techStack = [
    {
      title: "GitHub Pages",
      category: "Infrastructure & Hosting",
      description: "ระบบ Static Hosting ประสิทธิภาพสูง รองรับการเข้าถึงที่รวดเร็วและมีความเสถียร 99.9%",
      icon: <Globe className="w-6 h-6" />,
      color: "bg-slate-900",
      textColor: "text-white",
      badge: "Production Ready"
    },
    {
      title: "Next.js 16.2",
      category: "Frontend Framework",
      description: "เฟรมเวิร์กสมัยใหม่ที่ช่วยให้ระบบทำงานได้ลื่นไหล รองรับการทำ SEO และความปลอดภัยระดับสูง",
      icon: <Layout className="w-6 h-6" />,
      color: "bg-emerald-600",
      textColor: "text-white",
      badge: "Latest Stable"
    },
    {
      title: "Supabase Postgres",
      category: "Database Engineering",
      description: "ฐานข้อมูลเชิงสัมพันธ์ระดับ Enterprise ที่รวดเร็วและปลอดภัย จัดการข้อมูลคำขอได้อย่างแม่นยำ",
      icon: <Database className="w-6 h-6" />,
      color: "bg-emerald-500",
      textColor: "text-white",
      badge: "Real-time Sync"
    },
    {
      title: "Supabase Storage",
      category: "Cloud Resource Storage",
      description: "ระบบจัดเก็บไฟล์เอกสารและรูปภาพหลักฐานทางการแพทย์ พร้อมการเข้ารหัสความปลอดภัย",
      icon: <HardDrive className="w-6 h-6" />,
      color: "bg-teal-600",
      textColor: "text-white",
      badge: "Scalable Storage"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200">
                 <Settings className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">ตั้งค่าระบบ</h2>
           </div>
           <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2 ml-14">System Configuration & Tech Stack Overview</p>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-10 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Settings className="w-40 h-40 rotate-12" />
         </div>
         <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-4 border border-emerald-200">
               <ShieldCheck className="w-3 h-3" /> System Architecture
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">นวัตกรรมการจัดการข้อมูลโรงพยาบาล</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
               ระบบจัดการคำขอข้อมูล (IMT Portal) ถูกขับเคลื่อนด้วยสถาปัตยกรรมแบบทันสมัย 
               ที่เน้นความเร็ว ความปลอดภัย และความเสถียรเป็นหลัก 
               เพื่อให้บุคลากรทางการแพทย์สามารถทำงานได้อย่างเต็มประสิทธิภาพ
            </p>
         </div>
      </div>

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {techStack.map((tech, index) => (
           <div 
             key={index}
             className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all group"
           >
              <div className="flex justify-between items-start mb-6">
                 <div className={`p-4 ${tech.color} ${tech.textColor} rounded-2xl shadow-lg ring-4 ring-slate-50 transition-transform group-hover:scale-110`}>
                    {tech.icon}
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tech.badge}</span>
              </div>
              <div className="space-y-2">
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">{tech.category}</p>
                 <h4 className="text-xl font-bold text-slate-900">{tech.title}</h4>
                 <p className="text-slate-500 text-sm font-medium leading-relaxed">{tech.description}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2 text-[11px] font-bold text-emerald-600">
                 <CheckCircle2 className="w-3.5 h-3.5" /> High-Performance Infrastructure
              </div>
           </div>
         ))}
      </div>

      {/* System Footer Overlay */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-center relative overflow-hidden shadow-2xl">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
         <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-1 bg-emerald-500 rounded-full mb-6" />
            <h4 className="text-white text-lg font-bold">Nonghan Hospital IMT Service Hub</h4>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <span className="flex items-center gap-1.5"><Info className="w-3 h-3 text-emerald-500" /> Version 1.2.0 (Stable)</span>
               <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3 text-emerald-500" /> Compiled & Optimized</span>
               <span className="flex items-center gap-1.5"><Cpu className="w-3 h-3 text-emerald-500" /> Active System Status</span>
            </div>
            <p className="mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-wider">พัฒนาโดย กลุ่มงานสุขภาพดิจิทัล : นายศุภชัย สุนารักษ์ นักวิชาการสถิติ</p>
         </div>
      </div>
    </div>
  );
}
