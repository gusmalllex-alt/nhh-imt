"use client";

import React, { useState, useEffect, Suspense } from "react";
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
  Loader2,
  ListTodo,
  Activity,
  Clock
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  const [showHistory, setShowHistory] = useState(false);

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
      <div className="h-screen w-screen bg-slate-50 flex flex-col items-center justify-center p-8 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
         <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-emerald-400/20 rounded-3xl animate-ping opacity-75" />
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
         </div>
         <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Authenticating Secure Access</p>
         <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mt-4 opacity-50" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-gray-800 selection:bg-emerald-200">
      
      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-white flex flex-col shadow-2xl z-20 relative overflow-hidden">
        {/* Sidebar background effects */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="p-6 border-b border-white/5 bg-black/10 backdrop-blur-xl relative z-10">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
               <div className="absolute inset-0 bg-emerald-400/30 rounded-xl blur-md group-hover:bg-emerald-400/50 transition-colors" />
               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-500 border border-emerald-400/30">
                  <Image src={logo} alt="Logo" width={28} height={28} className="brightness-0 invert drop-shadow-md" />
               </div>
            </div>
            <div>
              <h1 className="font-black text-xl leading-none tracking-tight text-white drop-shadow-sm">IMT ADMIN</h1>
              <div className="flex items-center gap-1.5 mt-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                 <p className="text-[9px] text-emerald-400 font-black uppercase tracking-[0.2em] opacity-90">Nonghan Hub</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 p-3">
           <Suspense fallback={<div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" /></div>}>
             <AdminSidebarContent />
           </Suspense>
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-xl relative z-10">
          <div className="space-y-2">
            <Link 
              href="/admin/settings" 
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-300 hover:bg-white/10 hover:text-white transition-all font-bold text-sm group border border-transparent hover:border-white/5"
            >
              <Settings className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-500" />
              ตั้งค่าระบบ
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-all font-bold text-sm group border border-transparent hover:border-rose-500/20"
            >
              <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none z-0" />
        
        {/* Top Header */}
        <header className="h-20 bg-white/70 backdrop-blur-3xl border-b border-slate-200/50 flex items-center justify-between px-8 shadow-sm z-10 relative">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
             <div className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Personnel Management System</span>
          </div>
          
          <div className="flex items-center gap-6 relative">
            <div className="relative">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`relative p-2.5 transition-all rounded-xl border ${showHistory ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-inner' : 'bg-white text-slate-400 hover:text-emerald-600 hover:bg-slate-50 border-slate-100 shadow-sm'}`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">3</span>
              </button>

              {/* Login History Dropdown */}
              {showHistory && (
                <>
                  <div className="fixed inset-0 z-40 bg-slate-900/5 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
                  <div className="absolute right-0 mt-4 w-96 bg-white/90 backdrop-blur-3xl rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-white z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-300 origin-top-right">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                       <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-600" /> ประวัติการเข้าใช้งาน
                       </h3>
                       <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200/50">Recent Logs</span>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                       <LoginHistoryList userEmail={user?.email} />
                    </div>
                    <div className="p-4 bg-slate-50/80 border-t border-slate-100 text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                       Security Logs · NHH IMT
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="h-8 w-px bg-slate-200" />
            
            <div className="flex items-center gap-4 bg-white pl-4 pr-2 py-1.5 rounded-full shadow-sm border border-slate-100 cursor-default hover:shadow-md transition-shadow">
              <div className="text-right hidden sm:flex flex-col justify-center">
                <span className="text-[11px] font-black text-slate-900 leading-none uppercase tracking-wider">เจ้าหน้าที่ IMT</span>
                <span className="text-[10px] font-bold text-emerald-600 mt-1">{user?.email}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-black text-sm ring-2 ring-white shadow-inner">
                {user?.email?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto min-h-full flex flex-col">
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
               {children}
            </div>
            
            {/* Global Footer */}
            <footer className="mt-16 py-8 border-t border-slate-200/60 text-center flex flex-col items-center gap-4">
               <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-50" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  พัฒนาโดย <span className="text-emerald-600">กลุ่มงานสุขภาพดิจิทัล</span> · โรงพยาบาลหนองหาน <br className="md:hidden mt-1"/>
                  <span className="hidden md:inline"> | </span> นายศุภชัย สุนารักษ์ นักวิชาการสถิติ
               </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminSidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const links = [
    { href: "/admin?view=dashboard", icon: LayoutDashboard, label: "Dashboard", isActive: pathname === "/admin" && view !== "requests" },
    { href: "/admin?view=requests", icon: ListTodo, label: "จัดการคำขอทั้งหมด", isActive: pathname === "/admin" && view === "requests" },
    { href: "/admin/users", icon: Users, label: "จัดการบุคลากร", isActive: pathname === "/admin/users" }
  ];

  return (
    <nav className="flex-1 space-y-2 mt-4">
      {links.map((link, idx) => (
         <Link 
           key={idx}
           href={link.href} 
           className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all font-black text-sm relative group overflow-hidden ${
             link.isActive
               ? "text-white shadow-lg shadow-emerald-900/20"
               : "text-slate-400 hover:text-white hover:bg-white/5"
           }`}
         >
           {/* Active Background */}
           {link.isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600" />
           )}
           
           <div className="relative z-10 flex items-center gap-3.5">
              <link.icon className={`w-5 h-5 ${link.isActive ? "text-emerald-100" : "opacity-70 group-hover:opacity-100"}`} />
              {link.label}
           </div>
           
           {link.isActive && (
              <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] z-10" />
           )}
         </Link>
      ))}
    </nav>
  );
}

function LoginHistoryList({ userEmail }: { userEmail: string | undefined }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('login_history')
        .select('*')
        .eq('email', userEmail)
        .order('login_at', { ascending: false })
        .limit(10);
      
      if (!error && data) {
        setLogs(data);
      }
      setLoading(false);
    };
    fetchLogs();
  }, [userEmail]);

  if (loading) return <div className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-500" /></div>;
  
  if (logs.length === 0) return (
    <div className="p-12 text-center flex flex-col items-center">
       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
          <Clock className="w-6 h-6 text-slate-300" />
       </div>
       <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">ยังไม่มีประวัติการใช้งาน</div>
       <p className="text-[9px] text-slate-400 font-bold italic">Logs will appear after your next login</p>
    </div>
  );

  return (
    <div className="divide-y divide-slate-100/50">
      {logs.map((log) => (
        <div key={log.id} className="p-5 hover:bg-emerald-50/30 transition-colors flex items-center gap-4 group cursor-default">
           <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 group-hover:scale-110 group-hover:border-emerald-200 transition-all">
              <Clock className="w-4 h-4" />
           </div>
           <div>
              <div className="text-[11px] font-black text-slate-900 flex items-center gap-2 mb-1">
                 เข้าสู่ระบบสำเร็จ
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md inline-block border border-slate-100 group-hover:bg-white transition-colors">
                 {new Date(log.login_at).toLocaleString('th-TH', { 
                   dateStyle: 'medium', 
                   timeStyle: 'short' 
                 })}
              </div>
           </div>
        </div>
      ))}
    </div>
  );
}
