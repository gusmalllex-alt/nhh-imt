"use client";

import { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from "recharts";
import { 
  FileText, Users, Activity, Layers, CheckCircle2, Clock, AlertCircle
} from "lucide-react";

// Standard Colors
const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#64748b"];

const ALL_STATUSES = [
  "รอดำเนินการ",
  "รับเรื่อง",
  "กำลังดำเนินการ",
  "ขอข้อมูลเพิ่ม",
  "ดำเนินการเรียบร้อย",
  "ยกเลิก"
];

export default function AdminDashboardView({ requests }: { requests: any[] }) {
  
  const statsData = useMemo(() => {
    // 1. Status Distribution (Ensuring all exist)
    const statusCounts: Record<string, number> = {};
    ALL_STATUSES.forEach(s => statusCounts[s] = 0);
    requests.forEach(r => {
      const s = r.status || "รอดำเนินการ";
      if (statusCounts.hasOwnProperty(s)) statusCounts[s]++;
    });
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // 2. Request Type Distribution
    const typeMap: Record<string, number> = {};
    requests.forEach(r => {
      const t = r.type || "อื่นๆ";
      typeMap[t] = (typeMap[t] || 0) + 1;
    });
    const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

    // 3. Assignee Workload (ใครรับงานมากที่สุด)
    const assigneeMap: Record<string, number> = {};
    requests.forEach(r => {
      const a = r.assigned_to || "- ยังไม่รับเรื่อง -";
      assigneeMap[a] = (assigneeMap[a] || 0) + 1;
    });
    const assigneeData = Object.entries(assigneeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 4. Top Departments
    const deptMap: Record<string, number> = {};
    requests.forEach(r => {
      const d = r.department || "ไม่ระบุ";
      deptMap[d] = (deptMap[d] || 0) + 1;
    });
    const deptData = Object.entries(deptMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return { statusData, typeData, assigneeData, deptData, total: requests.length };
  }, [requests]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans pb-10">
      
      {/* Header Info */}
      <div className="flex flex-wrap items-center gap-6 mb-8 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
         <div className="flex items-center gap-4 border-r border-slate-100 pr-8">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
               <FileText className="w-7 h-7" />
            </div>
            <div>
               <div className="text-3xl font-black text-slate-900 tracking-tighter">{statsData.total}</div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">คำขอทั้งหมด</div>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="bg-amber-50 px-6 py-3 rounded-2xl flex flex-col justify-center">
               <span className="text-amber-600 font-black text-xl leading-none">{statsData.statusData.find(s => s.name === "รอดำเนินการ")?.value || 0}</span>
               <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest mt-1">Pending</span>
            </div>
            <div className="bg-emerald-50 px-6 py-3 rounded-2xl flex flex-col justify-center">
               <span className="text-emerald-600 font-black text-xl leading-none">{statsData.statusData.find(s => s.name === "ดำเนินการเรียบร้อย")?.value || 0}</span>
               <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mt-1">Completed</span>
            </div>
         </div>
      </div>

      {/* Charts Grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Status Donut */}
        <ChartCard title="สถานะงาน" sub="Work Status Distribution">
           <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                 <Pie
                    data={statsData.statusData}
                    cx="50%" cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    cornerRadius={10}
                    dataKey="value"
                 >
                    {statsData.statusData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                 </Pie>
                 <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                 <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }} />
              </PieChart>
           </ResponsiveContainer>
        </ChartCard>

        {/* Request Type Donut */}
        <ChartCard title="ประเภทคำขอ" sub="Request Category Distribution">
           <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                 <Pie
                    data={statsData.typeData}
                    cx="50%" cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    cornerRadius={10}
                    dataKey="value"
                 >
                    {statsData.typeData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                 </Pie>
                 <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                 <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }} />
              </PieChart>
           </ResponsiveContainer>
        </ChartCard>

        {/* Assignee Bar Chart */}
        <ChartCard title="ผู้รับผิดชอบ" sub="Who received the most work">
           <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statsData.assigneeData} layout="vertical" margin={{ left: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                 <XAxis type="number" hide />
                 <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={120}
                    tick={{fontSize: 10, fontWeight: 800, fill: '#64748b'}}
                 />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                 <Bar dataKey="value" fill="#3b82f6" radius={[0, 10, 10, 0]} barSize={24} />
              </BarChart>
           </ResponsiveContainer>
        </ChartCard>

        {/* Department Bar Chart */}
        <ChartCard title="หน่วยงานที่ขอสูงสุด" sub="Top Departments Activity">
           <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statsData.deptData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 9, fontWeight: 800, fill: '#64748b'}}
                 />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                 <Bar dataKey="value" fill="#10b981" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
           </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}

function ChartCard({ title, sub, children }: any) {
  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 group">
       <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-emerald-500 rounded-full" />
          <div>
             <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">{title}</h3>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{sub}</p>
          </div>
       </div>
       <div className="h-[300px]">
          {children}
       </div>
    </div>
  );
}
