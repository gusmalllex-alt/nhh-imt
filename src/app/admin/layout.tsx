import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Home, 
  Users,
  Bell
} from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-950 text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-emerald-900/50">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg leading-none tracking-tight">IMT ADMIN</h1>
              <p className="text-[10px] text-emerald-400 font-bold uppercase mt-1 tracking-widest">Nonghan Hospital</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-800/50 text-emerald-50 border border-emerald-700/50 transition-all font-bold"
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
            href="#" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-100/70 hover:bg-white/5 hover:text-white transition-all font-medium"
          >
            <Users className="w-5 h-5" />
            จัดการบุคลากร
          </Link>
        </nav>

        <div className="p-4 border-t border-emerald-900/50 space-y-1">
          <Link 
            href="#" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-100/70 hover:bg-white/5 hover:text-white transition-all font-medium"
          >
            <Settings className="w-5 h-5" />
            ตั้งค่าระบบ
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-300 hover:bg-rose-500/10 hover:text-rose-400 transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            ออกจากระบบ
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
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
                <span className="text-[10px] font-bold text-emerald-600 uppercase mt-1">Super Admin</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-700 shadow-sm group-hover:scale-105 transition-transform">
                IMT
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none -z-10" />
          {children}
        </div>
      </main>
    </div>
  );
}
