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
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-emerald-900 relative flex-col justify-between overflow-hidden">
         {/* Medical Image Background with Blend */}
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=3136&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30" />
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/95 via-emerald-800/90 to-slate-900/90" />
         
         {/* Top Left Back Link */}
         <div className="relative z-10 p-10 xl:p-14">
            <Link href="/" className="inline-flex items-center gap-4 text-emerald-100/70 hover:text-white font-bold transition-colors group">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:scale-110 transition-all backdrop-blur-md">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-sm tracking-widest uppercase">กลับสู่หน้าหลัก</span>
            </Link>
         </div>
         
         {/* Title Area */}
         <div className="relative z-10 p-10 xl:p-14 pb-20">
           <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center p-4 shadow-2xl mb-10 border border-white/20 transform hover:scale-105 transition-transform duration-500">
             <Image src={logo} alt="Nonghan Hospital" width={70} height={70} className="object-contain brightness-0 invert" />
           </div>
           
           <h1 className="text-4xl xl:text-4xl font-black text-white leading-[1.2] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
             แบบสำรวจความต้องการ<br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                ระบบสารสนเทศ
             </span>
           </h1>
           
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
               <p className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-800/40 border border-emerald-400/20 text-emerald-50 font-bold text-sm leading-relaxed backdrop-blur-md shadow-xl shadow-emerald-900/20">
                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                 กลุ่มงานสุขภาพดิจิทัล โรงพยาบาลหนองหาน · จังหวัดอุดรธานี
               </p>
           </div>
         </div>
      </div>

      {/* Right Panel - Form Container */}
      <div className="w-full lg:w-7/12 xl:w-1/2 relative flex items-center justify-center p-6 sm:p-12 overflow-hidden">
        
        {/* Decorative blur on right side */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-[120px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[120px] opacity-60 pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Mobile Back & Logo */}
          <div className="lg:hidden mb-12 text-center">
             <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold transition-colors mb-8">
                <Home className="w-4 h-4" /> <span>กลับสู่หน้าหลัก</span>
             </Link>
             <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center p-3 shadow-xl shadow-slate-200 mb-4 border border-slate-100">
                <Image src={logo} alt="Nonghan Hospital Logo" width={60} height={60} className="object-contain" />
             </div>
          </div>

          <div className="mb-10 text-center lg:text-left drop-shadow-sm">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-2">ยินดีต้อนรับ 👋</h2>
            <p className="text-slate-500 font-medium text-sm lg:text-base">เข้าสู่ระบบเพื่อจัดการคำขอและติดตามสถานะงานระบบ IMT</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-white p-8 sm:p-10">
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
