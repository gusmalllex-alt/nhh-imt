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
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-20">
        <div className="p-5 border-b border-slate-800 bg-slate-900/50">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
               <Image src={logo} alt="Logo" width={20} height={20} className="brightness-0 invert" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-none tracking-tight">IMT ADMIN</h1>
              <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1 tracking-wider">Nonghan Hospital</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-2">
          <Link 
            href="/admin" 
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-emerald-600 text-white transition-all font-bold text-sm shadow-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link 
            href="/admin/users" 
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-bold text-sm"
          >
            <Users className="w-4 h-4" />
            จัดการบุคลากร
          </Link>
        </nav>

        <div className="p-3 border-t border-slate-800 bg-slate-900/40">
          <Link 
            href="#" 
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-bold text-sm"
          >
            <Settings className="w-4 h-4" />
            ตั้งค่าระบบ
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-rose-400 hover:bg-rose-900/20 transition-all font-bold text-sm"
          >
            <LogOut className="w-4 h-4" />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             Personnel Management System
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative p-1.5 text-slate-400 hover:text-emerald-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">3</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-none">เจ้าหน้าที่ IMT</span>
                <span className="text-[10px] font-medium text-emerald-600 mt-1">{user?.email}</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-1 ring-slate-200">
                {user?.email?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
