"use client";

import { useState, useEffect } from "react";
import { getRequests } from "../actions/adminActions";
import { LayoutDashboard, AlertCircle, Loader2, ListTodo, PieChart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import RequestTable from "./RequestTable";
import AdminDashboardView from "./AdminDashboardView";
import { Suspense } from "react";

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-600 w-10 h-10" /></div>}>
      <AdminPageContent />
    </Suspense>
  );
}

function AdminPageContent() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("view") === "requests" ? "requests" : "dashboard";

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getRequests();
      if (result.success) {
        setRequests(result.data || []);
      } else {
        setError(result.message || "ไม่สามารถโหลดข้อมูลได้");
      }
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">ไม่สามารถโหลดข้อมูลได้</h2>
        <p className="text-slate-500 font-medium mb-6 text-center max-w-md">
          เกิดข้อผิดพลาด: {error}
        </p>
        <button 
          onClick={fetchData}
          className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {activeTab === "dashboard" ? (
              <><PieChart className="w-6 h-6 text-emerald-600" /> แดชบอร์ดสรุปผล</>
            ) : (
              <><ListTodo className="w-6 h-6 text-emerald-600" /> รายการคำขอทั้งหมด</>
            )}
          </h2>
          <p className="text-slate-500 text-xs font-medium">ศูนย์ควบคุมการจัดการข้อมูลและสถิติกลาง</p>
        </div>
      </div>

      {/* Main Content Render */}
      <div className="transition-all duration-500">
        {activeTab === "dashboard" ? (
          <AdminDashboardView requests={requests} />
        ) : (
          <RequestTable initialRequests={requests} />
        )}
      </div>
    </div>
  );
}
