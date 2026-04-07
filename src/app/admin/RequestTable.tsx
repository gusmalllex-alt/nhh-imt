"use client";

import { useState } from "react";
import { 
  CheckCircle2, Clock, AlertCircle, PlayCircle, XCircle, Search, 
  Download, User, FileText, Loader2, Calendar, Pencil, X, Send, 
  Activity, ListTodo, Building2, PhoneCall, Mail, Info, MoreHorizontal,
  ClipboardList, UserCircle2, Settings2, ChevronDown
} from "lucide-react";
import { updateRequestStatus } from "../actions/adminActions";

export default function RequestTable({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Modals State
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [editFormData, setEditFormData] = useState({
    status: "",
    assigned_to: "",
    admin_note: "",
    dateReceived: "",
    dateCompleted: ""
  });

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requester_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ทั้งหมด" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openDetailModal = (req: any) => {
    setSelectedReq(req);
    setIsDetailModalOpen(true);
  };

  const openEditModalFromDetail = () => {
    if (!selectedReq) return;
    setEditFormData({
      status: selectedReq.status || "รอดำเนินการ",
      assigned_to: selectedReq.assigned_to || "",
      admin_note: selectedReq.admin_note || "",
      dateReceived: selectedReq.date_received ? selectedReq.date_received.split('T')[0] : "",
      dateCompleted: selectedReq.due_date ? selectedReq.due_date.split('T')[0] : ""
    });
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedReq) return;
    setUpdatingId(selectedReq.id);
    
    try {
      const result = await updateRequestStatus(selectedReq.id, editFormData);
      if (result.success) {
        setRequests(prev => prev.map(r => r.id === selectedReq.id ? { 
          ...r, 
          status: editFormData.status,
          assigned_to: editFormData.assigned_to,
          admin_note: editFormData.admin_note,
          date_received: editFormData.dateReceived,
          due_date: editFormData.dateCompleted
        } : r));
        setIsEditModalOpen(false);
        // Refresh selected req for detail view if reopened
        setSelectedReq({...selectedReq, ...editFormData, date_received: editFormData.dateReceived, due_date: editFormData.dateCompleted});
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      alert("Failed to update");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ดำเนินการเรียบร้อย":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px] ring-1 ring-emerald-400/30 shadow-sm uppercase tracking-widest"><CheckCircle2 className="w-3 h-3" /> เรียบร้อย</span>;
      case "รอดำเนินการ":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-black text-[10px] ring-1 ring-amber-400/30 shadow-sm uppercase tracking-widest"><Clock className="w-3 h-3" /> รอคิว</span>;
      case "รับเรื่อง":
      case "กำลังดำเนินการ":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-black text-[10px] ring-1 ring-blue-400/30 shadow-sm uppercase tracking-widest"><PlayCircle className="w-3 h-3" /> {status}</span>;
      case "ขอข้อมูลเพิ่ม":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-black text-[10px] ring-1 ring-purple-400/30 shadow-sm uppercase tracking-widest animate-pulse"><AlertCircle className="w-3 h-3" /> ขอข้อมูลเพิ่ม</span>;
      case "ยกเลิก":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-black text-[10px] ring-1 ring-rose-400/30 shadow-sm uppercase tracking-widest"><XCircle className="w-3 h-3" /> ยกเลิก</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-400 font-black text-[10px] ring-1 ring-gray-200 uppercase tracking-widest shadow-sm">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50">
        <div className="relative flex-1 w-full max-w-lg group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-transform group-focus-within:scale-110" />
           <input 
             type="text" 
             placeholder="ค้นหาชื่อเรื่อง, ผู้ขอ, แผนก..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-16 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-[15px] font-black focus:ring-[12px] focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-inner"
           />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto px-2">
          {["ทั้งหมด", "รอดำเนินการ", "รับเรื่อง", "ขอข้อมูลเพิ่ม", "ดำเนินการเรียบร้อย"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-5 py-3 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all uppercase tracking-widest ${
                statusFilter === status 
                  ? "bg-slate-900 text-white shadow-xl scale-105" 
                  : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[600px] flex flex-col">
        
        {/* Table Header Area */}
        <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center bg-gray-50/20 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl border border-slate-100 group">
               <ListTodo className="w-8 h-8 text-emerald-600 group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">รายการคำขอ IT ทั้งหมด</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                 <Settings2 className="w-3 h-3" /> Management Workflow System
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-8 py-3.5 rounded-2xl border border-slate-100 shadow-sm">
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Found</span>
             <span className="text-2xl font-black text-emerald-600 leading-none">{filteredRequests.length}</span>
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Items</span>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[1100px]">
             <thead>
               <tr className="bg-slate-50/50">
                 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">วันที่แจ้ง / เรื่อง</th>
                 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">ผู้ขอรับบริการ</th>
                 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-center">ความเร่งด่วน</th>
                 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-center">สถานะ</th>
                 <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-center">จัดการ</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {filteredRequests.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-10 py-40 text-center text-slate-300">
                      <div className="flex flex-col items-center gap-6">
                        <FileText className="w-24 h-24 opacity-5" />
                        <p className="font-black text-2xl italic uppercase tracking-[0.3em]">No Data Found</p>
                      </div>
                   </td>
                 </tr>
               ) : (
                 filteredRequests.map((req: any) => (
                   <tr key={req.id} className="group hover:bg-emerald-50/30 transition-all duration-300 cursor-pointer" onClick={() => openDetailModal(req)}>
                     <td className="px-10 py-8">
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[10px] font-black text-slate-300 flex items-center gap-1.5">
                             <Calendar className="w-3 h-3" /> {req.created_at ? new Date(req.created_at).toLocaleDateString('th-TH') : '-'}
                           </span>
                           <span className="text-[15px] font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">{req.title}</span>
                        </div>
                     </td>
                     <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">
                             {req.requester_name?.substring(0, 1) || "?"}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-800">{req.requester_name}</span>
                              <span className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest">{req.department}</span>
                           </div>
                        </div>
                     </td>
                     <td className="px-10 py-8 text-center text-[11px] font-black">
                        <span className={`px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-sm border ${
                          req.urgency === 'ด่วนมาก' ? 'border-rose-200 text-rose-600 bg-rose-50' : 
                          req.urgency === 'ด่วน' ? 'border-orange-200 text-orange-600 bg-orange-50' : 
                          'border-emerald-200 text-emerald-600 bg-emerald-50'
                        }`}>
                          {req.urgency}
                        </span>
                     </td>
                     <td className="px-10 py-8 text-center">
                        {getStatusBadge(req.status)}
                     </td>
                     <td className="px-10 py-8 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                           <button 
                             onClick={() => openDetailModal(req)}
                             className="p-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm active:scale-95"
                           >
                              <Info className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); openDetailModal(req); /* then likely click edit inside */ }}
                             className="p-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm active:scale-95"
                           >
                              <Pencil className="w-4 h-4" />
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
          </table>
        </div>
      </div>

      {/* --- Detail Modal (Image 2 Style) --- */}
      {isDetailModalOpen && selectedReq && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsDetailModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
            
            {/* Modal Header */}
            <div className="px-12 pt-14 pb-10 bg-white flex justify-between items-start">
               <div className="flex items-center gap-4 text-slate-400 font-black text-[12px] uppercase tracking-[0.2em]">
                  <span>สถานะงาน:</span>
               </div>
               <div className="flex items-center gap-4">
                  {getStatusBadge(selectedReq.status)}
                  <button onClick={() => setIsDetailModalOpen(false)} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
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
                        <div className="text-xl font-black text-slate-900 leading-tight">{selectedReq.title}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ประเภท</div>
                        <div>{selectedReq.type}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ความเร่งด่วน</div>
                        <div className={selectedReq.urgency === 'ด่วนมาก' ? 'text-rose-600' : ''}>{selectedReq.urgency}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">วันที่แจ้ง</div>
                        <div>{new Date(selectedReq.created_at).toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' })}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">รอบการใช้</div>
                        <div>{selectedReq.frequency || "ครั้งเดียว"}</div>
                     </div>
                     <div className="md:col-span-2 space-y-1">
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">รายละเอียด/เงื่อนไข</div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-slate-600 font-medium italic whitespace-pre-wrap">
                           {selectedReq.condition || "ไม่ได้ระบุรายละเอียดเพิ่มเติม"}
                        </div>
                     </div>
                     {selectedReq.file_url && (
                        <div className="md:col-span-2">
                           <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">ไฟล์แนบ</div>
                           <a href={selectedReq.file_url} target="_blank" className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                              <Download className="w-4 h-4" /> เปิดดูไฟล์ที่นี่
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
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100"><User className="w-5 h-5" /></div>
                        <div>
                           <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">ชื่อ-สกุล</div>
                           <div className="text-slate-900 font-black">{selectedReq.requester_name}</div>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100"><Building2 className="w-5 h-5" /></div>
                        <div>
                           <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">หน่วยงาน</div>
                           <div className="text-slate-900 font-black">{selectedReq.department}</div>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100"><PhoneCall className="w-5 h-5" /></div>
                        <div>
                           <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">เบอร์โทร</div>
                           <div className="text-slate-900 font-black">{selectedReq.phone}</div>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100"><Mail className="w-5 h-5" /></div>
                        <div>
                           <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">อีเมล</div>
                           <div className="text-slate-900 font-black italic">{selectedReq.email || "ไม่ได้ระบุ"}</div>
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
                        <div className="text-blue-600 font-black">{selectedReq.assigned_to || "- ยังไม่ระบุ -"}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">วันที่รับเรื่อง</div>
                        <div>{selectedReq.date_received ? new Date(selectedReq.date_received).toLocaleDateString('th-TH') : "-"}</div>
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">กำหนดเสร็จ</div>
                        <div>{selectedReq.due_date ? new Date(selectedReq.due_date).toLocaleDateString('th-TH') : "-"}</div>
                     </div>
                  </div>
               </div>

            </div>

            {/* Modal Bottom Bar */}
            <div className="p-10 bg-white border-t border-slate-50 flex gap-4">
               <button onClick={() => setIsDetailModalOpen(false)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all active:scale-95">ปิดหน้าต่าง</button>
               <button onClick={openEditModalFromDetail} className="flex-[2] py-5 bg-amber-500 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-amber-500/30 hover:bg-amber-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                  <Pencil className="w-4 h-4" /> แก้ไขข้อมูลคำขอ
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Modal (Image 3 Style) --- */}
      {isEditModalOpen && selectedReq && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
            
            {/* Header with Details */}
            <div className="p-10 bg-amber-50/50 border-b border-amber-100/50">
               <div className="flex justify-between items-start mb-8">
                  <h3 className="flex items-center gap-3 text-amber-900 font-black text-2xl">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg"><Pencil className="w-6 h-6 text-amber-500" /></div>
                     แก้ไขข้อมูลคำขอ
                  </h3>
                  <button onClick={() => setIsEditModalOpen(false)} className="p-2.5 bg-white hover:bg-white/80 rounded-full shadow-sm text-slate-400">
                     <X className="w-6 h-6" />
                  </button>
               </div>
               
               {/* Quick Info Summary */}
               <div className="grid grid-cols-2 gap-y-4 text-slate-700 font-bold">
                  <div className="text-[12px]"><span className="text-slate-400 font-black uppercase tracking-widest mr-2">ผู้ขอ:</span> {selectedReq.requester_name}</div>
                  <div className="text-[12px]"><span className="text-slate-400 font-black uppercase tracking-widest mr-2">โทร:</span> {selectedReq.phone}</div>
                  <div className="col-span-2 text-[12px] leading-tight"><span className="text-slate-400 font-black uppercase tracking-widest mr-2">เรื่อง:</span> {selectedReq.title}</div>
                  <button onClick={() => { setIsEditModalOpen(false); setIsDetailModalOpen(true); }} className="col-span-2 text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-1.5 mt-2 hover:underline">
                     <ChevronDown className="w-3 h-3 rotate-180" /> ดูรายละเอียดทั้งหมด
                  </button>
               </div>
            </div>

            {/* Form Scroll Area */}
            <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto">
               
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">สถานะ</label>
                  <div className="relative">
                    <select 
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4.5 pl-6 font-black text-slate-800 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none appearance-none"
                    >
                       <option value="รอดำเนินการ">รอดำเนินการ</option>
                       <option value="รับเรื่อง">รับเรื่อง</option>
                       <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                       <option value="ขอข้อมูลเพิ่ม">ขอข้อมูลเพิ่ม</option>
                       <option value="ดำเนินการเรียบร้อย">ดำเนินการเรียบร้อย</option>
                       <option value="ยกเลิก">ยกเลิก</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ข้อความถึงผู้ใช้ (เมื่อขอข้อมูลเพิ่ม)</label>
                  <textarea 
                     value={editFormData.admin_note}
                     onChange={(e) => setEditFormData({...editFormData, admin_note: e.target.value})}
                     rows={3}
                     placeholder="ระบุสิ่งที่ต้องการ..."
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 font-bold text-slate-800 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">ผู้รับผิดชอบงาน</label>
                  <div className="relative">
                    <select 
                      value={editFormData.assigned_to}
                      onChange={(e) => setEditFormData({...editFormData, assigned_to: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4.5 pl-6 font-black text-slate-800 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none appearance-none"
                    >
                       <option value="">-- ยังไม่ระบุ --</option>
                       <option value="นายสิริวัชร ภวะภูตานนท์">นายสิริวัชร ภวะภูตานนท์</option>
                       <option value="นายสุทธิชัย ลำพุทธา">นายสุทธิชัย ลำพุทธา</option>
                       <option value="นายเจริญราษฏร์ ลิศรี">นายเจริญราษฏร์ ลิศรี</option>
                       <option value="นายณภัทร ตันสกุล">นายณภัทร ตันสกุล</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">วันที่รับเรื่อง</label>
                     <div className="relative">
                        <input 
                           type="date"
                           value={editFormData.dateReceived}
                           onChange={(e) => setEditFormData({...editFormData, dateReceived: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4.5 pl-6 font-black text-slate-800 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none appearance-none uppercase"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">วันที่เสร็จ</label>
                     <div className="relative">
                        <input 
                           type="date"
                           value={editFormData.dateCompleted}
                           onChange={(e) => setEditFormData({...editFormData, dateCompleted: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4.5 pl-6 font-black text-slate-800 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none appearance-none uppercase"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Modal Bottom Buttons */}
            <div className="p-10 bg-white border-t border-slate-50 flex gap-4">
               <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 hover:bg-slate-200">ยกเลิก</button>
               <button 
                  onClick={handleUpdateSubmit}
                  disabled={!!updatingId}
                  className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/30 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
               >
                  {updatingId ? <Loader2 className="w-5 h-5 animate-spin" /> : "บันทึกข้อมูล"}
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
