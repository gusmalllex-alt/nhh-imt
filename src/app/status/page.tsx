"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Search, Calendar as CalendarIcon, RefreshCw, ChevronLeft, ChevronRight, 
  Home, Activity, CheckCircle2, Clock, AlertCircle, PlayCircle, XCircle,
  FileDown, Info, Send, X, ClipboardList, User2, Building2, PhoneCall, MailCheck
} from "lucide-react";
import { getRequests, updateRequestStatus, addUserInformation } from "../actions/adminActions";
import logo from "../../../public/nhh.png";
import Image from "next/image";

export default function StatusTracking() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Pagination & Modal State
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
    setCurrentPage(1); // Reset to first page on refresh
  };

  // 1. Sorting Logic: Newest First
  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [requests]);

  // 2. Filtering Logic
  const filteredRequests = useMemo(() => {
    return sortedRequests.filter(req => 
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requester_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedRequests, searchTerm]);

  // 3. Pagination Logic
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

  // Status Style Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ดำเนินการเรียบร้อย":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 font-bold text-xs ring-1 ring-emerald-300 shadow-sm"><CheckCircle2 className="w-3.5 h-3.5" /> เรียบร้อย</span>;
      case "รอดำเนินการ":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-700 font-bold text-xs ring-1 ring-amber-300 shadow-sm"><Clock className="w-3.5 h-3.5" /> รอดำเนินการ</span>;
      case "รับเรื่อง":
      case "กำลังดำเนินการ":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 font-bold text-xs ring-1 ring-blue-300 shadow-sm"><PlayCircle className="w-3.5 h-3.5" /> {status}</span>;
      case "ขอข้อมูลเพิ่ม":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-purple-700 font-bold text-xs ring-1 ring-purple-300 shadow-sm"><AlertCircle className="w-3.5 h-3.5" /> ขอข้อมูลเพิ่ม</span>;
      case "ยกเลิก":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-700 font-bold text-xs ring-1 ring-rose-300 shadow-sm"><XCircle className="w-3.5 h-3.5" /> ยกเลิก</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100/80 text-gray-700 font-bold text-xs ring-1 ring-gray-300 shadow-sm">{status}</span>;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    if (urgency === "ด่วนมาก") return "text-rose-600 font-extrabold";
    if (urgency === "ด่วน") return "text-orange-600 font-bold";
    return "text-emerald-600 font-semibold";
  };

  // Handle Reply Submission
  const handleSubmitReply = async () => {
    if (!replyText.trim() || !selectedRequest) return;
    
    setIsSubmittingReply(true);
    const result = await addUserInformation(selectedRequest.id, replyText);

    if (result.success) {
      alert("ส่งข้อมูลเพิ่มเติมเรียบร้อยแล้ว สถานะจะเปลี่ยนเป็น 'รอดำเนินการ' อีกครั้งครับ");
      setIsModalOpen(false);
      setReplyText("");
      handleRefresh();
    } else {
      alert("เกิดข้อผิดพลาด: " + result.message);
    }
    setIsSubmittingReply(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 selection:bg-emerald-200 pb-12">
      {/* MOPH Green Header Background */}
      <div className="absolute top-0 w-full h-[320px] bg-gradient-to-b from-[#003820] to-[#014d2a] z-0 shadow-lg">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center p-2 border-2 border-emerald-500/20">
                <Image src={logo} alt="Logo" width={50} height={50} className="object-contain" />
             </div>
             <div>
                <Link href="/" className="inline-flex items-center gap-2 text-emerald-100 hover:text-white transition-colors mb-1 text-sm font-bold">
                  <Home className="w-4 h-4" /> กลับสู่หน้าหลัก
                </Link>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  ติดตามสถานะคำขอ <span className="text-emerald-500/50">|</span> <span className="text-emerald-300 text-lg">IMT Hub</span>
                </h1>
             </div>
          </div>
          
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white font-black transition-all shadow-lg ring-1 ring-white/30 active:scale-95 group"
          >
            <RefreshCw className={`w-5 h-5 group-hover:rotate-180 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            รีเฟรชข้อมูล
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {[
            { label: "คำขอทั้งหมด", count: requests.length, color: "border-slate-800 bg-white", text: "text-slate-900" },
            { label: "รอดำเนินการ", count: requests.filter(r => r.status === "รอดำเนินการ").length, color: "border-amber-500 bg-amber-50", text: "text-amber-700" },
            { label: "ขอข้อมูลเพิ่ม", count: requests.filter(r => r.status === "ขอข้อมูลเพิ่ม").length, color: "border-purple-600 bg-purple-50", text: "text-purple-800" },
            { label: "รับเรื่องแล้ว", count: requests.filter(r => ["รับเรื่อง", "กำลังดำเนินการ"].includes(r.status)).length, color: "border-blue-600 bg-blue-50", text: "text-blue-800" },
            { label: "เรียบร้อย", count: requests.filter(r => r.status === "ดำเนินการเรียบร้อย").length, color: "border-emerald-600 bg-emerald-50", text: "text-emerald-700" },
            { label: "ยกเลิก", count: requests.filter(r => r.status === "ยกเลิก").length, color: "border-rose-600 bg-rose-50", text: "text-rose-700" }
          ].map((card, idx) => (
            <div key={idx} className={`rounded-3xl border-b-4 p-5 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-center ${card.color}`}>
              <div className={`text-4xl font-black mb-1 ${card.text}`}>{card.count}</div>
              <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Box */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative min-h-[600px] flex flex-col">
          
          {/* Filters Area */}
          <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/30">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-emerald-600" />
              </div>
              <input
                type="text"
                className="w-full pl-16 pr-8 py-5 rounded-[2rem] border-2 border-gray-100 bg-white shadow-inner focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold text-lg"
                placeholder="ค้นหาตามชื่อเรื่อง, ผู้แจ้ง, หรือหน่วยงาน..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead className="bg-[#f0f9f6]/80 text-[#004d40]">
                  <tr>
                    <th scope="col" className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest">ลำดับ & วันที่</th>
                    <th scope="col" className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest">ประเภท</th>
                    <th scope="col" className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest">ความเร่งด่วน</th>
                    <th scope="col" className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest w-[30%]">ชื่อข้อมูล / เงื่อนไข</th>
                    <th scope="col" className="px-6 py-5 text-left text-xs font-black uppercase tracking-widest">ผู้ขอ / หน่วยงาน</th>
                    <th scope="col" className="px-6 py-5 text-center text-xs font-black uppercase tracking-widest">สถานะ</th>
                    <th scope="col" className="px-6 py-5 text-center text-xs font-black uppercase tracking-widest">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-32 text-center">
                        <div className="flex flex-col items-center gap-4">
                           <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin" />
                           <span className="text-xl font-black text-emerald-900">กำลังโหลดข้อมูล...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-32 text-center text-gray-400">
                         <div className="text-2xl font-black italic">ไม่พบข้อมูล</div>
                      </td>
                    </tr>
                  ) : paginatedRequests.map((req, idx) => (
                    <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-xs font-bold text-gray-400 mb-1">#{filteredRequests.length - ((currentPage - 1) * rowsPerPage + idx)}</div>
                        <div className="flex items-center gap-2 font-black text-gray-700">
                          <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
                          {new Date(req.created_at).toLocaleDateString('th-TH')}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                         <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-600">
                           {req.type || "-"}
                         </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className={`flex items-center gap-1.5 ${getUrgencyColor(req.urgency)}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${req.urgency === 'ด่วนมาก' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          {req.urgency}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-black text-gray-900 mb-1 line-clamp-1">{req.title}</div>
                        <div className="text-xs text-gray-400 line-clamp-1 italic font-medium">{req.condition}</div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="font-black text-gray-800 text-sm">{req.requester_name}</div>
                        <div className="text-emerald-600 font-black text-[10px] uppercase mt-0.5 tracking-tighter">{req.department}</div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                           <button 
                             onClick={() => { setSelectedRequest(req); setIsModalOpen(true); }}
                             className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors shadow-sm ring-1 ring-emerald-200"
                             title="ดูรายละเอียดทั้งหมด"
                           >
                              <Info className="w-5 h-5" />
                           </button>
                           {req.file_url && (
                             <a 
                               href={req.file_url} 
                               target="_blank"
                               className="p-2.5 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors shadow-sm ring-1 ring-slate-200"
                             >
                                <FileDown className="w-5 h-5" />
                             </a>
                           )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="text-sm font-bold text-gray-500">
                แสดงหน้าที่ <span className="text-[#004d40]">{currentPage}</span> จากทั้งหมด <span className="text-[#004d40]">{totalPages || 1}</span> หน้า
             </div>
             
             <div className="flex gap-2">
                <button 
                   disabled={currentPage === 1 || loading}
                   onClick={() => handlePageChange(currentPage - 1)}
                   className="flex items-center gap-1 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-black text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                   <ChevronLeft className="w-4 h-4" /> ย้อนกลับ
                </button>
                <button 
                   disabled={currentPage === totalPages || totalPages === 0 || loading}
                   onClick={() => handlePageChange(currentPage + 1)}
                   className="flex items-center gap-1 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-black text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                   ถัดไป <ChevronRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* --- Detail Modal --- */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header Content */}
            <div className="bg-emerald-950 px-8 py-10 text-white relative">
               <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                 <X className="w-6 h-6" />
               </button>
               <h2 className="text-3xl font-black mb-2">{selectedRequest.title}</h2>
               <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs tracking-widest">
                  {selectedRequest.type} • แจ้งเมื่อ {new Date(selectedRequest.created_at).toLocaleString('th-TH')}
               </div>
            </div>

            {/* Body */}
            <div className="p-8 md:p-12 max-h-[60vh] overflow-y-auto bg-slate-50/50">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <div>
                        <h3 className="font-black text-emerald-800 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                           <ClipboardList className="w-4 h-4" /> รายละเอียดข้อมูล
                        </h3>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 space-y-4">
                           <div>
                              <div className="text-[10px] font-black text-gray-400 uppercase mb-1">เงื่อนไข / สูตรคำนวณ</div>
                              <div className="font-bold text-gray-800 leading-relaxed">{selectedRequest.condition}</div>
                           </div>
                           <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                              <div>
                                 <div className="text-[10px] font-black text-gray-400 uppercase mb-1">ความถี่</div>
                                 <div className="font-black text-emerald-700 uppercase italic">{selectedRequest.frequency}</div>
                              </div>
                              {selectedRequest.file_url && (
                                <a href={selectedRequest.file_url} target="_blank" className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg">
                                   <FileDown className="w-4 h-4" /> ดาวน์โหลดไฟล์
                                </a>
                              )}
                           </div>
                        </div>
                     </div>

                     {selectedRequest.admin_note && (
                        <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl">
                           <h3 className="font-black text-amber-800 mb-2 uppercase tracking-widest text-xs">บันทึกจากเจ้าหน้าที่</h3>
                           <div className="text-amber-900 font-bold italic whitespace-pre-wrap">{selectedRequest.admin_note}</div>
                        </div>
                     )}
                  </div>

                  <div className="space-y-6">
                     <div>
                        <h3 className="font-black text-emerald-800 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                           <User2 className="w-4 h-4" /> ข้อมูลผู้ติดต่อ
                        </h3>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 space-y-4 font-bold text-gray-800">
                           <div className="flex items-center gap-3">
                              <User2 className="w-5 h-5 text-emerald-500" /> {selectedRequest.requester_name}
                           </div>
                           <div className="flex items-center gap-3">
                              <Building2 className="w-5 h-5 text-emerald-500" /> {selectedRequest.department}
                           </div>
                           <div className="flex items-center gap-3">
                              <PhoneCall className="w-5 h-5 text-emerald-500" /> {selectedRequest.phone}
                           </div>
                           <div className="flex items-center gap-3">
                              <MailCheck className="w-5 h-5 text-emerald-500" /> {selectedRequest.email}
                           </div>
                        </div>
                     </div>

                     {/* Reply UI */}
                     {selectedRequest.status === "ขอข้อมูลเพิ่ม" && (
                        <div className="bg-purple-900 p-8 rounded-[2.5rem] shadow-xl">
                           <h3 className="font-black text-white text-lg mb-4 flex items-center gap-2">
                             <Send className="w-5 h-5" /> ตอบกลับข้อมูล
                           </h3>
                           <textarea 
                             className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white font-bold outline-none focus:bg-white/20 transition-all min-h-[100px]"
                             placeholder="พิมพ์รายละเอียดที่นี่..."
                             value={replyText}
                             onChange={(e) => setReplyText(e.target.value)}
                           />
                           <button 
                             disabled={!replyText.trim() || isSubmittingReply}
                             onClick={handleSubmitReply}
                             className="w-full mt-4 py-3 bg-white text-purple-900 rounded-xl font-black hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                           >
                              {isSubmittingReply ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> ยืนยันคำตอบ</>}
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex justify-end">
               <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black">ปิด</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

