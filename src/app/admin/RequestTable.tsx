"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PlayCircle, 
  XCircle, 
  Search, 
  Filter, 
  MoreVertical, 
  Download,
  User,
  Activity,
  FileText,
  Loader2,
  Calendar
} from "lucide-react";
import { updateRequestStatus } from "../actions/adminActions";

export default function RequestTable({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requester_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ทั้งหมด" || req.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (rowIndex: string, newStatus: string) => {
    setUpdatingId(rowIndex);
    try {
      const result = await updateRequestStatus(rowIndex, { status: newStatus });
      if (result.success) {
        setRequests(prev => prev.map(r => r.rowIndex.toString() === rowIndex ? { ...r, status: newStatus } : r));
      } else {
        alert("Error updating status: " + result.message);
      }
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ดำเนินการเรียบร้อย":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs ring-1 ring-emerald-400/30"><CheckCircle2 className="w-3.5 h-3.5" /> เรียบร้อย</span>;
      case "รอดำเนินการ":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-bold text-xs ring-1 ring-amber-400/30"><Clock className="w-3.5 h-3.5" /> รอดำเนินการ</span>;
      case "รับเรื่อง":
      case "กำลังดำเนินการ":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs ring-1 ring-blue-400/30"><PlayCircle className="w-3.5 h-3.5" /> {status}</span>;
      case "ขอข้อมูลเพิ่ม":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-xs ring-1 ring-purple-400/30"><AlertCircle className="w-3.5 h-3.5" /> ขอข้อมูลเพิ่ม</span>;
      case "ยกเลิก":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-bold text-xs ring-1 ring-rose-400/30"><XCircle className="w-3.5 h-3.5" /> ยกเลิก</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-bold text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "คำขอทั้งหมด", value: requests.length, icon: FileText, color: "bg-slate-900", shadow: "shadow-slate-200" },
          { label: "รอดำเนินการ", value: requests.filter((r) => r.status === "รอดำเนินการ").length, icon: Clock, color: "bg-amber-500", shadow: "shadow-amber-200" },
          { label: "รับเรื่อง/ตรวจสอบ", value: requests.filter((r) => r.status === "รับเรื่อง" || r.status === "กำลังดำเนินการ").length, icon: Activity, color: "bg-blue-600", shadow: "shadow-blue-200" },
          { label: "ดำเนินการเสร็จสิ้น", value: requests.filter((r) => r.status === "ดำเนินการเรียบร้อย").length, icon: CheckCircle2, color: "bg-emerald-600", shadow: "shadow-emerald-200" }
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl ${stat.shadow} hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden group`}>
            <stat.icon className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-slate-50 group-hover:text-slate-100 transition-colors" />
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4 shadow-lg shadow-current/20`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black text-slate-900 mb-1">{stat.value}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative flex-1 w-full max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <input 
             type="text" 
             placeholder="ค้นหาชื่อเรื่อง, ผู้ขอ, แผนก..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm"
           />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {["ทั้งหมด", "รอดำเนินการ", "รับเรื่อง", "ดำเนินการเรียบร้อย", "ยกเลิก"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === status 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-slate-100 overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="px-5 py-2 bg-emerald-600 text-white rounded-full text-xs font-black shadow-lg shadow-emerald-600/20">
               รายการคำขอล่าสุด (Google Sheets)
            </div>
            <span className="text-xs font-bold text-slate-400">เรียลไทม์ผ่าน GAS API</span>
          </div>
          
          <div className="text-xs font-bold text-slate-600">
             แสดง <span className="text-emerald-600">{filteredRequests.length}</span> รายการ
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead className="bg-slate-50/50">
               <tr>
                 <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">วันเวลาที่ขอ</th>
                 <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">หัวข้อ / เรื่อง</th>
                 <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">ผู้ขอ / หน่วยงาน</th>
                 <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">ความเร่งด่วน</th>
                 <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">สถานะงาน</th>
                 <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-center">จัดการ</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {filteredRequests.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-400">
                        <FileText className="w-16 h-16 opacity-10" />
                        <p className="font-extrabold text-xl">ไม่พบรายการที่ค้นหา</p>
                      </div>
                   </td>
                 </tr>
               ) : (
                 filteredRequests.map((req: any) => (
                   <tr key={req.rowIndex} className="group hover:bg-emerald-50/30 transition-colors">
                     <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-700">
                             {req.created_at ? new Date(req.created_at).toLocaleDateString('th-TH') : '-'}
                           </span>
                           <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                             <Clock className="w-3 h-3" /> {req.created_at ? new Date(req.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '-'} น.
                           </span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex flex-col max-w-[280px]">
                           <span className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{req.title}</span>
                           <span className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-tight">{req.type}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-700 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-emerald-500" /> {req.requester_name}</span>
                           <span className="text-[11px] font-bold text-emerald-600/70 mt-1">{req.department}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <span className={`text-xs font-black p-1.5 rounded-lg border-2 ${
                          req.urgency === 'ด่วนมาก' ? 'border-rose-100 text-rose-600 bg-rose-50' : 
                          req.urgency === 'ด่วน' ? 'border-orange-100 text-orange-600 bg-orange-50' : 
                          'border-emerald-100 text-emerald-600 bg-emerald-50'
                        }`}>
                          {req.urgency}
                        </span>
                     </td>
                     <td className="px-8 py-6">
                        <div className="relative inline-block text-left group/status">
                          {updatingId === req.rowIndex.toString() ? (
                            <Loader2 className="w-5 h-5 animate-spin text-emerald-600 mx-auto" />
                          ) : (
                            <div className="flex items-center gap-2">
                              {getStatusBadge(req.status)}
                              <select 
                                onChange={(e) => handleStatusUpdate(req.rowIndex.toString(), e.target.value)}
                                value={req.status}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              >
                                <option value="รอดำเนินการ">รอดำเนินการ</option>
                                <option value="รับเรื่อง">รับเรื่อง</option>
                                <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                                <option value="ขอข้อมูลเพิ่ม">ขอข้อมูลเพิ่ม</option>
                                <option value="ดำเนินการเรียบร้อย">ดำเนินการเรียบร้อย</option>
                                <option value="ยกเลิก">ยกเลิก</option>
                              </select>
                            </div>
                          )}
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                           {req.file_url && (
                             <a 
                               href={req.file_url} 
                               target="_blank" 
                               className="p-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors shadow-sm"
                               title="Download File"
                             >
                                <Download className="w-4 h-4" />
                             </a>
                           )}
                           <button className="p-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-sm">
                             <MoreVertical className="w-4 h-4" />
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-8 border-t border-slate-50 bg-slate-50/20 text-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">© 2026 Nonghan Hospital IMT Service Hub • Powerby Google Sheets</p>
        </div>
      </div>
    </div>
  );
}
