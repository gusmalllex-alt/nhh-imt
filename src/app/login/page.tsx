"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Lock, Mail, ArrowRight, ShieldCheck, 
  AlertCircle, Loader2, Home 
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-emerald-200">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-100/50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-100/50 rounded-full blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        
        {/* Back Link */}
        <div className="mb-8 flex justify-center">
           <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold transition-colors group">
              <Home className="w-4 h-4" />
              <span>กลับสู่หน้าหลัก</span>
           </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-slate-100 overflow-hidden">
          
          <div className="p-8 md:p-10 border-b border-slate-50 text-center">
             <div className="w-20 h-20 bg-emerald-50 rounded-3xl mx-auto flex items-center justify-center p-3 shadow-inner mb-6 ring-1 ring-emerald-500/10">
                <Image src={logo} alt="Nonghan Hospital Logo" width={60} height={60} className="object-contain" />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">เข้าสู่ระบบ</h1>
             <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">IMT Portal Administrative Access</p>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleLogin} className="space-y-6">
              
              {!supabase && (
                <div className="bg-amber-50 border-2 border-amber-100 p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                   <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                   <div className="space-y-1">
                      <p className="text-sm font-bold text-amber-800 leading-tight">ระบบยังไม่ได้เชื่อมต่อฐานข้อมูล</p>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tight">กรุณาตั้งค่า Environment Variables ใน GitHub Secrets</p>
                   </div>
                </div>
              )}

              {error && (
                <div className="bg-rose-50 border-2 border-rose-100 p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                   <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                   <p className="text-sm font-bold text-rose-800 leading-tight">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-4">
                    <Mail className="w-3 h-3" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none font-bold text-lg focus:bg-white focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                    placeholder="name@nonghan.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-4">
                    <Lock className="w-3 h-3" /> Password Access
                  </label>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none font-bold text-lg focus:bg-white focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>กำลังประมวลผล...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-6 h-6" />
                      <span>เข้าสู่ระบบ</span>
                      <ArrowRight className="w-5 h-5 ml-1 opacity-50" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          <div className="px-8 pb-8 text-center">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">
               ระบบรักษาความปลอดภัยโรงพยาบาลหนองหาน © 2026
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
