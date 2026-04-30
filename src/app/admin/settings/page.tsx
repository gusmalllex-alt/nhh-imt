"use client";

import { 
  Settings, Server, Database, Globe, Cpu,   ShieldCheck, HardDrive, Layout, 
   Terminal, CheckCircle2, Info, Activity, Zap, Lock, User
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const techStack = [
    {
      title: "GitHub Infrastructure",
      category: "Infrastructure & Hosting",
      description: "ระบบ Static Hosting ประสิทธิภาพสูง รองรับการเข้าถึงที่รวดเร็วและมีความเสถียร 99.9% พร้อมระบบ CI/CD อัตโนมัติ",
      icon: <Globe className="w-6 h-6" />,
      color: "from-slate-900 to-slate-800",
      textColor: "text-white",
      badge: "Production Ready",
      accent: "emerald"
    },
    {
      title: "Next.js 15 & Tailwind v4",
      category: "Frontend Framework",
      description: "สถาปัตยกรรม App Router สมัยใหม่ พร้อม Engine Tailwind CSS v4 ที่ช่วยให้การเรนเดอร์ UI รวดเร็วและสวยงามที่สุด",
      icon: <Layout className="w-6 h-6" />,
      color: "from-emerald-600 to-teal-600",
      textColor: "text-white",
      badge: "Modern Architecture",
      accent: "teal"
    },
    {
      title: "Supabase Core Engine",
      category: "Backend & Database",
      description: "ฐานข้อมูล Postgres ระดับ Enterprise ที่รวดเร็วและปลอดภัย พร้อมระบบ Real-time Sync จัดการข้อมูลได้อย่างแม่นยำ",
      icon: <Database className="w-6 h-6" />,
      color: "from-emerald-500 to-emerald-400",
      textColor: "text-white",
      badge: "Real-time DB",
      accent: "emerald"
    },
    {
      title: "Cloud Data Storage",
      category: "Medical Resource Storage",
      description: "ระบบจัดเก็บไฟล์เอกสารและรูปภาพหลักฐานทางการแพทย์ พร้อมการเข้ารหัสความปลอดภัยและการจัดการสิทธิ์การเข้าถึง",
      icon: <HardDrive className="w-6 h-6" />,
      color: "from-teal-600 to-emerald-700",
      textColor: "text-white",
      badge: "Secure Cloud",
      accent: "teal"
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12 font-sans">
      
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#003820] via-[#004d30] to-[#0f172a] shadow-2xl shadow-emerald-900/30 border border-emerald-700/20 p-10 md:p-12">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.06]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-[1.25rem] border border-white/20 flex items-center justify-center shadow-2xl">
              <Settings className="w-7 h-7 text-emerald-400 animate-spin-slow" />
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter leading-none">ตั้งค่าระบบ</h2>
              <p className="text-emerald-400/60 font-black text-[10px] uppercase tracking-[0.3em] mt-2">System Administration & Core Hub</p>
            </div>
          </div>
          
          <div className="max-w-xl">
             <p className="text-emerald-50/70 font-bold text-base leading-relaxed">
               ศูนย์กลางการควบคุมและบริหารจัดการโครงสร้างพื้นฐานดิจิทัล <br className="hidden md:block" />
               เทคโนโลยีที่ขับเคลื่อนความก้าวหน้าของงานสุขภาพดิจิทัล โรงพยาบาลหนองหาน
             </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── Architecture Status ─────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 p-10 relative overflow-hidden group">
             <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700">
                <Cpu className="w-64 h-64" />
             </div>
             
             <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                   <ShieldCheck className="w-4 h-4" /> System Architecture Stable
                </div>
                
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
                   นวัตกรรมการจัดการข้อมูล <br /> <span className="text-emerald-600">วิสัยทัศน์สู่ Digital Hospital</span>
                </h3>
                
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 font-bold leading-loose text-base">
                     ระบบจัดการคำขอข้อมูล (IMT Portal) ถูกขับเคลื่อนด้วยสถาปัตยกรรมแบบทันสมัย 
                     ที่เน้นความเร็ว ความปลอดภัย และความเสถียรเป็นหลัก 
                     เราใช้เทคโนโลยี Serverless และ Cloud-Native เพื่อให้บุคลากรทางการแพทย์สามารถทำงานได้อย่างเต็มประสิทธิภาพ
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
                   {[
                     { label: "Uptime", value: "99.9%", icon: <Activity className="w-4 h-4 text-emerald-500" /> },
                     { label: "Latency", value: "< 50ms", icon: <Zap className="w-4 h-4 text-amber-500" /> },
                     { label: "Security", value: "AES-256", icon: <Lock className="w-4 h-4 text-blue-500" /> }
                   ].map((item, i) => (
                     <div key={i} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                           {item.icon}
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <span className="text-xl font-black text-slate-900 tabular-nums">{item.value}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* ── Detailed Tech Cards ────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {techStack.map((tech, index) => (
               <div 
                 key={index}
                 className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all group"
               >
                  <div className="flex justify-between items-start mb-6">
                     <div className={`w-14 h-14 bg-gradient-to-br ${tech.color} ${tech.textColor} rounded-2xl shadow-2xl flex items-center justify-center ring-4 ring-slate-50/50 group-hover:scale-110 transition-transform duration-500`}>
                        {tech.icon}
                     </div>
                     <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">{tech.badge}</span>
                  </div>
                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">{tech.category}</p>
                     <h4 className="text-xl font-black text-slate-900 tracking-tight">{tech.title}</h4>
                     <p className="text-slate-500 text-sm font-bold leading-relaxed">{tech.description}</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.15em]">
                     <CheckCircle2 className="w-4 h-4" /> System Optimized
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* ── Sidebar Info ────────────────────────────────── */}
        <div className="space-y-8">
           {/* Admin Info Card */}
           <div className="bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl border border-slate-800">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-1 mb-8 shadow-2xl ring-4 ring-emerald-500/20 animate-float">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center p-4">
                       <User className="w-10 h-10 text-emerald-400" />
                    </div>
                 </div>
                 
                 <h4 className="text-white text-xl font-black tracking-tight mb-2">Supachai Sunarak</h4>
                 <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-6">Statistical Analyst & Lead Developer</p>
                 
                 <div className="w-12 h-1 bg-emerald-500 rounded-full mb-8" />
                 
                 <div className="space-y-4 w-full">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                       <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                          <Info className="w-5 h-5" />
                       </div>
                       <div className="text-left">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">Version Control</p>
                          <p className="text-white text-sm font-black leading-none">v1.2.5 (Enterprise)</p>
                       </div>
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                       <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                          <Terminal className="w-5 h-5" />
                       </div>
                       <div className="text-left">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">Environment</p>
                          <p className="text-white text-sm font-black leading-none">Compiled & Live</p>
                       </div>
                    </div>
                 </div>
                 
                 <p className="mt-12 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                   Digital Health Strategy Unit <br /> Nonghan Hospital Hub
                 </p>
              </div>
           </div>
           
           {/* Quick Stats Sidebar Card */}
           <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-700 opacity-90" />
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all">
                 <ShieldCheck className="w-40 h-40 rotate-12" />
              </div>
              
              <div className="relative z-10">
                 <h4 className="text-2xl font-black tracking-tight mb-4">ระบบพร้อมใช้งาน</h4>
                 <p className="text-emerald-50 font-bold text-sm leading-relaxed mb-8 opacity-80">
                    โครงสร้างพื้นฐานทั้งหมดได้รับการตรวจสอบและทดสอบความปลอดภัยอย่างต่อเนื่อง
                 </p>
                 <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-2xl text-emerald-700 font-black text-xs shadow-xl shadow-emerald-900/20">
                    <CheckCircle2 className="w-4 h-4" /> Secure Connection Active
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
