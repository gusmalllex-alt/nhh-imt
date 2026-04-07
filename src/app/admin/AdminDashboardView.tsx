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
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
         <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-4 border-r border-slate-100 pr-8">
               <div className="w-11 h-11 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
                  <FileText className="w-5 h-5" />
               </div>
               <div>
                  <div className="text-2xl font-bold text-slate-900 leading-none">{statsData.total}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">คำขอรวมทั้งหมด</div>
               </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
               {[
                  { name: "รอดำเนินการ", label: "รอดำเนินการ", bg: "bg-amber-500" },
                  { name: "รับเรื่อง", label: "รับเรื่อง", bg: "bg-sky-500" },
                  { name: "กำลังดำเนินการ", label: "กำลังทำงาน", bg: "bg-blue-600" },
                  { name: "ขอข้อมูลเพิ่ม", label: "ขอข้อมูลเพิ่ม", bg: "bg-purple-600" },
                  { name: "ดำเนินการเรียบร้อย", label: "เสร็จสิ้น", bg: "bg-emerald-600" },
                  { name: "ยกเลิก", label: "ยกเลิก", bg: "bg-rose-600" }
               ].map((s, idx) => (
                  <div key={idx} className={`${s.bg} px-3 py-1.5 rounded-lg flex items-center gap-2 border border-black/5 shadow-sm`}>
                     <span className="text-white font-bold text-sm">
                        {statsData.statusData.find(st => st.name === s.name)?.value || 0}
                     </span>
                     <span className="text-white text-[9px] font-bold uppercase tracking-tighter opacity-90">{s.label}</span>
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
              <BarChart data={statsData.assigneeData} layout="vertical" margin={{ left: 20 }}>
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
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.1)'}} />
                 <Bar dataKey="value" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={20}>
                    <LabelList dataKey="value" position="right" style={{ fontSize: '10px', fontWeight: 800, fill: '#3b82f6' }} />
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </ChartCard>

        {/* Department Bar Chart */}
        <ChartCard title="หน่วยงานที่มีการขอสูงสุด" sub="Top 5 Departments Usage">
           <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statsData.deptData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 9, fontWeight: 700, fill: '#475569'}}
                 />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.1)'}} />
                 <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} barSize={35}>
                    <LabelList dataKey="value" position="top" style={{ fontSize: '10px', fontWeight: 800, fill: '#10b981' }} />
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 group">
       <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 bg-emerald-600 rounded-full" />
          <div>
             <h3 className="text-base font-bold text-slate-900 leading-none">{title}</h3>
             <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">{sub}</p>
          </div>
       </div>
       <div className="h-[280px]">
          {children}
       </div>
    </div>
  );
}
