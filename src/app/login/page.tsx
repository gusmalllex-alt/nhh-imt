"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Lock, Mail, ArrowRight, ShieldCheck, 
  AlertCircle, Loader2, Home, User 
} from "lucide-react";
import logo from "../../../public/nhh.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/admin");
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Log login event to history table
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('login_history').insert({
          user_id: user.id,
          email: user.email,
          login_at: new Date().toISOString()
        });
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex selection:bg-emerald-200 relative bg-slate-50">
      
      {/* Left Panel - Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-slate-950 relative flex-col items-center justify-between overflow-hidden py-12 px-8 text-center shadow-2xl z-20">
         
         {/* Beautiful Medical Background */}
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2653&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
         <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/90 via-emerald-900/80 to-slate-900/95" />
         
         {/* Top Left Back Link */}
         <div className="absolute top-10 left-10 z-10">
            <Link href="/" className="inline-flex items-center gap-3 text-emerald-100/70 hover:text-white font-bold transition-colors group">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all backdrop-blur-md shadow-lg">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-sm tracking-widest uppercase">หน้าหลัก</span>
            </Link>
         </div>
         
         {/* Center Content (Logo + Title) */}
         <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-2xl mx-auto">
           
           {/* Logo without background container */}
           <div className="mb-8 transform hover:scale-105 transition-transform duration-700 animate-in zoom-in-95 duration-1000">
             <Image 
               src={logo} 
               alt="Nonghan Hospital Logo" 
               width={130} 
               height={130} 
               className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)]" 
             />
           </div>
           
           <h1 className="text-2xl xl:text-3xl font-black text-white leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
             แบบสำรวจความต้องการระบบสารสนเทศ
           </h1>
           
           <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mt-6 opacity-90 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
           
         </div>
         
         {/* Bottom Center Area (Badge) */}
         <div className="relative z-10 w-full flex justify-center pb-2 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
             <div className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-slate-950/40 border border-emerald-500/30 text-emerald-50 font-bold text-sm lg:text-base leading-relaxed backdrop-blur-xl shadow-2xl shadow-emerald-900/20">
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
               </span>
               กลุ่มงานสุขภาพดิจิทัล โรงพยาบาลหนองหาน · จังหวัดอุดรธานี
             </div>
         </div>
         
      </div>

      {/* Right Panel - Form Container */}
      <div className="w-full lg:w-7/12 xl:w-1/2 relative flex items-center justify-center p-6 sm:p-10 overflow-hidden">
        
        {/* Decorative blur on right side */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-[120px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[120px] opacity-60 pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 mx-auto flex flex-col items-center">
          
          {/* Mobile Back & Logo */}
          <div className="lg:hidden mb-12 text-center">
             <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold transition-colors mb-8">
                <Home className="w-4 h-4" /> <span>กลับสู่หน้าหลัก</span>
             </Link>
             <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center p-3 shadow-xl shadow-slate-200 mb-4 border border-slate-100">
                <Image src={logo} alt="Nonghan Hospital Logo" width={60} height={60} className="object-contain" />
             </div>
          </div>

          <div className="mb-10 text-center w-full">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-3">ยินดีต้อนรับ 👋</h2>
            <p className="text-slate-500 font-medium text-sm lg:text-base leading-relaxed">
              เข้าสู่ระบบเพื่อจัดการคำขอและติดตามสถานะงานระบบ IMT
            </p>
            <div className="mx-auto mt-4 w-16 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-80" />
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white p-8 sm:p-10 w-full">
            <form onSubmit={handleLogin} className="space-y-6">
              
              {!supabase && (
                <div className="bg-amber-50/80 backdrop-blur border border-amber-200/50 p-4 rounded-2xl flex items-start gap-3">
                   <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                   <div className="space-y-0.5">
                      <p className="text-sm font-bold text-amber-800 leading-tight">ระบบยังไม่ได้เชื่อมต่อฐานข้อมูล</p>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tight">กรุณาตั้งค่า Environment Variables</p>
                   </div>
                </div>
              )}

              {error && (
                <div className="bg-rose-50/90 backdrop-blur-sm border border-rose-200/80 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                   <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                   <p className="text-sm font-bold text-rose-900 leading-tight">{error}</p>
                </div>
              )}

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" /> อีเมลบุคลากร (Email)
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 outline-none font-bold text-slate-800 text-sm focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300 placeholder:font-medium"
                    placeholder="name@nonghan.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" /> รหัสผ่าน (Password)
                  </label>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 outline-none font-bold text-slate-800 text-sm focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all tracking-widest placeholder:text-slate-300 placeholder:font-medium placeholder:tracking-normal"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-emerald-600/30 hover:shadow-emerald-700/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none disabled:transform-none group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>กำลังตรวจสอบข้อมูล...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>เข้าสู่ระบบ</span>
                      <ArrowRight className="w-4 h-4 ml-1 opacity-60 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-8 text-center pt-6 border-t border-slate-100">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.1em]">
                 ระบบรักษาความปลอดภัย <br className="sm:hidden" />© โรงพยาบาลหนองหาน 2026
               </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
