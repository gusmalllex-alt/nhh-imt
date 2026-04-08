"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, Search, Plus, Filter, 
  Loader2, UserPlus, X, Pencil, Trash2, Settings, MoreVertical as Dots,
  Shield, AlertCircle, CheckCircle2, XCircle
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
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Could not create user account");

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          full_name: newStaff.full_name,
          email: newStaff.email,
          role: newStaff.role,
          status: "Active",
          updated_at: new Date().toISOString()
        }])
        .select();

      if (profileError) throw profileError;

      if (profileData) setProfiles([...profiles, profileData[0]].sort((a,b) => a.full_name.localeCompare(b.full_name)));
      setIsModalOpen(false);
      setNewStaff({ full_name: "", email: "", password: "", role: "Staff", status: "Active" });
      alert("สร้างบัญชีสำเร็จ!");
    } catch (err: any) {
      alert("Error: " + err.message);
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
      alert("ลบข้อมูลสำเร็จ");
    } catch (err: any) {
      alert("Error: " + err.message);
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
      alert("อัพเดทข้อมูลสำเร็จ!");
    } catch (err: any) {
      alert("Error: " + err.message);
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
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Loading Personnel...</p>
      </div>
    );
  }

  if (error === "NOT_CONFIGURED") {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 p-10 text-center shadow-sm">
         <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-6" />
         <h2 className="text-2xl font-bold text-slate-900 mb-4">ยังไม่ได้ตั้งค่าตารางบุคลากร</h2>
         <p className="text-slate-600 mb-8 text-sm leading-relaxed">กรุณารันคำสั่ง SQL ใน Supabase เพื่อสร้างตาราง profiles:</p>
         <div className="bg-slate-900 p-4 rounded-lg text-left mb-8 overflow-x-auto">
            <pre className="text-emerald-400 font-mono text-xs">
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
         <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors">Reload Page</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             <Users className="w-6 h-6 text-emerald-600" /> จัดการบุคลากร
           </h2>
           <p className="text-slate-500 text-xs font-medium mt-1">รายชื่อเจ้าหน้าที่และสิทธิการใช้งานระบบ</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-sm"
        >
           <UserPlus className="w-4 h-4" /> เพิ่มเจ้าหน้าที่
        </button>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
         <div className="lg:col-span-3 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ หรืออีเมล..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-sm"
            />
         </div>
         <div className="bg-slate-900 text-white p-2 rounded-lg flex items-center justify-around shadow-inner">
            <div className="text-center">
               <div className="text-lg font-bold leading-none">{profiles.length}</div>
               <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">ทั้งหมด</div>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="text-center">
               <div className="text-lg font-bold leading-none text-emerald-400">{profiles.filter(p => p.status === 'Active').length}</div>
               <div className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">ออนไลน์</div>
            </div>
         </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="overflow-x-visible">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">ชื่อเจ้าหน้าที่</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">สถานะ</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                     <p className="font-bold">ไม่พบข้อมูลสมาชิก</p>
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                             {user.full_name?.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-slate-900 leading-none">{user.full_name}</span>
                             <span className="text-[11px] font-medium text-slate-500 mt-1">{user.email || 'N/A'}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                         user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                       }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {user.status || 'Active'}
                       </span>
                    </td>
                    <td className={`px-6 py-4 text-right transition-all ${openMenuId === user.id ? 'relative z-[30]' : 'relative'}`}>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setOpenMenuId(openMenuId === user.id ? null : user.id);
                         }}
                         className={`p-1.5 rounded-md transition-colors ${openMenuId === user.id ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                       >
                          <Dots className="w-4 h-4" />
                       </button>

                       {/* Action Dropdown Menu */}
                       {openMenuId === user.id && (
                         <>
                           <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                           <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-2xl border border-slate-200 py-1.5 z-[50] animate-in fade-in slide-in-from-top-1 duration-200 text-left">
                              <button 
                                onClick={() => handleEditClick(user)}
                                className="w-full px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                              >
                                 <Pencil className="w-3.5 h-3.5 text-blue-500" /> แก้ไขข้อมูล
                              </button>
                              <div className="h-px bg-slate-50 my-1" />
                              <button 
                                onClick={() => handleDeleteUser(user)}
                                className="w-full px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                              >
                                 <Trash2 className="w-3.5 h-3.5" /> ลบบัญชี
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

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
           <div className="bg-white w-full max-w-md rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="font-bold text-slate-900">เพิ่มเจ้าหน้าที่ใหม่</h3>
                 <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-md transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleAddStaff} className="p-6 space-y-4">
                 <div className="space-y-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ชื่อ-นามสกุล</label>
                       <input 
                         required
                         type="text" 
                         value={newStaff.full_name}
                         onChange={(e) => setNewStaff({...newStaff, full_name: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" 
                         placeholder="ป้อนชื่อ-นามสกุล..." 
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">อีเมล</label>
                          <input 
                            required
                            type="email" 
                            value={newStaff.email}
                            onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" 
                            placeholder="user@nhh.com" 
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">รหัสผ่าน</label>
                          <input 
                            required
                            type="password" 
                            value={newStaff.password}
                            onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" 
                            placeholder="ความยาว 6+..." 
                          />
                       </div>
                    </div>
                 </div>

                 <button 
                   type="submit"
                   disabled={submitting}
                   className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold text-sm shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                 >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    บันทึกข้อมูล
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
           <div className="bg-white w-full max-w-md rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Pencil className="w-4 h-4 text-emerald-600" /> แก้ไขข้อมูลเจ้าหน้าที่
                 </h3>
                 <button onClick={() => setIsEditModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-md transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                 <div className="space-y-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ชื่อ-นามสกุล</label>
                       <input 
                         required
                         type="text" 
                         value={editFormData.full_name}
                         onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" 
                       />
                    </div>
                    
                    <div className="space-y-1">
                       <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">สถานะการใช้งาน</label>
                       <select 
                         value={editFormData.status}
                         onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-900 outline-none cursor-pointer"
                       >
                          <option value="Active">เปิดใช้งาน</option>
                          <option value="Inactive">ปิดใช้งาน</option>
                       </select>
                    </div>
                 </div>

                 <button 
                   type="submit"
                   disabled={submitting}
                   className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold text-sm shadow-lg hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
                 >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    บันทึกการเปลี่ยนแปลง
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
