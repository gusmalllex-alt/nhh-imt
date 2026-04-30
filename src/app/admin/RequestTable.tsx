"use client";

import { useState } from "react";
import { 
  CheckCircle2, Clock, AlertCircle, PlayCircle, XCircle, Search, 
  Download, User, FileText, Loader2, Calendar, Pencil, X, Send, 
  Activity, ListTodo, Building2, PhoneCall, Mail, Info, MoreHorizontal,
  ClipboardList, UserCircle2, Settings2, ChevronDown, Trash2
} from "lucide-react";
import { updateRequestStatus, deleteRequest } from "../actions/adminActions";

export default function RequestTable({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
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
    const reqStatusTrimmed = req.status ? req.status.trim() : "";
    const filterStatusTrimmed = statusFilter.trim();
    const matchesStatus = statusFilter === "ทั้งหมด" || reqStatusTrimmed === filterStatusTrimmed;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRequests.length / rowsPerPage);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`ยืนยันการลบคำขอเรื่อง: "${title}"?\nข้อมูลนี้จะถูกลบถาวรจากฐานข้อมูล`)) return;
    
    setUpdatingId(id);
    try {
      const result = await deleteRequest(id);
      if (result.success) {
        setRequests(prev => prev.filter(r => r.id !== id));
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      alert("Failed to delete");
    } finally {
      setUpdatingId(null);
    }
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
    const styles: Record<string, string> = {
      "ดำเนินการเรียบร้อย": "bg-emerald-600 text-white",
      "รอดำเนินการ": "bg-amber-500 text-white",
      "รับเรื่อง": "bg-sky-500 text-white",
      "กำลังดำเนินการ": "bg-blue-600 text-white",
      "ขอข้อมูลเพิ่ม": "bg-purple-600 text-white",
      "ยกเลิก": "bg-rose-600 text-white",
    };
    
    const icons: Record<string, any> = {
      "ดำเนินการเรียบร้อย": <CheckCircle2 className="w-3 h-3" />,
      "รอดำเนินการ": <Clock className="w-3 h-3" />,
      "รับเรื่อง": <PlayCircle className="w-3 h-3" />,
      "กำลังดำเนินการ": <Activity className="w-3 h-3" />,
      "ขอข้อมูลเพิ่ม": <AlertCircle className="w-3 h-3" />,
      "ยกเลิก": <XCircle className="w-3 h-3" />,
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold shadow-sm ${styles[status] || "bg-slate-500 text-white"}`}>
        {icons[status] || <Info className="w-3 h-3" />}
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Search & Filter Bar */}
      <div className="bg-white/70 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/40 group">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full group">
             <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
             </div>
             <input 
               type="text" 
               placeholder="ค้นหาเรื่อง, ผู้ขอ, แผนก หรือคำสำคัญ..." 
               value={searchTerm}
               onChange={(e) => {
                 setSearchTerm(e.target.value);
                 setCurrentPage(1);
               }}
               className="w-full pl-16 pr-8 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-black outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all text-slate-800 placeholder:text-slate-400"
             />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide lg:w-auto w-full px-1">
            {["ทั้งหมด", "รอดำเนินการ", "รับเรื่อง", "กำลังดำเนินการ", "ขอข้อมูลเพิ่ม", "ดำเนินการเรียบร้อย"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] whitespace-nowrap transition-all border ${
                  statusFilter === status 
                    ? "bg-slate-900 text-white border-slate-900 shadow-xl transform scale-105" 
                    : "bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-slate-50 shadow-sm"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white/90 backdrop-blur-3xl rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Table Toolbar */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50/80 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
               <ListTodo className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-none tracking-tight">การจัดการคำขอ</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">Request Workflow Management</p>
            </div>
          </div>
          
          <div className="text-xs font-bold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
             <Activity className="w-4 h-4 text-emerald-500" />
             รายการที่พบ <span className="text-emerald-600 text-base">{filteredRequests.length}</span>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
             <thead>
               <tr className="bg-slate-50/50 border-b border-slate-100">
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">วันที่ / ลำดับ</th>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">เรื่องคำขอข้อมูล</th>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ผู้ติดต่อ / แผนก</th>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">สถานะ</th>
                 <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">จัดการ</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {filteredRequests.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-6 py-32 text-center text-slate-400 font-bold">ไม่พบข้อมูลคำขอ</td>
                 </tr>
               ) : (
                 paginatedRequests.map((req: any, idx: number) => (
                   <tr key={req.id} className="group hover:bg-emerald-50/40 transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-[1.002] bg-white relative z-0 hover:z-10" onClick={() => openDetailModal(req)}>
                     <td className="px-6 py-4">
                        <div className="flex flex-col">
                           <span className="text-[11px] font-bold text-slate-400 mb-1">
                             REQ#{(currentPage - 1) * rowsPerPage + idx + 1} • {req.created_at ? new Date(req.created_at).toLocaleDateString('th-TH') : '-'}
                           </span>
                           <span className="text-sm font-bold text-slate-900 line-clamp-1">{req.title}</span>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                             {req.requester_name?.substring(0, 1) || "?"}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800">{req.requester_name}</span>
                              <span className="text-[11px] font-medium text-slate-500">{req.department}</span>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                          req.urgency === 'ด่วนมาก' ? 'border-rose-200 text-rose-700 bg-rose-50' : 
                          req.urgency === 'ด่วน' ? 'border-orange-200 text-orange-700 bg-orange-50' : 
                          'border-emerald-200 text-emerald-700 bg-emerald-50'
                        }`}>
                          {req.urgency}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-center">
                        {getStatusBadge(req.status)}
                     </td>
                     <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                           <button onClick={() => openDetailModal(req)} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-emerald-600 transition-colors">
                              <Info className="w-4 h-4" />
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); setSelectedReq(req); openEditModalFromDetail(); }} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-900 transition-colors">
                              <Pencil className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={(e) => { 
                               e.stopPropagation(); 
                               handleDelete(req.id, req.title); 
                             }} 
                             className="p-1.5 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-600 transition-colors"
                           >
                              {updatingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                           </button>
                        </div>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">แสดงผล</span>
              <select 
                 className="bg-white border border-slate-200 text-slate-900 text-xs font-black rounded-xl px-4 py-2 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all cursor-pointer shadow-sm"
                 value={rowsPerPage}
                 onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                 }}
              >
                 <option value={5}>5 รายการ</option>
                 <option value={10}>10 รายการ</option>
                 <option value={20}>20 รายการ</option>
              </select>
           </div>
           
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
              หน้า <span className="text-emerald-600 text-sm bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">{currentPage}</span> จาก <span className="text-slate-900">{totalPages || 1}</span>
           </div>
           <div className="flex gap-3">
              <button 
                disabled={currentPage === 1 || paginatedRequests.length === 0}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-black text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all active:scale-95 shadow-sm"
              >
                ย้อนกลับ
              </button>
              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-black text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all active:scale-95 shadow-sm"
              >
                หน้าถัดไป
              </button>
           </div>
        </div>
      </div>

      {/* --- Detail Modal --- */}
      {isDetailModalOpen && selectedReq && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/50">
            
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-emerald-50/50 to-transparent">
               <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm border border-white">
                     <FileText className="w-5 h-5" />
                  </div>
                  รายละเอียดคำขอ
               </h3>
               <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-slate-700 shadow-sm border border-transparent hover:border-slate-200 bg-slate-50"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-0 max-h-[75vh] overflow-y-auto font-sans bg-slate-50">
               
               {/* Work Info Section */}
               <div className="p-6 md:p-8 space-y-8">
                  {/* Title and Status Header */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                     <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="flex-1">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><FileText className="w-3 h-3" /> หัวข้อที่แจ้ง / รายละเอียดข้อมูลที่ขอ</label>
                           <h4 className="text-xl font-black text-slate-900 leading-snug mt-2">{selectedReq.title || "-"}</h4>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">สถานะงานปัจจุบัน</div>
                           <div>{getStatusBadge(selectedReq.status)}</div>
                        </div>
                     </div>
                  </div>

                  {/* Classification Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ประเภทงาน</label>
                        <div className="text-sm font-bold text-slate-800">{selectedReq.type || "-"}</div>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ความเร่งด่วน</label>
                        <div className={`text-sm font-bold ${selectedReq.urgency === 'ด่วนมาก' ? 'text-rose-600' : 'text-slate-800'}`}>{selectedReq.urgency || "-"}</div>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ความถี่ที่ใช้งาน</label>
                        <div className="text-sm font-bold text-slate-800">{selectedReq.frequency || "-"}</div>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ผู้รับผิดชอบงาน</label>
                        <div className="text-sm font-bold text-emerald-600">{selectedReq.assigned_to || "รอดำเนินการ"}</div>
                     </div>
                  </div>

                  {/* Dates Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="flex items-center gap-3 bg-white px-4 py-3 border border-slate-200 rounded-xl">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase">วันที่ส่งคำขอ</div>
                           <div className="text-xs font-bold text-slate-800">{selectedReq.created_at ? new Date(selectedReq.created_at).toLocaleDateString('th-TH') : "-"}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 bg-sky-50 px-4 py-3 border border-sky-100 rounded-xl">
                        <PlayCircle className="w-5 h-5 text-sky-500" />
                        <div>
                           <div className="text-[10px] font-bold text-sky-600 uppercase">วันที่รับเรื่อง</div>
                           <div className="text-xs font-bold text-sky-900">{selectedReq.date_received ? new Date(selectedReq.date_received).toLocaleDateString('th-TH') : "ยังไม่รับเรื่อง"}</div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 bg-emerald-50 px-4 py-3 border border-emerald-100 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <div>
                           <div className="text-[10px] font-bold text-emerald-600 uppercase">กำหนดเสร็จ / ทำเสร็จ</div>
                           <div className="text-xs font-bold text-emerald-900">{selectedReq.due_date ? new Date(selectedReq.due_date).toLocaleDateString('th-TH') : "-"}</div>
                        </div>
                     </div>
                  </div>

                  {/* Full Detail & File */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <ClipboardList className="w-4 h-4" /> เงื่อนไข / คำอธิบายเพิ่มเติม
                     </label>
                     <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap font-medium">
                        {selectedReq.condition || "ไม่ได้ระบุรายละเอียด"}
                     </div>
                     
                     {selectedReq.file_url && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">ไฟล์แนบประกอบ</label>
                           <a 
                             href={selectedReq.file_url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-all shadow-sm group"
                           >
                             <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                             คลิกเพื่อดาวน์โหลด / เปิดดูไฟล์แนบ
                           </a>
                        </div>
                     )}
                  </div>

                  {/* Admin Note Information */}
                  {selectedReq.admin_note && (
                     <div className="bg-amber-50 p-6 rounded-2xl shadow-sm border border-amber-200">
                        <label className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2 mb-3">
                           <Info className="w-4 h-4" /> หมายเหตุจากแอดมิน (Admin Note)
                        </label>
                        <div className="text-sm text-amber-900 font-medium italic whitespace-pre-wrap">
                           {selectedReq.admin_note}
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
                            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                               <User className="w-4 h-4 text-slate-400" /> 
                               {selectedReq.requester_name || "-"}
                            </div>
                         </div>
                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">หน่วยงาน / แผนก</label>
                           <div className="text-sm font-bold text-slate-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> {selectedReq.department || "-"}</div>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">เบอร์โทรศัพท์</label>
                           <div className="text-sm font-bold text-slate-900 flex items-center gap-2"><PhoneCall className="w-4 h-4 text-slate-400" /> {selectedReq.phone || "-"}</div>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">อีเมล</label>
                           <div className="text-sm font-bold text-slate-900 flex items-center gap-2 truncate"><Mail className="w-4 h-4 text-slate-400" /> {selectedReq.email || "-"}</div>
                        </div>
                     </div>
                  </div>
                  
               </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-100 flex gap-4 bg-slate-50/50">
               <button onClick={() => setIsDetailModalOpen(false)} className="flex-1 py-3 bg-white text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors border border-slate-200 shadow-sm">ปิด</button>
               <button onClick={openEditModalFromDetail} className="flex-1 py-3 bg-amber-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 active:scale-[0.98]">
                  <Pencil className="w-4 h-4" /> แก้ไข/อัพเดทงาน
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Modal --- */}
      {isEditModalOpen && selectedReq && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/50">
            
            <div className="px-8 py-6 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
               <h3 className="text-xl font-black text-amber-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm border border-white">
                     <Pencil className="w-5 h-5" />
                  </div>
                  อัพเดทสถานะงาน
               </h3>
               <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-all text-amber-500 hover:text-amber-700 shadow-sm border border-transparent hover:border-amber-200 bg-amber-100/50"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-5">
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">สถานะการเนินงาน</label>
                  <select 
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 cursor-pointer"
                  >
                     <option value="รอดำเนินการ">รอดำเนินการ</option>
                     <option value="รับเรื่อง">รับเรื่อง</option>
                     <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                     <option value="ขอข้อมูลเพิ่ม">ขอข้อมูลเพิ่ม</option>
                     <option value="ดำเนินการเรียบร้อย">ดำเนินการเรียบร้อย</option>
                     <option value="ยกเลิก">ยกเลิก</option>
                  </select>
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ผู้รับผิดชอบ (เจ้าหน้าที่ IT)</label>
                  <select 
                    value={editFormData.assigned_to}
                    onChange={(e) => setEditFormData({...editFormData, assigned_to: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 cursor-pointer"
                  >
                     <option value="">-- ยังเลือก --</option>
                     <option value="นายสิริวัชร ภวะภูตานนท์">นายสิริวัชร ภวะภูตานนท์</option>
                     <option value="นายสุทธิชัย ลำพุทธา">นายสุทธิชัย ลำพุทธา</option>
                     <option value="นายเจริญราษฏร์ ลิศรี">นายเจริญราษฏร์ ลิศรี</option>
                     <option value="นายณภัทร ตันสกุล">นายณภัทร ตันสกุล</option>

                     <option value="นายศุภชัย สุนารักษ์">นายศุภชัย สุนารักษ์</option>
                  </select>
               </div>

               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">หมายเหตุ / คิวงาน (Admin Note)</label>
                  <textarea 
                     value={editFormData.admin_note}
                     onChange={(e) => setEditFormData({...editFormData, admin_note: e.target.value})}
                     rows={3}
                     placeholder="ระบุสิ่งที่ต้องการให้ผู้ใช้ทราบ..."
                     className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <button onClick={() => setIsEditModalOpen(false)} className="py-3 bg-white text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors border border-slate-200 shadow-sm">ยกเลิก</button>
                  <button 
                     onClick={handleUpdateSubmit}
                     disabled={!!updatingId}
                     className="py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                     {updatingId ? <Loader2 className="w-5 h-5 animate-spin" /> : "บันทึกการเปลี่ยนแปลง"}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
