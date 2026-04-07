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
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="ค้นหาเรื่อง, ผู้ขอ, แผนก..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-sans"
             />
          </div>
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
            {["ทั้งหมด", "รอดำเนินการ", "รับเรื่อง", "กำลังดำเนินการ", "ขอข้อมูลเพิ่ม", "ดำเนินการเรียบร้อย"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
                  statusFilter === status 
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
        
        {/* Table Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm">
               <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-none">จัดการคำขอทั้งหมด</h3>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Management Workflow System</p>
            </div>
          </div>
          
          <div className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-md border border-slate-200">
             พบข้อมูล <span className="text-emerald-600">{filteredRequests.length}</span> รายการ
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
             <thead>
               <tr className="bg-slate-50 border-b border-slate-100">
                 <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">วันที่ / เรื่อง</th>
                 <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">ผู้ขอรับบริการ</th>
                 <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">ความด่วน</th>
                 <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">สถานะ</th>
                 <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">จัดการ</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {filteredRequests.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-6 py-32 text-center text-slate-400 font-bold">ไม่พบข้อมูลคำขอ</td>
                 </tr>
               ) : (
                 filteredRequests.map((req: any) => (
                   <tr key={req.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => openDetailModal(req)}>
                     <td className="px-6 py-4">
                        <div className="flex flex-col">
                           <span className="text-[11px] font-bold text-slate-400 mb-1">
                             {req.created_at ? new Date(req.created_at).toLocaleDateString('th-TH') : '-'}
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
                        </div>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
          </table>
        </div>
      </div>

      {/* --- Detail Modal --- */}
      {isDetailModalOpen && selectedReq && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="font-bold text-slate-900 flex items-center gap-2"><FileText className="w-4 h-4 text-emerald-600" /> รายละเอียดคำขอ</h3>
               <button onClick={() => setIsDetailModalOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-md transition-colors text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto font-sans">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-lg border border-slate-100">
                  <div className="md:col-span-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">เรื่องที่ขอรับบริการ</label>
                     <div className="text-base font-bold text-slate-900 mt-1">{selectedReq.title}</div>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ประเภทงาน</label>
                     <div className="text-sm font-bold text-slate-800">{selectedReq.type}</div>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ความเร่งด่วน</label>
                     <div className={`text-sm font-bold ${selectedReq.urgency === 'ด่วนมาก' ? 'text-rose-600' : 'text-slate-800'}`}>{selectedReq.urgency}</div>
                  </div>
                  <div className="md:col-span-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">รายละเอียดเพิ่มเติม</label>
                     <div className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200 mt-1 font-medium italic whitespace-pre-wrap">{selectedReq.condition || "ไม่ได้ระบุ"}</div>
                  </div>
               </div>

               <div className="bg-white p-5 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ชื่อผู้ขอ</label>
                     <div className="text-sm font-bold text-slate-800">{selectedReq.requester_name}</div>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">เบอร์โทรศัพท์</label>
                     <div className="text-sm font-bold text-slate-800">{selectedReq.phone}</div>
                  </div>
                  <div className="sm:col-span-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">สังกัดหน่วยงาน</label>
                     <div className="text-sm font-bold text-slate-800">{selectedReq.department}</div>
                  </div>
               </div>

               <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-100 grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">สถานะปัจจุบัน</label>
                     <div className="mt-1">{getStatusBadge(selectedReq.status)}</div>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">ผู้รับงาน</label>
                     <div className="text-sm font-bold text-slate-800 mt-1">{selectedReq.assigned_to || "ยังไม่รับเรื่อง"}</div>
                  </div>
               </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
               <button onClick={() => setIsDetailModalOpen(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-xs hover:bg-slate-200 transition-colors">ปิด</button>
               <button onClick={openEditModalFromDetail} className="flex-1 py-2 bg-amber-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> แก้ไข/อัพเดทงาน
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Edit Modal --- */}
      {isEditModalOpen && selectedReq && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            
            <div className="px-6 py-4 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
               <h3 className="font-bold text-amber-900 flex items-center gap-2"><Pencil className="w-4 h-4" /> อัพเดทสถานะงาน</h3>
               <button onClick={() => setIsEditModalOpen(false)} className="p-1.5 hover:bg-amber-100 rounded-md transition-colors text-amber-600"><X className="w-5 h-5" /></button>
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
                     <option value="นายศราวุธ สุขรักษ์">นายศราวุธ สุขรักษ์</option>
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

               <div className="grid grid-cols-2 gap-4 pt-2">
                  <button onClick={() => setIsEditModalOpen(false)} className="py-2.5 bg-slate-100 text-slate-500 rounded-lg font-bold text-xs hover:bg-slate-200 transition-colors">ยกเลิก</button>
                  <button 
                     onClick={handleUpdateSubmit}
                     disabled={!!updatingId}
                     className="py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                     {updatingId ? <Loader2 className="w-4 h-4 animate-spin" /> : "บันทึกการเปลี่ยนแปลง"}
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
