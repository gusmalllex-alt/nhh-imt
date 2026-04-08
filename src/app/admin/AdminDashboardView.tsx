"use client";

import { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LabelList
} from "recharts";
import { 
  FileText, Users, Activity, Layers, CheckCircle2, Clock, AlertCircle
} from "lucide-react";

// Standard Colors
const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#64748b"];

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
    // 1. Status Distribution
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

    // 3. Assignee Workload
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
    <div className="space-y-6 animate-in fade-in duration-500 font-sans pb-10">
      
      {/* Header Info Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-[#0f172a] p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-emerald-900/20 border border-emerald-700/30 relative overflow-hidden group">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 group-hover:scale-105 transition-transform duration-1000" />
         <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row flex-wrap items-start md:items-center gap-8 lg:gap-14">
            <div className="flex items-center gap-6 md:border-r border-emerald-700/50 md:pr-10 lg:pr-14">
               <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner border border-white/10 ring-1 ring-black/5 group-hover:scale-110 transition-transform duration-500">
                  <FileText className="w-8 h-8" />
               </div>
               <div>
                  <div className="text-5xl font-black text-white leading-none drop-shadow-md tracking-tight">{statsData.total}</div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> คำขอรวมทั้งหมด</div>
               </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
               {[
                  { name: "รอดำเนินการ", label: "รอดำเนินการ", bg: "bg-amber-500/20 text-amber-300 border-amber-500/30", dot: "bg-amber-400" },
                  { name: "รับเรื่อง", label: "รับเรื่อง", bg: "bg-sky-500/20 text-sky-300 border-sky-500/30", dot: "bg-sky-400" },
                  { name: "กำลังดำเนินการ", label: "กำลังทำงาน", bg: "bg-blue-600/20 text-blue-300 border-blue-600/30", dot: "bg-blue-400" },
                  { name: "ขอข้อมูลเพิ่ม", label: "ขอข้อมูลเพิ่ม", bg: "bg-purple-600/20 text-purple-300 border-purple-600/30", dot: "bg-purple-400" },
                  { name: "ดำเนินการเรียบร้อย", label: "เสร็จสิ้น", bg: "bg-emerald-600/20 text-emerald-300 border-emerald-600/30", dot: "bg-emerald-400" },
                  { name: "ยกเลิก", label: "ยกเลิก", bg: "bg-rose-600/20 text-rose-300 border-rose-600/30", dot: "bg-rose-400" }
               ].map((s, idx) => (
                  <div key={idx} className={`${s.bg} px-5 py-3 rounded-2xl flex flex-col gap-1 border backdrop-blur-sm shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}>
                     <span className="text-3xl font-black leading-none drop-shadow-sm">
                        {statsData.statusData.find(st => st.name === s.name)?.value || 0}
                     </span>
                     <div className="flex items-center gap-2 opacity-90 mt-1">
                        <span className={`w-2 h-2 rounded-full ${s.dot} shadow-[0_0_10px_currentColor] animate-pulse`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* Charts Grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Donut */}
        <ChartCard title="สัดส่วนสถานะงาน" sub="Work Status Distribution">
           <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                 <Pie
                    data={statsData.statusData}
                    cx="50%" cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    cornerRadius={6}
                    dataKey="value"
                    label={({ name, value }) => `${value}`}
                 >
                    {statsData.statusData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                 </Pie>
                 <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.1)'}} />
                 <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }} />
              </PieChart>
           </ResponsiveContainer>
        </ChartCard>

        {/* Request Type Donut */}
        <ChartCard title="ประเภทข้อมูลที่ขอ" sub="Request Category Distribution">
           <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                 <Pie
                    data={statsData.typeData}
                    cx="50%" cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    cornerRadius={6}
                    dataKey="value"
                    label={({ name, value }) => `${value}`}
                 >
                    {statsData.typeData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                 </Pie>
                 <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.1)'}} />
                 <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }} />
              </PieChart>
           </ResponsiveContainer>
        </ChartCard>

        {/* Assignee Bar Chart */}
        <ChartCard title="เจ้าหน้าที่ผู้รับงาน" sub="Staff Workload Distribution">
           <ResponsiveContainer width="100%" height={280}>
               <BarChart data={statsData.assigneeData} layout="vertical" margin={{ left: 20, right: 30 }}>
                 <defs>
                    <linearGradient id="colorAssignee" x1="0" y1="0" x2="1" y2="0">
                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={1}/>
                       <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.8}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                 <XAxis type="number" hide />
                 <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={110}
                    tick={{fontSize: 9, fontWeight: 700, fill: '#475569'}}
                 />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
                 <Bar dataKey="value" fill="url(#colorAssignee)" radius={[0, 8, 8, 0]} barSize={24}>
                    <LabelList dataKey="value" position="right" style={{ fontSize: '11px', fontWeight: 900, fill: '#1d4ed8' }} />
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </ChartCard>

        {/* Department Bar Chart */}
        <ChartCard title="หน่วยงานที่มีการขอสูงสุด" sub="Top 5 Departments Usage">
           <ResponsiveContainer width="100%" height={280}>
               <BarChart data={statsData.deptData}>
                 <defs>
                    <linearGradient id="colorDept" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={1}/>
                       <stop offset="95%" stopColor="#047857" stopOpacity={0.8}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 9, fontWeight: 700, fill: '#475569'}}
                 />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
                 <Bar dataKey="value" fill="url(#colorDept)" radius={[8, 8, 0, 0]} barSize={40}>
                    <LabelList dataKey="value" position="top" style={{ fontSize: '12px', fontWeight: 900, fill: '#047857' }} />
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}

function ChartCard({ title, sub, children }: any) {
  return (
    <div className="bg-white/90 backdrop-blur-3xl p-6 md:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 group">
       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110">
          <Activity className="w-32 h-32 rotate-12" />
       </div>
       <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full shadow-inner" />
          <div>
             <h3 className="text-xl font-black text-slate-900 leading-none tracking-tight">{title}</h3>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">{sub}</p>
          </div>
       </div>
       <div className="h-[300px] relative z-10">
          {children}
       </div>
    </div>
  );
}
