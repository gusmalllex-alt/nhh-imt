"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, Search, Plus, Filter, 
  MoreVertical, Mail, Shield, 
  CheckCircle2, XCircle, AlertCircle,
  Loader2, UserPlus, Building2
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
    role: "Staff",
    status: "Active"
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProfiles() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('updated_at', { ascending: false });

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
    }
    fetchProfiles();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // For now, we save only to the profile table. 
      // Individual login must still be created in Supabase Auth.
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          ...newStaff,
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      if (data) setProfiles([data[0], ...profiles]);
      setIsModalOpen(false);
      setNewStaff({ full_name: "", email: "", role: "Staff", status: "Active" });
      alert("เพิ่มข้อมูลบุคลากรสำเร็จ! อย่าลืมไปสร้างบัญชี Login ใน Supabase ด้วยนะครับ");
    } catch (err: any) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Personnel Directory...</p>
      </div>
    );
  }

  if (error === "NOT_CONFIGURED") {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-12 text-center animate-in zoom-in-95 duration-500">
         <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <AlertCircle className="w-10 h-10 text-amber-500" />
         </div>
         <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">ยังไม่ได้ตั้งค่าตารางบุคลากร</h2>
         <p className="text-slate-500 font-medium mb-10 leading-relaxed">
            ระบบต้องการตาราง <code className="bg-slate-100 px-2 py-0.5 rounded text-rose-500">profiles</code> ในฐานข้อมูลเพื่อแสดงผล <br/>
            กรุณานำคำสั่ง SQL ด้านล่างนี้ไปรันใน **Supabase SQL Editor** ครับ:
         </p>
         
         <div className="bg-slate-900 p-6 rounded-2xl text-left mb-10 overflow-x-auto">
            <pre className="text-emerald-400 font-mono text-sm leading-relaxed">
{`-- 1. สร้างตาราง Profiles
create table public.profiles (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text,
  role text default 'Staff',
  status text default 'Active',
  updated_at timestamp with time zone default now()
);

-- 2. ตั้งค่าความปลอดภัย (RLS)
alter table public.profiles enable row level security;
create policy "Allow all for demo" on public.profiles for all using (true);`}
            </pre>
         </div>
         
         <button 
           onClick={() => window.location.reload()}
           className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all"
         >
           ฉันรัน SQL เรียบร้อยแล้ว (Reload)
         </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <Users className="w-8 h-8 text-emerald-600" /> รายการบุคลากร
           </h2>
           <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">NHH Hospital Personnel Management</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-emerald-600/20 hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
           <UserPlus className="w-4 h-4" /> เพิ่มบุคลากรใหม่
        </button>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop */}
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
           
           {/* Modal Card */}
           <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">เพิ่มข้อมูลบุคลากร</h3>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><XCircle className="w-6 h-6 text-slate-400" /></button>
              </div>

              <form onSubmit={handleAddStaff} className="p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ชื่อ-นามสกุล</label>
                       <input 
                         required
                         type="text" 
                         value={newStaff.full_name}
                         onChange={(e) => setNewStaff({...newStaff, full_name: e.target.value})}
                         className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" 
                         placeholder="ระบุชื่อจริง..." 
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">อีเมลพนักงาน</label>
                       <input 
                         required
                         type="email" 
                         value={newStaff.email}
                         onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                         className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" 
                         placeholder="staff@nonghan.com" 
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">บทบาท</label>
                       <select 
                         value={newStaff.role}
                         onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                         className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 font-bold transition-all outline-none appearance-none cursor-pointer"
                       >
                          <option value="Staff">Staff</option>
                          <option value="Admin">Admin</option>
                          <option value="IT Assistant">IT Assistant</option>
                       </select>
                    </div>
                 </div>

                 <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                       {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                       บันทึกข้อมูลบุคลากร
                    </button>
                    <p className="text-[10px] text-center text-rose-400 font-bold mt-4 uppercase tracking-widest">
                       *การบันทึกนี้เพื่อเก็บข้อมูลรายชื่อเท่านั้น ระบบ Login ต้องสร้างที่ Supabase
                    </p>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Filters & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ-นามสกุล..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold"
            />
         </div>
         <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-around">
            <div className="text-center">
               <div className="text-2xl font-black text-slate-900">{profiles.length}</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ทั้งหมด</div>
            </div>
            <div className="w-px h-8 bg-slate-100" />
            <div className="text-center">
               <div className="text-2xl font-black text-emerald-600">{profiles.filter(p => p.status === 'Active').length}</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ใช้งาน</div>
            </div>
         </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">รายชื่อบุคลากร</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">บทบาท / หน้าที่</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">สถานะ</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                     <div className="flex flex-col items-center gap-4 text-slate-400">
                       <Users className="w-16 h-16 opacity-10" />
                       <p className="font-extrabold text-xl">ไม่พบข้อมูลบุคลากร</p>
                     </div>
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((user) => (
                  <tr key={user.id} className="group hover:bg-emerald-50/30 transition-colors">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-emerald-500/10 flex items-center justify-center font-black text-emerald-700 shadow-sm group-hover:scale-105 transition-transform">
                             {user.full_name?.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-900">{user.full_name}</span>
                             <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1 uppercase tracking-tight">
                                <Mail className="w-3 h-3" /> {user.email || 'NHH-STAFF'}
                             </span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <Shield className={`w-4 h-4 ${user.role === 'Admin' ? 'text-rose-500' : 'text-blue-500'}`} />
                          <span className="text-sm font-bold text-slate-700">{user.role}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                         user.status === 'Active' ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-400/20' : 'bg-slate-100 text-slate-400 ring-1 ring-slate-400/20'
                       }`}>
                          {user.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {user.status || 'Active'}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <button className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 hover:text-emerald-600 transition-all shadow-sm">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        <div className="p-8 border-t border-slate-50 bg-slate-50/20 text-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Management access for authorized administrators only</p>
        </div>
      </div>
    </div>
  );
}
