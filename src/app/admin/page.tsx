"use client";

import { useState, useEffect } from "react";
import { getRequests } from "../actions/adminActions";
import { LayoutDashboard, AlertCircle, Loader2 } from "lucide-react";
import RequestTable from "./RequestTable";

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
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
    }
    loadData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold">กำลังโหลดข้อมูลรายการคำขอ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">ไม่สามารถโหลดข้อมูลได้</h2>
        <p className="text-slate-500 font-medium mb-6 text-center max-w-md">
          เกิดข้อผิดพลาด: {error} <br/>
          กรุณาตรวจสอบการตั้งค่า <code className="px-2 py-0.5 bg-slate-100 rounded text-rose-600 font-mono text-sm">NEXT_PUBLIC_GOOGLE_SCRIPT_URL</code> ในไฟล์ .env.local
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-emerald-600" /> แผงควบคุมผู้ดูแลระบบ
          </h2>
          <p className="text-slate-500 font-medium mt-1">จัดการทุกคำขอผ่าน Google Sheets (Real-time)</p>
        </div>
      </div>

      <RequestTable initialRequests={requests} />
      
    </div>
  );
}
