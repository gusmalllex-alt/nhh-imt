"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Search, Calendar as CalendarIcon, RefreshCw, ChevronLeft, ChevronRight, 
  Home, Activity, CheckCircle2, Clock, AlertCircle, PlayCircle, XCircle,
  FileDown, Info, Send, X, ClipboardList, User2, Building2, PhoneCall, Mail,
  MessageSquare, UserCircle2, Calendar, FileText, Loader2
} from "lucide-react";
import { getRequests, addUserInformation } from "../actions/adminActions";
import logo from "../../../public/nhh.png";
import Image from "next/image";

export default function StatusTracking() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getRequests();
    if (result.success) {
      setRequests(result.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    setCurrentPage(1);
  };

  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return sortedRequests.filter(req => 
      req.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requester_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedRequests, searchTerm]);

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredRequests.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRequests, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      "ดำเนินการเรียบร้อย": "bg-emerald-600 text-white",
      "รอดำเนินการ": "bg-amber-500 text-white",
      "รับเรื่อง": "bg-sky-500 text-white",
      "กำลังดำเนินการ": "bg-blue-600 text-white",
      "ขอข้อมูลเพิ่ม": "bg-purple-600 text-white",
      "ยกเลิก": "bg-rose-600 text-white",
    };
    
    const icons: Record<string, any> = {
      "ดำเนินการเรียบร้อย": <CheckCircle2 className="w-3.5 h-3.5" />,
      "รอดำเนินการ": <Clock className="w-3.5 h-3.5" />,
      "รับเรื่อง": <PlayCircle className="w-3.5 h-3.5" />,
      "กำลังดำเนินการ": <Activity className="w-3.5 h-3.5" />,
      "ขอข้อมูลเพิ่ม": <AlertCircle className="w-3.5 h-3.5" />,
      "ยกเลิก": <XCircle className="w-3.5 h-3.5" />,
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm uppercase tracking-wider ${styles[status] || "bg-slate-500 text-white"}`}>
        {icons[status] || <Info className="w-3.5 h-3.5" />}
        {status}
      </span>
    );
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !selectedRequest) return;
    setIsSubmittingReply(true);
    const result = await addUserInformation(selectedRequest.id, replyText);
    if (result.success) {
      setIsModalOpen(false);
      setReplyText("");
      handleRefresh();
      alert("ส่งข้อมูลตอบกลับเรียบร้อยแล้วครับ!");
    } else {
      alert("เกิดข้อผิดพลาด: " + result.message);
    }
    setIsSubmittingReply(false);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] font-sans text-slate-800 pb-20 overflow-x-hidden">
      
      {/* Professional Medical Header */}
      <div className="bg-[#003d24] text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 shadow-xl">
                    <Image src={logo} alt="Logo" width={64} height={64} className="object-contain" />
                 </div>
                 <div>
                    <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-white transition-all text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
                       <Home className="w-3.5 h-3.5" /> Nonghan Hospital
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">ระบบติดตามสถานะคำขอข้อมูล</h1>
                    <p className="text-emerald-400/80 text-xs font-medium uppercase tracking-widest mt-1">Nonghan IMT Information Center</p>
                 </div>
              </div>
              
              <button 
                onClick={handleRefresh}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                รีเฟรชข้อมูล
              </button>
           </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 -mt-8">
        
        {/* Stats Summary Panel */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
           {[
             { label: "ทั้งหมด", count: requests.length, color: "text-slate-900", bg: "bg-slate-100", icon: FileText },
             { label: "รอดำเนินการ", count: requests.filter(r => r.status === "รอดำเนินการ").length, color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
             { label: "ขอข้อมูลเพิ่ม", count: requests.filter(r => r.status === "ขอข้อมูลเพิ่ม").length, color: "text-purple-600", bg: "bg-purple-50", icon: AlertCircle },
             { label: "รับเรื่องแล้ว", count: requests.filter(r => ["รับเรื่อง", "กำลังดำเนินการ"].includes(r.status)).length, color: "text-blue-600", bg: "bg-blue-50", icon: PlayCircle },
             { label: "เรียบร้อย", count: requests.filter(r => r.status === "ดำเนินการเรียบร้อย").length, color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
             { label: "ยกเลิก", count: requests.filter(r => r.status === "ยกเลิก").length, color: "text-rose-600", bg: "bg-rose-50", icon: XCircle }
           ].map((card, idx) => (
             <div key={idx} className={`${card.bg} rounded-lg p-3 flex flex-col justify-center border border-black/5`}>
                <div className="flex justify-between items-center mb-1">
                   <div className={`text-xl font-bold ${card.color}`}>{card.count}</div>
                   <card.icon className={`w-4 h-4 ${card.color} opacity-60`} />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-tight text-slate-500">{card.label}</div>
             </div>
           ))}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
           <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold text-base placeholder:text-slate-300 text-slate-900"
                placeholder="ค้นหาด้วยชื่อผู้แจ้ง หรือหัวข้อเรื่อง..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
           </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ลำดับ / วันที่</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 w-[40%]">เรื่องข้อมูลที่ขอ</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ผู้ขอรับบริการ</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">สถานะงาน</th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">ดูข้อมูล</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-32 text-center">
                       <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
                       <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Refreshing...</span>
                    </td>
                  </tr>
                ) : paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-32 text-center text-slate-400 font-bold">ไม่พบข้อมูลผลการค้นหา</td>
                  </tr>
                ) : paginatedRequests.map((req, idx) => (
                  <tr key={req.id} className="group hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 mb-1">REQ#{filteredRequests.length - ((currentPage - 1) * rowsPerPage + idx)}</span>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                          <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
                          {new Date(req.created_at).toLocaleDateString('th-TH')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col">
                          <h4 className="font-bold text-slate-900 text-sm">{req.title}</h4>
                          <span className={`${req.urgency === 'ด่วนมาก' ? 'text-rose-600' : 'text-slate-400'} text-[10px] font-bold uppercase mt-1`}>
                             {req.type} • {req.urgency}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-800 text-sm">{req.requester_name}</div>
                      <div className="text-emerald-700 font-bold text-[10px] uppercase mt-1 tracking-wider">{req.department}</div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-6 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                        className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                         <Info className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
             <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                หน้า <span className="text-emerald-600 text-sm">{currentPage}</span> / <span className="text-slate-700">{totalPages || 1}</span>
             </div>
             <div className="flex gap-2">
                <button 
                  disabled={currentPage === 1 || loading}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all active:scale-95"
                >
                  ย้อนกลับ
                </button>
                <button 
                  disabled={currentPage === totalPages || totalPages === 0 || loading}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all active:scale-95"
                >
                  ถัดไป
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* --- Detail Modal --- */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="font-bold text-slate-900 flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-600" /> ข้อมูลคำขอของคุณ</h3>
               <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto font-sans">
               
               {/* Work Info */}
               <div className="bg-slate-50 p-5 rounded-lg border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">หัวข้อที่แจ้ง</label>
                     <div className="text-base font-bold text-slate-900 leading-snug mt-1">{selectedRequest.title}</div>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">สถานะการดำเนินงาน</label>
                     <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ผู้รับผิดชอบงาน</label>
                     <div className="text-sm font-bold text-slate-800 mt-1">{selectedRequest.assigned_to || "อยู่ระหว่างรอรับเรื่อง"}</div>
                  </div>
                  <div className="md:col-span-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">รายละเอียดงาน</label>
                     <div className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200 mt-1 font-medium italic whitespace-pre-wrap">{selectedRequest.condition || "ไม่ได้ระบุรายละเอียด"}</div>
                  </div>
               </div>

               {/* Admin Reply Area */}
               {selectedRequest.status === "ขอข้อมูลเพิ่ม" && (
                  <div className="bg-purple-900 text-white rounded-lg p-6 shadow-lg">
                     <div className="flex items-center gap-2 text-purple-200 font-bold text-xs uppercase tracking-widest mb-3">
                        <AlertCircle className="w-4 h-4 animate-pulse" /> ข้อความจากเจ้าหน้าที่
                     </div>
                     <div className="text-lg font-bold leading-relaxed mb-6 italic">
                        "{selectedRequest.admin_note || "เจ้าหน้าที่ต้องการข้อมูลเพิ่มเติมครับ"}"
                     </div>
                     
                     <div className="space-y-3">
                        <label className="text-[10px] font-bold text-purple-200 uppercase tracking-wider ml-1">พิมพ์คำคมหรือข้อมูลตอบกลับ</label>
                        <textarea 
                           className="w-full bg-white/10 border border-white/20 rounded-lg p-4 text-white font-bold outline-none focus:bg-white/20 transition-all min-h-[120px] text-sm"
                           placeholder="ระบุข้อมูลที่ส่งเพิ่มที่นี่..."
                           value={replyText}
                           onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button 
                           disabled={!replyText.trim() || isSubmittingReply}
                           onClick={handleSubmitReply}
                           className="w-full py-3 bg-white text-purple-900 rounded-lg font-bold shadow-md hover:bg-purple-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                           {isSubmittingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> ส่งข้อมูลตอบกลับ</>}
                        </button>
                     </div>
                  </div>
               )}

               {/* Requester Info */}
               <div className="bg-white p-5 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ชื่อผู้ส่งคำขอ</label>
                     <div className="text-sm font-bold text-slate-800">{selectedRequest.requester_name}</div>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">หน่วยงาน</label>
                     <div className="text-sm font-bold text-slate-800">{selectedRequest.department}</div>
                  </div>
               </div>

            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
               <button onClick={() => setIsModalOpen(false)} className="px-8 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-xs hover:bg-slate-200 transition-colors">ปิดหน้าต่าง</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="mt-12 py-12 border-t border-slate-200 text-center">
         <div className="max-w-7xl mx-auto px-6 space-y-6">
            <div className="flex justify-center items-center gap-4 text-slate-300">
               <div className="h-px w-12 bg-slate-200" />
               <Image src={logo} alt="Mini Logo" width={24} height={24} className="opacity-20 grayscale" />
               <div className="h-px w-12 bg-slate-200" />
            </div>
            
            <div className="space-y-1">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                  NONGHAN HOSPITAL · IMT INFORMATION HUB
               </p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  พัฒนาโดย <span className="text-emerald-600">กลุ่มงานสุขภาพดิจิทัล</span> : นายศุภชัย สุนารักษ์ นักวิชาการสถิติ
               </p>
            </div>
            
            <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
               © 2026 OFFICIAL IT PORTAL · ALL RIGHTS RESERVED
            </div>
         </div>
      </footer>
    </div>
  );
}
