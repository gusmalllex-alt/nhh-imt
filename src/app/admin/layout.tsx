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

        <Suspense fallback={<div className="flex-1 p-5 opacity-20"><Loader2 className="animate-spin" /></div>}>
          <AdminSidebarContent />
        </Suspense>

        <div className="p-3 border-t border-slate-800 bg-slate-900/40">
          <Link 
            href="/admin/settings" 
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
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none z-0" />
        
        {/* Top Header */}
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10 relative">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             Personnel Management System
          </div>
          
          <div className="flex items-center gap-5 relative">
            <div className="relative">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`relative p-1.5 transition-colors rounded-lg ${showHistory ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:text-emerald-600'}`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">3</span>
              </button>

              {/* Login History Dropdown */}
              {showHistory && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowHistory(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <Activity className="w-3.5 h-3.5 text-emerald-600" /> ประวัติการเข้าใช้งาน
                       </h3>
                       <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Recent Logs</span>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                       <LoginHistoryList userEmail={user?.email} />
                    </div>
                    <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       Security Logs · NHH IMT
                    </div>
                  </div>
                </>
              )}
            </div>
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
          <div className="max-w-7xl mx-auto min-h-full flex flex-col">
            <div className="flex-1">
               {children}
            </div>
            
            {/* Global Footer */}
            <footer className="mt-12 py-6 border-t border-slate-200 text-center">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  พัฒนาโดย <span className="text-emerald-600">กลุ่มงานสุขภาพดิจิทัล</span> : นายศุภชัย สุนารักษ์ นักวิชาการสถิติ
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

  return (
    <nav className="flex-1 p-3 space-y-1 mt-2">
      <Link 
        href="/admin?view=dashboard" 
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all font-bold text-sm ${
          pathname === "/admin" && view !== "requests"
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </Link>
      <Link 
        href="/admin?view=requests" 
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all font-bold text-sm ${
          pathname === "/admin" && view === "requests"
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <ListTodo className="w-4 h-4" />
        จัดการคำขอทั้งหมด
      </Link>
      <Link 
        href="/admin/users" 
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all font-bold text-sm ${
          pathname === "/admin/users"
            ? "bg-emerald-600 text-white shadow-sm"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <Users className="w-4 h-4" />
        จัดการบุคลากร
      </Link>
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

  if (loading) return <div className="p-10 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-slate-300" /></div>;
  
  if (logs.length === 0) return (
    <div className="p-10 text-center">
       <div className="text-2xl mb-2 opacity-20">🕒</div>
       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ยังไม่มีประวัติการใช้งาน</div>
       <p className="text-[9px] text-slate-300 mt-1 italic">Logs will appear after your next login</p>
    </div>
  );

  return (
    <div className="divide-y divide-slate-50">
      {logs.map((log) => (
        <div key={log.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center gap-4">
           <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50">
              <Clock className="w-4 h-4" />
           </div>
           <div>
              <div className="text-[11px] font-black text-slate-900 flex items-center gap-2">
                 เข้าสู่ระบบสำเร็จ
                 <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">
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
