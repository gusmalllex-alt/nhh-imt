"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LabelList, RadialBarChart, RadialBar
} from "recharts";
import {
  FileText, Activity, Zap, Clock, RefreshCw, TrendingUp, Target, BarChart2
} from "lucide-react";

/* ── Palette ─────────────────────────────────────────── */
const STATUS_COLORS: Record<string, string> = {
  "รอดำเนินการ":       "#f59e0b",
  "รับเรื่อง":         "#38bdf8",
  "กำลังดำเนินการ":    "#3b82f6",
  "ขอข้อมูลเพิ่ม":     "#a78bfa",
  "ดำเนินการเรียบร้อย":"#10b981",
  "ยกเลิก":            "#f43f5e",
};

const URGENCY_COLORS: Record<string, string> = {
  "ปกติ (60 วัน)":   "#10b981",
  "ด่วน (30 วัน)":   "#f59e0b",
  "ด่วนมาก (14 วัน)":"#f43f5e",
};

const FREQ_COLORS = ["#6366f1","#3b82f6","#06b6d4","#10b981","#f59e0b","#f43f5e"];
const TYPE_COLORS = ["#6366f1","#10b981","#f59e0b"];

const ALL_STATUSES = [
  "รอดำเนินการ","รับเรื่อง","กำลังดำเนินการ",
  "ขอข้อมูลเพิ่ม","ดำเนินการเรียบร้อย","ยกเลิก",
];

const STAT_CARDS = [
  { name: "รอดำเนินการ",       label: "รอดำเนินการ",  color: "from-amber-500/20 to-amber-400/10  border-amber-400/30  text-amber-300",  dot: "bg-amber-400",   glow: "shadow-amber-500/20" },
  { name: "รับเรื่อง",         label: "รับเรื่อง",    color: "from-sky-500/20   to-sky-400/10    border-sky-400/30    text-sky-300",    dot: "bg-sky-400",     glow: "shadow-sky-500/20" },
  { name: "กำลังดำเนินการ",    label: "กำลังทำงาน",  color: "from-blue-600/20  to-blue-500/10   border-blue-500/30   text-blue-300",   dot: "bg-blue-400",    glow: "shadow-blue-500/20" },
  { name: "ขอข้อมูลเพิ่ม",     label: "ขอข้อมูลเพิ่ม",color:"from-purple-600/20 to-purple-500/10 border-purple-500/30 text-purple-300", dot: "bg-purple-400",  glow: "shadow-purple-500/20" },
  { name: "ดำเนินการเรียบร้อย",label: "เสร็จสิ้น",   color: "from-emerald-600/20 to-emerald-500/10 border-emerald-500/30 text-emerald-300", dot: "bg-emerald-400", glow: "shadow-emerald-500/20" },
  { name: "ยกเลิก",            label: "ยกเลิก",      color: "from-rose-600/20  to-rose-500/10   border-rose-500/30   text-rose-300",   dot: "bg-rose-400",    glow: "shadow-rose-500/20" },
];

/* ── Custom Tooltip ────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl">
      {label && <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-black" style={{ color: p.fill || p.color || "#10b981" }}>
          {p.name || p.dataKey}: <span className="text-white">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ── Main Component ────────────────────────────────────── */
