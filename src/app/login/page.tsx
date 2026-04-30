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
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative flex-col items-center justify-between overflow-hidden py-16 px-12 text-center shadow-2xl z-20">
         
         {/* Beautiful Medical Background */}
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2653&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay scale-105 animate-slow-zoom" />
         <div className="absolute inset-0 bg-gradient-to-br from-[#003820] via-[#004d30] to-[#0f172a]" />
         
         {/* Decorative grid & blobs */}
         <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
         <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
         
         {/* Top Left Back Link */}
         <div className="absolute top-10 left-10 z-10">
            <Link href="/" className="inline-flex items-center gap-3 text-emerald-100/70 hover:text-white font-black transition-all group active:scale-95">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all backdrop-blur-xl shadow-2xl">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-xs tracking-[0.3em] uppercase hidden xl:block">กลับหน้าหลัก</span>
            </Link>
         </div>
         
         {/* Center Content (Logo + Title) */}
         <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-2xl mx-auto">
            
            <div className="mb-12 animate-float">
              <div className="relative group">
                <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full scale-75 group-hover:scale-110 transition-transform duration-700" />
                <div className="relative w-36 h-36 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center p-6 border border-white/20 shadow-2xl">
                  <Image 
                    src={logo} 
                    alt="Nonghan Hospital Logo" 
                    width={112} 
                    height={112} 
                    className="object-contain drop-shadow-2xl" 
                    priority
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">
                ระบบบริหารจัดการข้อมูล <br /> <span className="text-emerald-400">IMT Nonghan Hub</span>
              </h1>
              <p className="text-emerald-100/60 font-bold text-sm xl:text-base tracking-widest uppercase">
                Digital Health Strategy Unit
              </p>
            </div>
            
            <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mt-10 shadow-[0_0_20px_#10b981]" />
            
         </div>
         
         {/* Bottom Center Area (Badge) */}
         <div className="relative z-10 w-full flex justify-center pb-4">
              <div className="inline-flex items-center justify-center gap-4 px-8 py-4 rounded-3xl bg-black/20 border border-white/10 text-emerald-50 font-black text-xs xl:text-sm leading-relaxed backdrop-blur-2xl shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
                โรงพยาบาลหนองหาน · สังกัดสำนักงานสาธารณสุขจังหวัดอุดรธานี
              </div>
         </div>
         
      </div>

      {/* Right Panel - Form Container */}
      <div className="w-full lg:w-7/12 xl:w-1/2 relative flex items-center justify-center p-6 sm:p-12 overflow-hidden bg-white">
        
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 mx-auto">
          
          {/* Mobile Back & Logo */}
          <div className="lg:hidden mb-12 text-center">
             <div className="w-24 h-24 bg-white/80 backdrop-blur-xl rounded-[2rem] mx-auto flex items-center justify-center p-4 shadow-2xl shadow-emerald-900/10 mb-6 border border-emerald-50">
                <Image src={logo} alt="Nonghan Hospital Logo" width={64} height={64} className="object-contain" />
             </div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">IMT Login</h2>
          </div>

          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">ยินดีต้อนรับ 👋</h2>
            <p className="text-slate-500 font-bold text-sm lg:text-base leading-relaxed">
              กรุณาเข้าสู่ระบบด้วยบัญชีเจ้าหน้าที่ <br className="hidden lg:block" />
              เพื่อจัดการคำขอและข้อมูลสารสนเทศ
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white p-10 w-full relative group transition-all duration-500 hover:shadow-emerald-900/5">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
            
            <form onSubmit={handleLogin} className="space-y-8 relative z-10">
              
              {!supabase && (
                <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex items-start gap-4">
                   <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                   </div>
                   <div>
                      <p className="text-sm font-black text-amber-900 leading-tight">Database Not Found</p>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">Check Environment Config</p>
                   </div>
                </div>
              )}

              {error && (
                <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-center gap-4 animate-shake">
                   <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                   </div>
                   <p className="text-sm font-black text-rose-900 leading-tight">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-4">
                    อีเมลบุคลากร (Staff Email)
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl pl-14 pr-6 py-4 outline-none font-black text-slate-800 text-sm focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 transition-all placeholder:text-slate-300 placeholder:font-bold"
                      placeholder="name@nonghan.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-4">
                    รหัสผ่าน (Secure Password)
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl pl-14 pr-6 py-4 outline-none font-black text-slate-800 text-sm focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 transition-all tracking-widest placeholder:text-slate-300 placeholder:font-bold placeholder:tracking-normal"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-5 rounded-2xl font-black text-base shadow-2xl shadow-emerald-900/20 hover:shadow-emerald-900/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="uppercase tracking-widest">Checking Auth...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-6 h-6" />
                      <span className="uppercase tracking-[0.2em]">Sign In Account</span>
                      <ArrowRight className="w-5 h-5 opacity-40 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </button>
              </div>
            </form>
            
            <div className="mt-12 text-center pt-8 border-t border-slate-100 flex flex-col gap-2">
               <div className="flex items-center justify-center gap-2">
                  <User className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Admin Authorization Only</span>
               </div>
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
                 NONGHAN HOSPITAL · DIGITAL HEALTH STRATEGY · 2026
               </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
