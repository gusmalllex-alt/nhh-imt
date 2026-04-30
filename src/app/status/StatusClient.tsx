"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Search, Calendar as CalendarIcon, RefreshCw, ChevronLeft, ChevronRight, 
  Home, Activity, CheckCircle2, Clock, AlertCircle, PlayCircle, XCircle,
  FileDown, Info, Send, X, ClipboardList, User2, Building2, PhoneCall, Mail,
  MessageSquare, UserCircle2, Calendar, FileText, Loader2, Zap
} from "lucide-react";
import { getRequests, addUserInformation } from "../actions/adminActions";
import logo from "../../../public/nhh.png";
import Image from "next/image";

export default function StatusClient() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    const result = await getRequests();
    if (result.success) {
      setRequests(result.data || []);
    } else {
      setFetchError(result.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
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
      <div className="bg-gradient-to-br from-[#003d24] via-[#004d30] to-[#0f172a] text-white py-16 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.08] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex items-center gap-8">
                 <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center p-4 shadow-2xl border border-white/20">
                    <Image src={logo} alt="โลโก้โรงพยาบาลหนองหาน" width={72} height={72} className="object-contain drop-shadow-lg" priority />
                 </div>
                 <div>
                    <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                       <Home className="w-3.5 h-3.5" /> Nonghan Hospital
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight leading-none">ระบบติดตามสถานะ</h1>
                    <p className="text-emerald-400/90 text-xs font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                       <Activity className="w-4 h-4" /> Nonghan IMT Information Hub
                    </p>
                 </div>
              </div>
              
              <button 
                onClick={handleRefresh}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-emerald-900/40 active:scale-95 flex items-center gap-3 text-sm group"
              >
                <RefreshCw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-700 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>รีเฟรชข้อมูล</span>
              </button>
           </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 -mt-8">
        
        {/* Stats Summary Panel */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white p-5 mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
           {[
             { label: "ทั้งหมด", count: requests.length, color: "text-slate-900", bg: "bg-slate-50", icon: FileText, dot: "bg-slate-400" },
             { label: "รอดำเนินการ", count: requests.filter(r => r.status === "รอดำเนินการ").length, color: "text-amber-600", bg: "bg-amber-50/50", icon: Clock, dot: "bg-amber-500" },
             { label: "ขอข้อมูลเพิ่ม", count: requests.filter(r => r.status === "ขอข้อมูลเพิ่ม").length, color: "text-purple-600", bg: "bg-purple-50/50", icon: AlertCircle, dot: "bg-purple-500" },
             { label: "รับเรื่องแล้ว", count: requests.filter(r => ["รับเรื่อง", "กำลังดำเนินการ"].includes(r.status)).length, color: "text-blue-600", bg: "bg-blue-50/50", icon: PlayCircle, dot: "bg-blue-500" },
             { label: "เรียบร้อย", count: requests.filter(r => r.status === "ดำเนินการเรียบร้อย").length, color: "text-emerald-600", bg: "bg-emerald-50/50", icon: CheckCircle2, dot: "bg-emerald-500" },
             { label: "ยกเลิก", count: requests.filter(r => r.status === "ยกเลิก").length, color: "text-rose-600", bg: "bg-rose-50/50", icon: XCircle, dot: "bg-rose-500" }
           ].map((card, idx) => (
             <div key={idx} className={`${card.bg} rounded-2xl p-4 flex flex-col justify-center border border-white shadow-sm hover:-translate-y-1 transition-all duration-300`}>
                <div className="flex justify-between items-center mb-2">
                   <div className={`text-2xl font-black ${card.color}`}>{card.count}</div>
                   <card.icon className={`w-5 h-5 ${card.color} opacity-40`} />
                </div>
                <div className="flex items-center gap-2">
                   <span className={`w-1.5 h-1.5 rounded-full ${card.dot} shadow-[0_0_5px_currentColor] animate-pulse`} />
                   <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 leading-none">{card.label}</div>
                </div>
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
        <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden min-h-[600px] flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ลำดับ / วันที่</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[40%]">หัวข้อเรื่อง</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ผู้ขอรับบริการ</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">สถานะ</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center">
                       <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4 opacity-40" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">กำลังดึงข้อมูล...</span>
                    </td>
                  </tr>
                ) : fetchError ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center">
                       <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-6 opacity-40" />
                       <div className="text-sm font-black text-rose-900 uppercase tracking-widest">{fetchError}</div>
                       <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-wider">
                          กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
                       </p>
                    </td>
                  </tr>
                ) : paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center text-slate-400 font-black uppercase text-xs tracking-widest">ไม่พบข้อมูลคำขอ</td>
                  </tr>
                ) : paginatedRequests.map((req, idx) => (
                  <tr key={req.id} className="group hover:bg-emerald-50/50 transition-all duration-300 cursor-pointer" onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">REQ#{filteredRequests.length - ((currentPage - 1) * rowsPerPage + idx)}</span>
                        <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                          <CalendarIcon className="w-4 h-4 text-emerald-600 opacity-60" />
                          {new Date(req.created_at).toLocaleDateString('th-TH')}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <h4 className="font-black text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">{req.title}</h4>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-wider rounded-md">{req.type}</span>
                             <span className={`px-2 py-0.5 ${req.urgency === 'ด่วนมาก' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'} text-[9px] font-black uppercase tracking-wider rounded-md`}>
                                {req.urgency}
                             </span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 text-[10px] uppercase">
                            {req.requester_name?.substring(0,1)}
                         </div>
                         <div className="flex flex-col">
                            <div className="font-black text-slate-800 text-sm leading-none">{req.requester_name}</div>
                            <div className="text-emerald-700 font-bold text-[10px] uppercase mt-1.5 tracking-wider opacity-70">{req.department}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-8 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                        className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90 flex items-center justify-center mx-auto border border-slate-100"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/50">
            
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-emerald-50/50 to-transparent">
               <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm border border-white">
                     <FileText className="w-5 h-5" />
                  </div>
                  รายละเอียดคำขอของคุณ
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-slate-700 shadow-sm border border-transparent hover:border-slate-200 bg-slate-50"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-0 max-h-[75vh] overflow-y-auto font-sans bg-slate-50/50">
               
               {/* Work Info Section */}
               <div className="p-6 md:p-10 space-y-8">
                  {/* Title and Status Header */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                     <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                        <div className="flex-1">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-3"><FileText className="w-3.5 h-3.5 text-emerald-500" /> หัวข้อที่แจ้ง / รายละเอียดข้อมูล</label>
                           <h4 className="text-2xl font-black text-slate-900 leading-snug">{selectedRequest.title || "-"}</h4>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">สถานะงานปัจจุบัน</div>
                           <div>{getStatusBadge(selectedRequest.status)}</div>
                        </div>
                     </div>
                  </div>

                  {/* Classification Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {[
                       { label: "ประเภทงาน", value: selectedRequest.type, icon: ClipboardList },
                       { label: "ความเร่งด่วน", value: selectedRequest.urgency, icon: Zap, color: selectedRequest.urgency === 'ด่วนมาก' ? 'text-rose-600' : 'text-slate-800' },
                       { label: "รอบข้อมูล", value: selectedRequest.frequency, icon: RefreshCw },
                       { label: "ผู้รับผิดชอบ", value: selectedRequest.assigned_to || "รอดำเนินการ", icon: UserCircle2, color: "text-emerald-600" }
                     ].map((item, i) => (
                       <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">{item.label}</label>
                          <div className={`text-sm font-black flex items-center gap-1.5 ${item.color || 'text-slate-800'}`}>
                             <item.icon className="w-3.5 h-3.5 opacity-30" />
                             {item.value || "-"}
                          </div>
                       </div>
                     ))}
                  </div>

                  {/* Dates Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="flex items-center gap-4 bg-white p-5 border border-slate-100 rounded-2xl shadow-sm">
                        <Calendar className="w-6 h-6 text-slate-300" />
                        <div>
                           <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">วันที่แจ้ง</div>
                           <div className="text-xs font-black text-slate-900">{selectedRequest.created_at ? new Date(selectedRequest.created_at).toLocaleDateString('th-TH') : "-"}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 bg-sky-50/50 p-5 border border-sky-100 rounded-2xl shadow-sm">
                        <PlayCircle className="w-6 h-6 text-sky-400" />
                        <div>
                           <div className="text-[9px] font-black text-sky-600 uppercase tracking-widest">วันที่รับงาน</div>
                           <div className="text-xs font-black text-sky-900">{selectedRequest.date_received ? new Date(selectedRequest.date_received).toLocaleDateString('th-TH') : "ยังไม่รับเรื่อง"}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 bg-emerald-50/50 p-5 border border-emerald-100 rounded-2xl shadow-sm">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        <div>
                           <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">กำหนดเสร็จ</div>
                           <div className="text-xs font-black text-emerald-900">{selectedRequest.due_date ? new Date(selectedRequest.due_date).toLocaleDateString('th-TH') : "-"}</div>
                        </div>
                     </div>
                  </div>

                  {/* Full Detail & File */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                        <Info className="w-4 h-4 text-emerald-500" /> เงื่อนไข / คำอธิบายเพิ่มเติม
                     </label>
                     <div className="text-sm text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 leading-relaxed whitespace-pre-wrap font-medium">
                        {selectedRequest.condition || "ไม่ได้ระบุรายละเอียด"}
                     </div>
                     
                     {selectedRequest.file_url && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">ไฟล์แนบประกอบ</label>
                           <a 
                             href={selectedRequest.file_url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 group"
                           >
                             <FileDown className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                             ดาวน์โหลดไฟล์แนบ
                           </a>
                        </div>
                     )}
                  </div>

                  {/* Admin Reply Area (If Needs Info) */}
                  {selectedRequest.status === "ขอข้อมูลเพิ่ม" && (
                     <div className="bg-gradient-to-br from-[#003820] to-[#0f172a] text-white rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                           <MessageSquare className="w-24 h-24 rotate-12" />
                        </div>
                        <div className="relative z-10">
                           <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                              <AlertCircle className="w-5 h-5 animate-pulse" /> ข้อความจากเจ้าหน้าที่ IT
                           </div>
                           <div className="text-lg font-bold leading-relaxed mb-8 bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                              "{selectedRequest.admin_note || "เจ้าหน้าที่ต้องการข้อมูลเพิ่มเติมครับ กรุณาตอบกลับ"}"
                           </div>
                           
                           <div className="space-y-4">
                              <label className="text-[10px] font-black text-emerald-400/70 uppercase tracking-widest block">พิมพ์ข้อมูลเพื่อตอบกลับเจ้าหน้าที่</label>
                              <textarea 
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-medium outline-none focus:bg-white/10 focus:border-white/20 transition-all min-h-[140px] text-sm placeholder:text-white/20"
                                 placeholder="ระบุรายละเอียดเพิ่มเติมที่เจ้าหน้าที่ขอที่นี่..."
                                 value={replyText}
                                 onChange={(e) => setReplyText(e.target.value)}
                              />
                              <button 
                                 disabled={!replyText.trim() || isSubmittingReply}
                                 onClick={handleSubmitReply}
                                 className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-xl hover:bg-emerald-400 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                              >
                                 {isSubmittingReply ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> ส่งข้อมูลตอบกลับ</>}
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Requester Info */}
                  <div className="bg-slate-100/50 rounded-3xl border border-slate-200 p-8">
                     <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-8">
                        <UserCircle2 className="w-5 h-5" /> ข้อมูลผู้ติดต่อพื้นฐาน
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                          { label: "ชื่อ-สกุล", value: selectedRequest.requester_name, icon: User2 },
                          { label: "หน่วยงาน", value: selectedRequest.department, icon: Building2 },
                          { label: "โทรศัพท์", value: selectedRequest.phone, icon: PhoneCall },
                          { label: "อีเมล", value: selectedRequest.email, icon: Mail }
                        ].map((info, i) => (
                          <div key={i}>
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-2">{info.label}</label>
                             <div className="text-sm font-black text-slate-700 flex items-center gap-2 truncate">
                                <info.icon className="w-3.5 h-3.5 opacity-30 shrink-0" /> 
                                {info.value || "-"}
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                  
               </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 bg-white border-t border-slate-100 flex justify-end">
               <button onClick={() => setIsModalOpen(false)} className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 shadow-xl transition-all active:scale-95">ปิดหน้าต่าง</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="mt-12 py-12 border-t border-slate-200 text-center">
         <div className="max-w-7xl mx-auto px-6 space-y-6">
            <div className="flex justify-center items-center gap-4 text-slate-300">
               <div className="h-px w-12 bg-slate-200" />
               <Image src={logo} alt="ไอคอนโลโก้ขนาดเล็ก โรงพยาบาลหนองหาน" width={24} height={24} className="opacity-20 grayscale" />
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
