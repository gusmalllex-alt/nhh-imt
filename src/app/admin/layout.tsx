"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Home, 
  Users,
  Bell,
  Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/nhh.png";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        if (!session) {
          router.push("/login");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex flex-col items-center justify-center p-8">
         <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
         <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Authenticating Staff Access...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-950 text-white flex flex-col shadow-2xl z-20 overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

        <div className="p-6 border-b border-emerald-900/50 relative z-10 bg-emerald-950">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
               <Image src={logo} alt="Logo" width={24} height={24} className="brightness-0 invert" />
            </div>
            <div>
              <h1 className="font-black text-lg leading-none tracking-tight text-white">IMT ADMIN</h1>
              <p className="text-[10px] text-emerald-400 font-bold uppercase mt-1 tracking-widest leading-none">Nonghan Hospital</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4 relative z-10">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-800/50 text-emerald-50 border border-emerald-700/50 transition-all font-bold shadow-sm"
          >
            <LayoutDashboard className="w-5 h-5" />
            หน้าแดชบอร์ด
          </Link>
          <Link 
            href="/status" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-100/70 hover:bg-white/5 hover:text-white transition-all font-medium"
          >
            <FileText className="w-5 h-5" />
            รายการคำขอทั้งหมด
          </Link>
          <Link 
            href="/admin/users" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-100/70 hover:bg-white/5 hover:text-white transition-all font-medium"
          >
            <Users className="w-5 h-5" />
            จัดการบุคลากร
          </Link>
        </nav>

        <div className="p-4 border-t border-emerald-900/50 space-y-1 relative z-10 bg-emerald-950/80 backdrop-blur-sm">
          <Link 
            href="#" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-100/70 hover:bg-white/5 hover:text-white transition-all font-medium"
          >
            <Settings className="w-5 h-5" />
            ตั้งค่าระบบ
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-300 hover:bg-rose-500/10 hover:text-rose-400 transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm relative z-10">
          <div className="flex items-center gap-4">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-sm font-bold text-gray-500">ระบบจัดการคำขอข้อมูลกลาง</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-emerald-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">3</span>
            </button>
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-right flex flex-col justify-center">
                <span className="text-sm font-black text-gray-900 leading-none">เจ้าหน้าที่ IMT</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase mt-1 truncate max-w-[120px]">{user?.email}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-700 shadow-sm group-hover:scale-105 transition-transform">
                {user?.email?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
          <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none -z-10" />
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
