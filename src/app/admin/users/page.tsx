"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, Search, Plus, 
  Loader2, UserPlus, X, Pencil, Trash2, Settings, MoreVertical as Dots,
  Shield, AlertCircle, CheckCircle2, Mail
} from "lucide-react";

export default function UserManagement() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "Admin",
    status: "Active"
  });
  const [submitting, setSubmitting] = useState(false);

  // Action Menu & Edit State
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    role: "",
    status: ""
  });

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) {
        if (error.code === '42P01' || error.message.includes('not found')) {
           setError("NOT_CONFIGURED");
        } else {
           throw error;
        }
      } else {
        setProfiles(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const tempClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false } }
      );

      const { data: authData, error: authError } = await tempClient.auth.signUp({
        email: newStaff.email,
        password: newStaff.password,
        options: {
          data: {
            full_name: newStaff.full_name,
            role: newStaff.role
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Could not create user account");

      // Wait a bit for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Refresh the list from the database
      await fetchProfiles();

      setIsModalOpen(false);
      setNewStaff({ full_name: "", email: "", password: "", role: "Admin", status: "Active" });
    } catch (err: any) {
      console.error("Error adding staff:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (!confirm(`ยืนยันการลบบัญชีของ ${user.full_name}?`)) return;
    
    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) throw error;
      
      setProfiles(profiles.filter(p => p.id !== user.id));
      setOpenMenuId(null);
    } catch (err: any) {
      console.error("Error deleting user:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setEditFormData({
      full_name: user.full_name || "",
      role: user.role || "Staff",
      status: user.status || "Active"
    });
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editFormData.full_name,
          role: editFormData.role,
          status: editFormData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id);

      if (error) throw error;
      
      setProfiles(profiles.map(p => p.id === editingUser.id ? { ...p, ...editFormData } : p));
      setIsEditModalOpen(false);
    } catch (err: any) {
      console.error("Error updating user:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl animate-ping opacity-75" />
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin relative z-10" />
        </div>
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Loading Staff Records</p>
      </div>
    );
  }

  if (error === "NOT_CONFIGURED") {
    return (
      <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-3xl rounded-[3rem] border border-white p-12 text-center shadow-2xl shadow-slate-200/50">
         <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-amber-100">
            <AlertCircle className="w-10 h-10 text-amber-500" />
         </div>
         <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">ยังไม่ได้ตั้งค่าตารางบุคลากร</h2>
         <p className="text-slate-500 mb-10 text-sm font-bold leading-relaxed max-w-md mx-auto">กรุณารันคำสั่ง SQL ใน Supabase เพื่อสร้างตาราง profiles เพื่อจัดการสิทธิ์การเข้าใช้งาน:</p>
         <div className="bg-slate-950 p-8 rounded-[2rem] text-left mb-10 overflow-x-auto shadow-inner ring-4 ring-slate-50">
            <pre className="text-emerald-400 font-mono text-xs leading-relaxed">
{`create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text,
  role text default 'Staff',
  status text default 'Active',
  updated_at timestamp with time zone default now()
);`}
            </pre>
         </div>
         <button onClick={() => window.location.reload()} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 uppercase tracking-widest">Reload Page</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
      
      {/* ── Page Header ─────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="space-y-2">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-900/20">
                 <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">จัดการบุคลากร</h2>
           </div>
           <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] ml-16">Personnel Management & Role Authorization</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative overflow-hidden px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-900/20 active:scale-95"
        >
           <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
           <span className="uppercase tracking-widest">เพิ่มเจ้าหน้าที่ใหม่</span>
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </button>
      </div>

      {/* ── Search & Stats ──────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-center">
         <div className="xl:col-span-3 relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
               <Search className="w-full h-full" />
            </div>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อเจ้าหน้าที่ หรืออีเมลบุคลากร..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-100/50 rounded-[2rem] outline-none focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 transition-all font-black text-slate-800 text-sm placeholder:text-slate-300 placeholder:font-bold shadow-sm"
            />
         </div>
         <div className="bg-slate-900 rounded-[2rem] p-5 flex items-center justify-around shadow-2xl border border-slate-800">
            <div className="text-center px-4">
               <div className="text-2xl font-black text-white tabular-nums leading-none mb-1">{profiles.length}</div>
               <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">บุคลากรทั้งหมด</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center px-4">
               <div className="text-2xl font-black text-emerald-400 tabular-nums leading-none mb-1">{profiles.filter(p => p.status === 'Active').length}</div>
               <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">กำลังใช้งาน</div>
            </div>
         </div>
      </div>

      {/* ── User Table ──────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ข้อมูลพื้นฐานเจ้าหน้าที่</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">สถานะระบบ</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-10 py-32 text-center text-slate-400">
                     <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
                        <Users className="w-8 h-8" />
                     </div>
                     <p className="font-black uppercase tracking-[0.15em] text-sm text-slate-300">ไม่พบข้อมูลรายชื่อเจ้าหน้าที่</p>
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((user) => (
                  <tr key={user.id} className="group hover:bg-emerald-50/20 transition-all duration-300">
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-500 text-sm shadow-inner group-hover:from-emerald-500 group-hover:to-teal-600 group-hover:text-white group-hover:shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                             {user.full_name?.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col gap-1">
                             <span className="text-base font-black text-slate-900 tracking-tight leading-none">{user.full_name}</span>
                             <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                                <Mail className="w-3 h-3 text-emerald-500 opacity-60" />
                                {user.email || 'N/A'}
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                         user.status === 'Active' 
                           ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm' 
                           : 'bg-slate-100 text-slate-500 border-slate-200 opacity-60'
                       }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse' : 'bg-slate-400'}`} />
                          {user.status || 'Active'}
                       </span>
                    </td>
                    <td className={`px-10 py-6 text-right relative transition-all ${openMenuId === user.id ? 'z-40' : 'z-10'}`}>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setOpenMenuId(openMenuId === user.id ? null : user.id);
                         }}
                         className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center mx-auto md:ml-auto md:mr-0 ${openMenuId === user.id ? 'bg-slate-900 text-white shadow-xl rotate-90 scale-110' : 'bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-100'}`}
                       >
                          <Dots className="w-5 h-5" />
                       </button>

                       {openMenuId === user.id && (
                         <>
                           <div className="fixed inset-0 z-40 bg-slate-950/5 backdrop-blur-[2px]" onClick={() => setOpenMenuId(null)} />
                           <div className="absolute right-10 top-1/2 -translate-y-1/2 w-52 bg-white rounded-[2rem] shadow-2xl shadow-slate-900/10 border border-slate-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-300 origin-right text-left overflow-hidden">
                              <button 
                                onClick={() => handleEditClick(user)}
                                className="w-full px-6 py-4 text-xs font-black text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-all"
                              >
                                 <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center"><Pencil className="w-4 h-4" /></div>
                                 แก้ไขข้อมูล
                              </button>
                              <div className="h-px bg-slate-50 mx-4 my-1" />
                              <button 
                                onClick={() => handleDeleteUser(user)}
                                className="w-full px-6 py-4 text-xs font-black text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-all"
                              >
                                 <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center"><Trash2 className="w-4 h-4" /></div>
                                 ลบบัญชี
                              </button>
                           </div>
                         </>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Modal ───────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-12">
           <div className="fixed inset-0 bg-slate-950/30 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsModalOpen(false)} />
           <div className="bg-white/95 backdrop-blur-3xl w-full max-w-xl rounded-[3rem] shadow-2xl shadow-slate-900/20 animate-in zoom-in-95 duration-300 border border-white overflow-hidden relative z-10 flex flex-col max-h-full">
              <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-900/20 text-white">
                       <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">เพิ่มเจ้าหน้าที่ใหม่</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">New Account Registration</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-50 hover:scale-110 transition-all text-slate-400"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddStaff} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                 <div className="space-y-6">
                    <div className="space-y-2.5">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">ชื่อ-นามสกุล บุคลากร (Full Name)</label>
                       <div className="relative group">
                          <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                          <input 
                            required
                            type="text" 
                            value={newStaff.full_name}
                            onChange={(e) => setNewStaff({...newStaff, full_name: e.target.value})}
                            className="w-full bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl pl-14 pr-6 py-4 outline-none font-black text-slate-800 text-sm focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 transition-all placeholder:text-slate-300 placeholder:font-bold" 
                            placeholder="ป้อนชื่อ-นามสกุล..." 
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">อีเมลเจ้าหน้าที่ (Email)</label>
                          <div className="relative group">
                             <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                             <input 
                               required
                               type="email" 
                               value={newStaff.email}
                               onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                               className="w-full bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl pl-14 pr-6 py-4 outline-none font-black text-slate-800 text-sm focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 transition-all placeholder:text-slate-300 placeholder:font-bold" 
                               placeholder="user@nhh.com" 
                             />
                          </div>
                       </div>
                       <div className="space-y-2.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">รหัสผ่านเริ่มต้น (Password)</label>
                          <div className="relative group">
                             <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                             <input 
                               required
                               type="password" 
                               value={newStaff.password}
                               onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                               className="w-full bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl pl-14 pr-6 py-4 outline-none font-black text-slate-800 text-sm focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 transition-all placeholder:text-slate-300 placeholder:font-bold" 
                               placeholder="ความยาว 6+..." 
                             />
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-slate-100">
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="w-full group relative overflow-hidden bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-base shadow-2xl shadow-emerald-900/20 hover:bg-emerald-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                       {submitting ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                       ) : (
                          <>
                             <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                             <span className="uppercase tracking-[0.2em]">บันทึกข้อมูลเจ้าหน้าที่</span>
                          </>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* ── Edit Modal ──────────────────────────────────── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-12">
           <div className="fixed inset-0 bg-slate-950/30 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsEditModalOpen(false)} />
           <div className="bg-white/95 backdrop-blur-3xl w-full max-w-xl rounded-[3rem] shadow-2xl shadow-slate-900/20 animate-in zoom-in-95 duration-300 border border-white overflow-hidden relative z-10">
              <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 text-emerald-600">
                       <Pencil className="w-5 h-5" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">แก้ไขข้อมูลเจ้าหน้าที่</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Profile & Authorization Update</p>
                    </div>
                 </div>
                 <button onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-50 hover:scale-110 transition-all text-slate-400"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleUpdateUser} className="p-10 space-y-10">
                 <div className="space-y-6">
                    <div className="space-y-2.5">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">ชื่อ-นามสกุล บุคลากร (Full Name)</label>
                       <input 
                         required
                         type="text" 
                         value={editFormData.full_name}
                         onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                         className="w-full bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl px-6 py-4 outline-none font-black text-slate-900 text-sm focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 transition-all shadow-sm" 
                       />
                    </div>
                    
                    <div className="space-y-2.5">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">สถานะการใช้งาน (System Status)</label>
                       <div className="relative">
                          <Settings className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                          <select 
                            value={editFormData.status}
                            onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                            className="w-full bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl pl-14 pr-6 py-4 outline-none font-black text-slate-900 text-sm focus:bg-white focus:border-emerald-500/30 focus:ring-8 focus:ring-emerald-500/5 transition-all cursor-pointer appearance-none shadow-sm"
                          >
                             <option value="Active">🟢 เปิดใช้งาน (Active)</option>
                             <option value="Inactive">🔴 ปิดใช้งาน (Inactive)</option>
                          </select>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-slate-100 flex flex-col gap-4">
                    <button 
                      type="button"
                      onClick={async () => {
                         if (!editingUser.email) return;
                         setSubmitting(true);
                         try {
                            const { error } = await supabase.auth.resetPasswordForEmail(editingUser.email, {
                              redirectTo: window.location.origin + '/login'
                            });
                            if (error) throw error;
                            alert("ส่งอีเมลรีเซ็ตรหัสผ่านสำเร็จ!");
                         } catch (err: any) {
                            console.error("Reset error:", err);
                         } finally {
                            setSubmitting(false);
                         }
                      }}
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-500 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                       <Mail className="w-5 h-5 text-emerald-500" />
                       ส่งอีเมลรีเซ็ตรหัสผ่าน (Password Recovery)
                    </button>
                    
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="w-full group relative overflow-hidden bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-base shadow-2xl shadow-emerald-900/20 hover:bg-emerald-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                       {submitting ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                       ) : (
                          <>
                             <CheckCircle2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
                             <span className="uppercase tracking-[0.2em]">บันทึกการเปลี่ยนแปลง</span>
                          </>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
