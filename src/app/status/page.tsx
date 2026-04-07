"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Search, Calendar as CalendarIcon, RefreshCw, ChevronLeft, ChevronRight, 
  Home, Activity, CheckCircle2, Clock, AlertCircle, PlayCircle, XCircle,
  FileDown, Info, Send, X, ClipboardList, User2, Building2, PhoneCall, Mail,
  MessageSquare, UserCircle2, Calendar, FileText
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
    switch (status) {
      case "ดำเนินการเรียบร้อย":
        return <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px] ring-1 ring-emerald-400/30 uppercase tracking-widest shadow-sm"><CheckCircle2 className="w-3.5 h-3.5" /> เรียบร้อย</span>;
      case "รอดำเนินการ":
        return <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 font-black text-[10px] ring-1 ring-amber-400/30 uppercase tracking-widest shadow-sm"><Clock className="w-3.5 h-3.5" /> รอคิว</span>;
      case "รับเรื่อง":
      case "กำลังดำเนินการ":
        return <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-black text-[10px] ring-1 ring-blue-400/30 uppercase tracking-widest shadow-sm"><PlayCircle className="w-3.5 h-3.5" /> {status}</span>;
      case "ขอข้อมูลเพิ่ม":
        return <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-50 text-purple-700 font-black text-[10px] ring-1 ring-purple-400/30 uppercase tracking-widest shadow-sm animate-pulse"><AlertCircle className="w-3.5 h-3.5" /> ขอข้อมูลเพิ่ม</span>;
      case "ยกเลิก":
        return <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 text-rose-700 font-black text-[10px] ring-1 ring-rose-400/30 uppercase tracking-widest shadow-sm"><XCircle className="w-3.5 h-3.5" /> ยกเลิก</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-50 text-slate-400 font-black text-[10px] ring-1 ring-slate-200 uppercase tracking-widest shadow-sm">{status}</span>;
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !selectedRequest) return;
    setIsSubmittingReply(true);
    const result = await addUserInformation(selectedRequest.id, replyText);
    if (result.success) {
      setIsModalOpen(false);
      setReplyText("");
      handleRefresh();
    } else {
      alert("เกิดข้อผิดพลาด: " + result.message);
    }
    setIsSubmittingReply(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-20 overflow-x-hidden">
      
      {/* Premium Gradient Background */}
      <div className="fixed top-0 left-0 w-full h-[450px] bg-gradient-to-br from-[#003d24] via-[#014d2a] to-[#015e34] z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[15deg] blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center p-3 border-4 border-emerald-500/10">
                <Image src={logo} alt="Logo" width={60} height={60} className="object-contain" />
             </div>
             <div>
                <Link href="/" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white transition-all mb-1 text-xs font-black uppercase tracking-widest">
                  <Home className="w-3.5 h-3.5" /> กลับหน้าหลัก
                </Link>
                <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                  ระบบติดตามสถานะคำขอ <span className="w-1 h-8 bg-emerald-500/50 rounded-full hidden sm:block" /> <span className="text-emerald-400 text-lg sm:text-2xl opacity-80 uppercase font-black">Tracking Center</span>
                </h1>
             </div>
          </div>
          
          <button 
            onClick={handleRefresh}
            className="group px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-[2rem] text-white font-black transition-all shadow-2xl ring-1 ring-white/30 active:scale-95 flex items-center gap-3"
          >
            <RefreshCw className={`w-5 h-5 group-hover:rotate-180 transition-transform duration-700 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="uppercase tracking-widest text-xs">รีเฟรชข้อมูลล่าสุด</span>
          </button>
        </div>

        {/* Stats Summary Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-12">
          {[
            { label: "ทั้งหมด", count: requests.length, color: "text-slate-900", bg: "bg-white", icon: FileText },
            { label: "รอดำเนินการ", count: requests.filter(r => r.status === "รอดำเนินการ").length, color: "text-amber-700", bg: "bg-amber-50", icon: Clock },
            { label: "ขอข้อมูลเพิ่ม", count: requests.filter(r => r.status === "ขอข้อมูลเพิ่ม").length, color: "text-purple-700", bg: "bg-purple-50", icon: AlertCircle },
            { label: "รับเรื่องแล้ว", count: requests.filter(r => ["รับเรื่อง", "กำลังดำเนินการ"].includes(r.status)).length, color: "text-blue-700", bg: "bg-blue-50", icon: PlayCircle },
            { label: "เสร็จเรียบร้อย", count: requests.filter(r => r.status === "ดำเนินการเรียบร้อย").length, color: "text-emerald-700", bg: "bg-emerald-50", icon: CheckCircle2 },
            { label: "ยกเลิก", count: requests.filter(r => r.status === "ยกเลิก").length, color: "text-rose-700", bg: "bg-rose-50", icon: XCircle }
          ].map((card, idx) => (
            <div key={idx} className={`${card.bg} rounded-[2rem] p-6 shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/50 group`}>
               <div className="flex justify-between items-start mb-2">
                  <div className={`text-3xl font-black ${card.color}`}>{card.count}</div>
                  <card.icon className={`w-5 h-5 ${card.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
               </div>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-emerald-950/20 border border-slate-100 overflow-hidden relative min-h-[700px] flex flex-col focus-within:shadow-emerald-900/40 transition-shadow duration-700">
          
          {/* Search Box Decor */}
          <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
          
          {/* Professional Search Area */}
          <div className="p-8 lg:p-12 border-b border-slate-50 bg-slate-50/30">
            <div className="relative max-w-3xl mx-auto group">
              <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                <Search className="h-6 w-6 text-emerald-600" />
              </div>
              <input
                type="text"
                className="w-full pl-20 pr-10 py-6 rounded-[2.5rem] border-2 border-slate-100 bg-white shadow-2xl shadow-emerald-900/5 focus:ring-[12px] focus:ring-emerald-500/5 focus:border-emerald-500 transition-all outline-none font-black text-lg placeholder:text-slate-300 text-slate-900"
                placeholder="ค้นหาชื่อเรื่อง, ชื่อของคุณ หรือหน่วยงาน..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-slate-50/80 text-slate-400">
                <tr>
                  <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest border-b border-slate-100">วันที่ / ลำดับ</th>
                  <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest border-b border-slate-100 w-[35%]">หัวข้อข้อมูล</th>
                  <th className="px-10 py-6 text-[11px] font-black uppercase tracking-widest border-b border-slate-100">ผู้ขอรับบริการ</th>
                  <th className="px-10 py-6 text-center text-[11px] font-black uppercase tracking-widest border-b border-slate-100">สถานะงาน</th>
                  <th className="px-10 py-6 text-center text-[11px] font-black uppercase tracking-widest border-b border-slate-100">ดูข้อมูล</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-40 text-center">
                      <div className="flex flex-col items-center gap-6">
                         <div className="relative">
                            <RefreshCw className="w-16 h-16 text-emerald-500 animate-spin opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                            </div>
                         </div>
                         <span className="text-xl font-black text-emerald-900 uppercase tracking-widest">Refreshing Data...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-40 text-center">
                       <div className="flex flex-col items-center gap-4 text-slate-300">
                          <Search className="w-20 h-20 opacity-5" />
                          <p className="text-2xl font-black italic tracking-widest uppercase">No Results Found</p>
                       </div>
                    </td>
                  </tr>
                ) : paginatedRequests.map((req, idx) => (
                  <tr key={req.id} className="group hover:bg-emerald-50/30 transition-all duration-300 cursor-pointer" onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">#{filteredRequests.length - ((currentPage - 1) * rowsPerPage + idx)}</span>
                        <div className="flex items-center gap-2 font-black text-slate-800 text-sm">
                          <CalendarIcon className="w-4 h-4 text-emerald-500" />
                          {new Date(req.created_at).toLocaleDateString('th-TH')}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex flex-col gap-1">
                          <h4 className="font-black text-slate-900 text-[15px] group-hover:text-emerald-700 transition-colors">{req.title}</h4>
                          <span className={`${req.urgency === 'ด่วนมาก' ? 'text-rose-500' : 'text-slate-400'} text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5`}>
                             <div className={`w-1.5 h-1.5 rounded-full ${req.urgency === 'ด่วนมาก' ? 'bg-rose-500 animate-ping' : 'bg-slate-300'}`} />
                             {req.type} • {req.urgency}
                          </span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-800 text-[13px]">{req.requester_name}</div>
                      <div className="text-emerald-600 font-black text-[10px] uppercase mt-1 tracking-widest leading-none">{req.department}</div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-10 py-8 text-center" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                        className="p-3.5 bg-slate-100 text-slate-700 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm group/btn relative overflow-hidden active:scale-95"
                      >
                         <Info className="w-5 h-5 relative z-10" />
                         <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Area */}
          <div className="px-12 py-8 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Viewing Page <span className="text-emerald-600 px-2 py-1 bg-white rounded-lg shadow-sm border border-slate-100 mx-1">{currentPage}</span> of <span className="text-slate-600">{totalPages || 1}</span>
             </div>
             
             <div className="flex gap-3">
                <button 
                   disabled={currentPage === 1 || loading}
                   onClick={() => handlePageChange(currentPage - 1)}
                   className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
                >
                   <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button 
                   disabled={currentPage === totalPages || totalPages === 0 || loading}
                   onClick={() => handlePageChange(currentPage + 1)}
                   className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
                >
                   Next <ChevronRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* --- Detail & Reply Modal (Image 2 style) --- */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
            
            {/* Modal Header */}
            <div className="px-12 pt-14 pb-10 bg-white flex justify-between items-start">
               <div className="flex items-center gap-4 text-slate-400 font-black text-[12px] uppercase tracking-[0.2em]">
                  <span>สถานะงาน:</span>
               </div>
               <div className="flex items-center gap-4">
                  {getStatusBadge(selectedRequest.status)}
                  <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                     <X className="w-6 h-6 text-slate-400" />
                  </button>
               </div>
            </div>

            {/* Modal Body Scroll */}
            <div className="px-12 pb-14 space-y-8 max-h-[75vh] overflow-y-auto">
               
               {/* Section 1: Data Info */}
               <div className="bg-slate-50/50 rounded-[3rem] p-10 border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                     <FileText className="w-40 h-40" />
                  </div>
                  <h4 className="flex items-center gap-3 text-emerald-800 font-black text-lg mb-8">
                     <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5" /></div>
                     ข้อมูลคำขอ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 font-bold text-slate-700">
                     <div className="md:col-span-2 space-y-1">
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">เรื่องที่ขอรับบริการ</div>
                        <div className="text-xl font-black text-slate-900 leading-tight">{selectedRequest.title}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ประเภท</div>
                        <div>{selectedRequest.type}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ความเร่งด่วน</div>
                        <div className={selectedRequest.urgency === 'ด่วนมาก' ? 'text-rose-600' : ''}>{selectedRequest.urgency}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">วันที่แจ้ง</div>
                        <div>{new Date(selectedRequest.created_at).toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' })}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">รอบการใช้</div>
                        <div>{selectedRequest.frequency || "ครั้งเดียว"}</div>
                     </div>
                     <div className="md:col-span-2 space-y-1">
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">รายละเอียด/เงื่อนไข</div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-slate-600 font-medium italic whitespace-pre-wrap">
                           {selectedRequest.condition || "ไม่ได้ระบุรายละเอียดเพิ่มเติม"}
                        </div>
                     </div>
                     {selectedRequest.file_url && (
                        <div className="md:col-span-2">
                           <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">ไฟล์แนบ</div>
                           <a href={selectedRequest.file_url} target="_blank" className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                              <FileDown className="w-4 h-4" /> เปิดดูไฟล์ที่นี่
                           </a>
                        </div>
                     )}
                  </div>
               </div>

               {/* Section 2: Contact Info */}
               <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                  <h4 className="flex items-center gap-3 text-emerald-800 font-black text-lg mb-8">
                     <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><UserCircle2 className="w-5 h-5" /></div>
                     ผู้ติดต่อ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-bold text-slate-700">
                     <div className="flex gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100"><User2 className="w-5 h-5" /></div>
                        <div>
                           <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">ชื่อ-สกุล</div>
                           <div className="text-slate-900 font-black">{selectedRequest.requester_name}</div>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100"><Building2 className="w-5 h-5" /></div>
                        <div>
                           <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">หน่วยงาน</div>
                           <div className="text-slate-900 font-black">{selectedRequest.department}</div>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100"><PhoneCall className="w-5 h-5" /></div>
                        <div>
                           <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">เบอร์โทร</div>
                           <div className="text-slate-900 font-black">{selectedRequest.phone}</div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Section 3: Operations Info */}
               <div className="bg-blue-50/30 rounded-[3rem] p-10 border border-blue-100 flex flex-wrap gap-12 items-center">
                  <div className="flex items-center gap-3 text-blue-900 font-black text-lg">
                     <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Activity className="w-5 h-5" /></div>
                     การดำเนินงาน
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-700 font-bold">
                     <div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ผู้รับเรื่อง</div>
                        <div className="text-blue-600 font-black">{selectedRequest.assigned_to || "- ยังไม่ระบุ -"}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">วันที่รับเรื่อง</div>
                        <div>{selectedRequest.date_received ? new Date(selectedRequest.date_received).toLocaleDateString('th-TH') : "-"}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">กำหนดเสร็จ</div>
                        <div>{selectedRequest.due_date ? new Date(selectedRequest.due_date).toLocaleDateString('th-TH') : "-"}</div>
                     </div>
                  </div>
               </div>

               {/* Section 4: Reply Area */}
               {selectedRequest.status === "ขอข้อมูลเพิ่ม" && (
                  <div className="bg-purple-900 rounded-[3rem] p-10 border border-purple-500 shadow-2xl shadow-purple-900/30 text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                        <MessageSquare className="w-32 h-32" />
                     </div>
                     <h3 className="font-black text-purple-200 mb-6 uppercase tracking-[0.3em] text-[11px] flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 animate-bounce" /> บันทึกจากเจ้าหน้าที่
                     </h3>
                     <div className="text-xl font-black leading-relaxed mb-10 whitespace-pre-wrap">
                        {selectedRequest.admin_note || "เจ้าหน้าที่ต้องการข้อมูลเพิ่มเติมเพื่อดำเนินการต่อครับ"}
                     </div>
                     
                     <div className="space-y-4">
                        <textarea 
                           className="w-full bg-white/10 border border-white/20 rounded-[2rem] p-8 text-white font-bold outline-none focus:bg-white/20 focus:ring-[12px] focus:ring-white/5 transition-all min-h-[160px] text-lg lg:text-xl shadow-inner placeholder:text-white/30"
                           placeholder="พิมพ์ข้อความตอบกลับที่นี่..."
                           value={replyText}
                           onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button 
                           disabled={!replyText.trim() || isSubmittingReply}
                           onClick={handleSubmitReply}
                           className="w-full py-5 bg-white text-purple-900 rounded-[1.5rem] font-black text-lg shadow-2xl shadow-white/10 hover:bg-purple-50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                           {isSubmittingReply ? <RefreshCw className="w-6 h-6 animate-spin" /> : <><Send className="w-6 h-6" /> ส่งข้อมูลตอบกลับ</>}
                        </button>
                     </div>
                  </div>
               )}

            </div>

            {/* Modal Bottom Bar */}
            <div className="p-10 bg-white border-t border-slate-50 flex justify-end">
               <button onClick={() => setIsModalOpen(false)} className="px-12 py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95">Close Window</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