export default function AdminDashboardView({ requests }: { requests: any[] }) {

  const statsData = useMemo(() => {
    // 1. Status
    const statusCounts: Record<string, number> = {};
    ALL_STATUSES.forEach(s => statusCounts[s] = 0);
    requests.forEach(r => {
      const s = r.status || "รอดำเนินการ";
      if (s in statusCounts) statusCounts[s]++;
    });
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({
      name, value, fill: STATUS_COLORS[name] ?? "#64748b"
    }));

    // 2. Type
    const typeMap: Record<string, number> = {};
    requests.forEach(r => { const t = r.type || "อื่นๆ"; typeMap[t] = (typeMap[t] || 0) + 1; });
    const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

    // 3. Assignee
    const assigneeMap: Record<string, number> = {};
    requests.forEach(r => {
      const a = r.assigned_to || "รอมอบหมาย";
      assigneeMap[a] = (assigneeMap[a] || 0) + 1;
    });
    const assigneeData = Object.entries(assigneeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 4. Top Departments
    const deptMap: Record<string, number> = {};
    requests.forEach(r => { const d = r.department || "ไม่ระบุ"; deptMap[d] = (deptMap[d] || 0) + 1; });
    const deptData = Object.entries(deptMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // 5. Urgency  ← NEW
    const urgencyMap: Record<string, number> = {
      "ปกติ (60 วัน)":   0,
      "ด่วน (30 วัน)":   0,
      "ด่วนมาก (14 วัน)":0,
    };
    requests.forEach(r => {
      const raw = r.urgency || "";
      if (raw.includes("60") || raw === "ปกติ")         urgencyMap["ปกติ (60 วัน)"]++;
      else if (raw.includes("30") || raw === "ด่วน")    urgencyMap["ด่วน (30 วัน)"]++;
      else if (raw.includes("14") || raw === "ด่วนมาก") urgencyMap["ด่วนมาก (14 วัน)"]++;
    });
    const urgencyData = Object.entries(urgencyMap).map(([name, value]) => ({
      name, value, fill: URGENCY_COLORS[name] ?? "#64748b"
    }));

    // 6. Frequency  ← NEW
    const freqOrder = ["ครั้งเดียว","รายวัน","รายสัปดาห์","รายเดือน","รายไตรมาส","รายปี"];
    const freqMap: Record<string, number> = {};
    freqOrder.forEach(f => freqMap[f] = 0);
    requests.forEach(r => {
      const raw = r.frequency || "";
      if (raw.includes("one-time") || raw.includes("ครั้งเดียว")) freqMap["ครั้งเดียว"]++;
      else if (raw.includes("day")   || raw.includes("รายวัน"))     freqMap["รายวัน"]++;
      else if (raw.includes("week")  || raw.includes("สัปดาห์"))    freqMap["รายสัปดาห์"]++;
      else if (raw.includes("month") || raw.includes("รายเดือน"))   freqMap["รายเดือน"]++;
      else if (raw.includes("quarter")|| raw.includes("ไตรมาส"))    freqMap["รายไตรมาส"]++;
      else if (raw.includes("year")  || raw.includes("รายปี"))      freqMap["รายปี"]++;
    });
    const freqData = freqOrder.map(name => ({ name, value: freqMap[name] ?? 0 }));

    return { statusData, typeData, assigneeData, deptData, urgencyData, freqData, total: requests.length };
  }, [requests]);

  /* Completion rate */
  const doneCount  = statsData.statusData.find(s => s.name === "ดำเนินการเรียบร้อย")?.value ?? 0;
  const completion = statsData.total > 0 ? Math.round((doneCount / statsData.total) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans pb-10">

      {/* ── Hero Banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#003820] via-[#004d30] to-[#0f172a] shadow-2xl shadow-emerald-900/30 border border-emerald-700/20 p-8 md:p-10">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.08]" />
        {/* Glow blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">

          {/* Total block */}
          <div className="flex items-center gap-6 shrink-0 lg:border-r border-emerald-700/40 lg:pr-12">
            <div className="w-18 h-18 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                  <FileText className="w-8 h-8 text-emerald-400" />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              </div>
            </div>
            <div>
              <div className="text-6xl font-black text-white leading-none tracking-tighter tabular-nums drop-shadow-lg">
                {statsData.total}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em]">คำขอรวมทั้งหมด</span>
              </div>
              {/* completion bar */}
              <div className="mt-3 flex items-center gap-3">
                <div className="h-1.5 w-28 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-1000"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <span className="text-[11px] font-black text-emerald-300">{completion}% เสร็จสิ้น</span>
              </div>
            </div>
          </div>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-3">
            {STAT_CARDS.map((s, idx) => {
              const count = statsData.statusData.find(st => st.name === s.name)?.value ?? 0;
              return (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${s.color} border backdrop-blur-sm
                    px-5 py-4 rounded-2xl flex flex-col gap-1.5
                    shadow-lg ${s.glow}
                    hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-default min-w-[90px]`}
                >
                  <span className="text-4xl font-black leading-none drop-shadow tabular-nums">{count}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${s.dot} shadow-[0_0_6px_currentColor] animate-pulse`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 leading-none">{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Charts Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Status Donut */}
        <ChartCard title="สัดส่วนสถานะงาน" sub="Work Status Distribution" icon={<Target className="w-5 h-5 text-emerald-500" />} accent="from-emerald-500 to-teal-500">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statsData.statusData}
                cx="50%" cy="50%"
                innerRadius={68} outerRadius={100}
                paddingAngle={3} cornerRadius={8}
                dataKey="value"
              >
                {statsData.statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom" height={40}
                wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Urgency Radial ← NEW */}
        <ChartCard title="จำแนกตามความเร่งด่วน" sub="Request Urgency Level" icon={<Zap className="w-5 h-5 text-amber-500" />} accent="from-amber-500 to-rose-500">
          <ResponsiveContainer width="100%" height={280}>
            <RadialBarChart
              cx="50%" cy="55%"
              innerRadius="25%" outerRadius="90%"
              data={statsData.urgencyData}
              startAngle={180} endAngle={-180}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                background={{ fill: "#f1f5f9" }}
                label={{ position: "insideStart", fill: "#fff", fontSize: 12, fontWeight: 900 }}
              >
                {statsData.urgencyData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </RadialBar>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom" height={40}
                wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Frequency Bar ← NEW */}
        <ChartCard title="รอบการใช้ข้อมูล" sub="Data Usage Frequency" icon={<Clock className="w-5 h-5 text-indigo-500" />} accent="from-indigo-500 to-blue-500">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statsData.freqData} barSize={36}>
              <defs>
                {statsData.freqData.map((_, i) => (
                  <linearGradient key={i} id={`freqGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={FREQ_COLORS[i % FREQ_COLORS.length]} stopOpacity={1} />
                    <stop offset="95%" stopColor={FREQ_COLORS[i % FREQ_COLORS.length]} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 8 }} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {statsData.freqData.map((_, i) => (
                  <Cell key={i} fill={`url(#freqGrad${i})`} />
                ))}
                <LabelList dataKey="value" position="top" style={{ fontSize: '12px', fontWeight: 900, fill: '#334155' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Request Type Donut */}
        <ChartCard title="ประเภทข้อมูลที่ขอ" sub="Request Category Distribution" icon={<BarChart2 className="w-5 h-5 text-purple-500" />} accent="from-purple-500 to-indigo-500">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statsData.typeData}
                cx="50%" cy="50%"
                innerRadius={68} outerRadius={100}
                paddingAngle={3} cornerRadius={8}
                dataKey="value"
                label={({ name, value }) => `${value}`}
              >
                {statsData.typeData.map((_, i) => (
                  <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={40} wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Assignee Horizontal Bar */}
        <ChartCard title="เจ้าหน้าที่ผู้รับงาน" sub="Staff Workload Distribution" icon={<RefreshCw className="w-5 h-5 text-blue-500" />} accent="from-blue-500 to-cyan-500">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statsData.assigneeData} layout="vertical" margin={{ left: 8, right: 36 }}>
              <defs>
                <linearGradient id="gradAssignee" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={115}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 8 }} />
              <Bar dataKey="value" fill="url(#gradAssignee)" radius={[0, 10, 10, 0]} barSize={22}>
                <LabelList dataKey="value" position="right" style={{ fontSize: '12px', fontWeight: 900, fill: '#1d4ed8' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 6. Department Bar */}
        <ChartCard title="หน่วยงานที่มีการขอสูงสุด" sub="Top 5 Departments Usage" icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} accent="from-emerald-500 to-green-400">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={statsData.deptData} barSize={36}>
              <defs>
                <linearGradient id="gradDept" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={1} />
                  <stop offset="95%" stopColor="#047857" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#475569' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 8 }} />
              <Bar dataKey="value" fill="url(#gradDept)" radius={[10, 10, 0, 0]}>
                <LabelList dataKey="value" position="top" style={{ fontSize: '12px', fontWeight: 900, fill: '#065f46' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}

/* ── ChartCard ─────────────────────────────────────────── */
function ChartCard({
  title, sub, children, icon, accent
}: {
  title: string; sub: string; children: React.ReactNode;
  icon?: React.ReactNode; accent?: string;
}) {
  return (
    <div className="group bg-white/90 backdrop-blur-3xl rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white/80 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-0.5">
      {/* Top gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accent ?? "from-emerald-400 to-teal-400"} opacity-80`} />
      {/* Subtle watermark */}
      <div className="absolute top-6 right-6 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
        <Activity className="w-28 h-28 rotate-12" />
      </div>

      <div className="p-6 md:p-8">
        {/* Card Header */}
        <div className="flex items-start gap-4 mb-6">
          {icon && (
            <div className={`w-10 h-10 bg-gradient-to-br ${accent ?? "from-emerald-400 to-teal-400"} bg-opacity-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 opacity-90`}>
              {icon}
            </div>
          )}
          <div className="flex flex-col justify-center">
            <h3 className="text-lg font-black text-slate-800 leading-tight tracking-tight">{title}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] mt-1">{sub}</p>
          </div>
        </div>

        {/* Chart area */}
        <div className="h-[280px]">{children}</div>
      </div>
    </div>
  );
}
