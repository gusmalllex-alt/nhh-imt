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
      <div className="bg-[#003d24] text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 shadow-xl">
                    <Image src={logo} alt="โลโก้โรงพยาบาลหนองหาน - ระบบติดตามสถานะคำขอสารสนเทศ" width={64} height={64} className="object-contain" priority />
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
        <div className="bg-white/90 backdrop-blur-3xl rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden min-h-[600px] flex flex-col overflow-x-hidden">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gradient-to-r from-slate-50/80 to-transparent border-b border-slate-200 shadow-sm">
                <tr>
                  <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-500 rounded-tl-[2rem]">ลำดับ / วันที่</th>
                  <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-500 w-[40%]">เรื่องข้อมูลที่ขอ</th>
                  <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-500">ผู้ขอรับบริการ</th>
                  <th className="px-6 py-5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">สถานะงาน</th>
                  <th className="px-6 py-5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 rounded-tr-[2rem]">ดูข้อมูล</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-32 text-center">
                       <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
                       <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Refreshing...</span>
                    </td>
                  </tr>
                ) : fetchError ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-32 text-center">
                       <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
                       <div className="text-sm font-bold text-rose-800 uppercase tracking-widest">{fetchError}</div>
                       <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tight">
                          ตรวจสอบการเชื่อมต่อ Supabase หรือ GitHub Secrets
                       </p>
                    </td>
                  </tr>
                ) : paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-32 text-center text-slate-400 font-bold">ไม่พบข้อมูลผลการค้นหา</td>
                  </tr>
                ) : paginatedRequests.map((req, idx) => (
                  <tr key={req.id} className="group hover:bg-emerald-50/40 transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-[1.002] bg-white relative z-0 hover:z-10" onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}>
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

            <div className="p-0 max-h-[75vh] overflow-y-auto font-sans bg-slate-50">
               
               {/* Work Info Section */}
               <div className="p-6 md:p-8 space-y-8">
                  {/* Title and Status Header */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                     <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="flex-1">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><FileText className="w-3 h-3" /> หัวข้อที่แจ้ง / รายละเอียดข้อมูลที่ขอ</label>
                           <h4 className="text-xl font-black text-slate-900 leading-snug mt-2">{selectedRequest.title || "-"}</h4>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">สถานะงานปัจจุบัน</div>
                           <div>{getStatusBadge(selectedRequest.status)}</div>
                        </div>
                     </div>
                  </div>

                  {/* Classification Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ประเภทงาน</label>
                        <div className="text-sm font-bold text-slate-800">{selectedRequest.type || "-"}</div>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ความเร่งด่วน</label>
                        <div className={`text-sm font-bold ${selectedRequest.urgency === 'ด่วนมาก' ? 'text-rose-600' : 'text-slate-800'}`}>{selectedRequest.urgency || "-"}</div>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ความถี่ที่ใช้งาน</label>
                        <div className="text-sm font-bold text-slate-800">{selectedRequest.frequency || "-"}</div>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ผู้รับผิดชอบงาน</label>
                        <div className="text-sm font-bold text-emerald-600">{selectedRequest.assigned_to || "รอดำเนินการ"}</div>
                     </div>
                  </div>

                  {/* Dates Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="flex items-center gap-3 bg-white px-4 py-3 border border-slate-200 rounded-xl">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase">วันที่ส่งคำขอ</div>
                           <div className="text-xs font-bold text-slate-800">{selectedRequest.created_at ? new Date(selectedRequest.created_at).toLocaleDateString('th-TH') : "-"}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 bg-sky-50 px-4 py-3 border border-sky-100 rounded-xl">
                        <PlayCircle className="w-5 h-5 text-sky-500" />
                        <div>
                           <div className="text-[10px] font-bold text-sky-600 uppercase">วันที่รับเรื่อง</div>
                           <div className="text-xs font-bold text-sky-900">{selectedRequest.date_received ? new Date(selectedRequest.date_received).toLocaleDateString('th-TH') : "ยังไม่รับเรื่อง"}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 bg-emerald-50 px-4 py-3 border border-emerald-100 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <div>
                           <div className="text-[10px] font-bold text-emerald-600 uppercase">กำหนดเสร็จ / ทำเสร็จ</div>
                           <div className="text-xs font-bold text-emerald-900">{selectedRequest.due_date ? new Date(selectedRequest.due_date).toLocaleDateString('th-TH') : "-"}</div>
                        </div>
                     </div>
                  </div>

                  {/* Full Detail & File */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <ClipboardList className="w-4 h-4" /> เงื่อนไข / คำอธิบายเพิ่มเติม
                     </label>
                     <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap font-medium">
                        {selectedRequest.condition || "ไม่ได้ระบุรายละเอียด"}
                     </div>
                     
                     {selectedRequest.file_url && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">ไฟล์แนบประกอบ</label>
                           <a 
                             href={selectedRequest.file_url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-all shadow-sm group"
                           >
                             <FileDown className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                             คลิกเพื่อดาวน์โหลด / เปิดดูไฟล์แนบ
                           </a>
                        </div>
                     )}
                  </div>

                  {/* Admin Reply Area (If Needs Info) */}
                  {selectedRequest.status === "ขอข้อมูลเพิ่ม" && (
                     <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-purple-700/50">
                        <div className="flex items-center gap-2 text-purple-200 font-bold text-xs uppercase tracking-widest mb-4">
                           <AlertCircle className="w-5 h-5 animate-pulse text-purple-300" /> หมายเหตุจากเจ้าหน้าที่ฝ่าย IT
                        </div>
                        <div className="text-lg font-bold leading-relaxed mb-8 bg-black/20 p-5 rounded-xl border border-white/10">
                           "{selectedRequest.admin_note || "เจ้าหน้าที่ต้องการข้อมูลเพิ่มเติมครับ กรุณาตอบกลับ"}"
                        </div>
                        
                        <div className="space-y-4">
                           <label className="text-[11px] font-bold text-purple-200 uppercase tracking-wider block">พิมพ์ข้อมูลเพื่อตอบกลับเจ้าหน้าที่</label>
                           <textarea 
                              className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white font-medium outline-none focus:bg-white/20 focus:border-white/40 transition-all min-h-[140px] text-sm placeholder:text-white/30"
                              placeholder="ระบุข้อมูลที่ต้องการให้เพิ่มเติมที่นี่..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                           />
                           <button 
                              disabled={!replyText.trim() || isSubmittingReply}
                              onClick={handleSubmitReply}
                              className="w-full py-4 bg-white text-indigo-900 rounded-xl font-black shadow-lg hover:bg-purple-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                           >
                              {isSubmittingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> ส่งข้อความตอบกลับไปยัง IT</>}
                           </button>
                        </div>
                     </div>
                  )}

                  {/* Requester Info */}
                  <div className="bg-emerald-900/5 rounded-2xl border border-emerald-900/10 p-6 md:p-8">
                     <div className="flex items-center gap-2 text-emerald-800 font-black text-sm uppercase tracking-widest mb-6">
                        <UserCircle2 className="w-5 h-5" /> ข้อมูลผู้ติดต่อ
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">ชื่อ-สกุล</label>
                           <div className="text-sm font-bold text-slate-900 flex items-center gap-2"><User2 className="w-4 h-4 text-slate-400" /> {selectedRequest.requester_name || "-"}</div>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">หน่วยงาน / แผนก</label>
                           <div className="text-sm font-bold text-slate-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> {selectedRequest.department || "-"}</div>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">เบอร์โทรศัพท์</label>
                           <div className="text-sm font-bold text-slate-900 flex items-center gap-2"><PhoneCall className="w-4 h-4 text-slate-400" /> {selectedRequest.phone || "-"}</div>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">อีเมล</label>
                           <div className="text-sm font-bold text-slate-900 flex items-center gap-2 truncate"><Mail className="w-4 h-4 text-slate-400" /> {selectedRequest.email || "-"}</div>
                        </div>
                     </div>
                  </div>
                  
               </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 bg-white border-t border-slate-200 flex justify-end shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] relative z-10">
               <button onClick={() => setIsModalOpen(false)} className="px-10 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 shadow-md transition-all active:scale-95">ปิดหน้าต่าง</button>
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
