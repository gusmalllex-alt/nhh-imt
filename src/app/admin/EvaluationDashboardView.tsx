"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Star, Award, Sparkles, CheckCircle2, TrendingUp, Users, 
  MessageSquare, RefreshCw, Loader2, AlertCircle, HeartHandshake,
  FileText, Calendar, Building, ThumbsUp, ChevronRight
} from "lucide-react";
import { getEvaluations } from "../actions/adminActions";

interface EvaluationDashboardViewProps {
  requests?: any[];
}

export default function EvaluationDashboardView({ requests = [] }: EvaluationDashboardViewProps) {
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterScore, setFilterScore] = useState<number | null>(null);

  const fetchEvalData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEvaluations();
      if (res.success) {
        setEvaluations(res.data || []);
      } else {
        setError(res.message || "ไม่สามารถโหลดข้อมูลแบบประเมินได้");
      }
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvalData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchEvalData();
    setIsRefreshing(false);
  };

  // Completed requests count
  const completedRequestsCount = useMemo(() => {
    return requests.filter(r => r.status === "ดำเนินการเรียบร้อย").length;
  }, [requests]);

  // Calculations
  const stats = useMemo(() => {
    const total = evaluations.length;
    if (total === 0) {
      return {
        total: 0,
        avgOverall: 0,
        avgAccuracy: 0,
        avgCompleteness: 0,
        avgTimeliness: 0,
        responseRate: 0,
        scoreDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        deptStats: []
      };
    }

    let sumAcc = 0;
    let sumComp = 0;
    let sumTime = 0;
    let sumOverall = 0;
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const deptMap: Record<string, { count: number; sumScore: number }> = {};

    evaluations.forEach((ev) => {
      const acc = Number(ev.accuracy_score) || 0;
      const comp = Number(ev.completeness_score) || 0;
      const time = Number(ev.timeliness_score) || 0;
      const avg = (acc + comp + time) / 3;

      sumAcc += acc;
      sumComp += comp;
      sumTime += time;
      sumOverall += avg;

      const rounded = Math.min(5, Math.max(1, Math.round(avg)));
      dist[rounded] = (dist[rounded] || 0) + 1;

      const dept = ev.request?.department || "ไม่ระบุหน่วยงาน";
      if (!deptMap[dept]) {
        deptMap[dept] = { count: 0, sumScore: 0 };
      }
      deptMap[dept].count += 1;
      deptMap[dept].sumScore += avg;
    });

    const deptStats = Object.entries(deptMap)
      .map(([name, data]) => ({
        name,
        count: data.count,
        avg: (data.sumScore / data.count).toFixed(2)
      }))
      .sort((a, b) => Number(b.avg) - Number(a.avg))
      .slice(0, 5);

    const responseRate = completedRequestsCount > 0 
      ? Math.min(100, Math.round((total / completedRequestsCount) * 100)) 
      : 0;

    return {
      total,
      avgOverall: Number((sumOverall / total).toFixed(2)),
      avgAccuracy: Number((sumAcc / total).toFixed(2)),
      avgCompleteness: Number((sumComp / total).toFixed(2)),
      avgTimeliness: Number((sumTime / total).toFixed(2)),
      responseRate,
      scoreDistribution: dist,
      deptStats
    };
  }, [evaluations, completedRequestsCount]);

  const getScoreLevelText = (score: number) => {
    if (score >= 4.5) return { text: "ระดับยอดเยี่ยม", color: "text-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (score >= 3.5) return { text: "ระดับดีมาก", color: "text-blue-500", badge: "bg-blue-50 text-blue-700 border-blue-200" };
    if (score >= 2.5) return { text: "ระดับปานกลาง", color: "text-amber-500", badge: "bg-amber-50 text-amber-700 border-amber-200" };
    return { text: "ควรปรับปรุง", color: "text-rose-500", badge: "bg-rose-50 text-rose-700 border-rose-200" };
  };

  const filteredEvaluations = useMemo(() => {
    if (!filterScore) return evaluations;
    return evaluations.filter(ev => {
      const avg = Math.round((ev.accuracy_score + ev.completeness_score + ev.timeliness_score) / 3);
      return avg === filterScore;
    });
  }, [evaluations, filterScore]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] p-8 bg-white/80 backdrop-blur-3xl rounded-[2.5rem] border border-white shadow-xl">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-slate-600 font-bold">กำลังประมวลผลสถิติแบบประเมินความพึงพอใจ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-white rounded-[2.5rem] border border-rose-100 shadow-xl text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
        <h3 className="text-2xl font-black text-slate-900 mb-2">ไม่สามารถโหลดข้อมูลสถิติได้</h3>
        <p className="text-slate-500 font-medium mb-6 max-w-md">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> ลองใหม่อีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Banner with Key Highlights */}
      <div className="relative bg-gradient-to-br from-[#003820] via-[#064e3b] to-[#0f172a] rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl overflow-hidden border border-white/10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Satisfaction Evaluation Analytics
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              รายงานสรุปผลความพึงพอใจการให้บริการ
            </h1>
            <p className="text-emerald-100/90 text-sm font-medium mt-2 max-w-2xl leading-relaxed">
              สถิติการประเมินการขอรับบริการข้อมูลสารสนเทศ แดชบอร์ด รายงาน และตัวชี้วัด กลุ่มงานสุขภาพดิจิทัล โรงพยาบาลหนองหาน
            </p>
          </div>

          <button
            onClick={handleRefresh}
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl font-bold text-sm text-white transition-all shadow-xl active:scale-95 flex items-center gap-2.5 shrink-0 group"
          >
            <RefreshCw className={`w-4 h-4 text-amber-300 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
            <span>อัปเดตข้อมูล</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Main Overall Rating Card */}
        <div className="sm:col-span-2 lg:col-span-2 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-[2rem] p-6 shadow-xl shadow-amber-600/20 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 opacity-15 pointer-events-none transform translate-x-4 -translate-y-4">
            <Star className="w-48 h-48 fill-white" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-amber-100">คะแนนความพึงพอใจรวม</span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 backdrop-blur-md text-white border border-white/30">
                {getScoreLevelText(stats.avgOverall).text}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <div className="text-5xl md:text-6xl font-black tracking-tight">{stats.avgOverall.toFixed(2)}</div>
              <div className="text-xl font-bold text-amber-200">/ 5.00</div>
            </div>
          </div>
          <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
            <div className="flex text-amber-200">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${s <= Math.round(stats.avgOverall) ? 'fill-white text-white' : 'text-white/40'}`}
                />
              ))}
            </div>
            <div className="text-xs font-black text-amber-100">
              จากผู้ประเมิน {stats.total} ราย
            </div>
          </div>
        </div>

        {/* 1. Accuracy Card */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[2rem] p-6 border border-white shadow-lg shadow-slate-200/50 flex flex-col justify-between hover:-translate-y-1 transition-all">
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">1. ด้านความถูกต้อง</div>
            <div className="text-3xl font-black text-slate-900 mt-2">{stats.avgAccuracy.toFixed(2)} <span className="text-xs text-slate-400 font-bold">/ 5</span></div>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${(stats.avgAccuracy / 5) * 100}%` }} />
            </div>
            <div className="text-[10px] font-bold text-emerald-600 mt-2 flex justify-between">
              <span>ความถูกต้อง</span>
              <span>{((stats.avgAccuracy / 5) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* 2. Completeness Card */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[2rem] p-6 border border-white shadow-lg shadow-slate-200/50 flex flex-col justify-between hover:-translate-y-1 transition-all">
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">2. ด้านความครบถ้วน</div>
            <div className="text-3xl font-black text-slate-900 mt-2">{stats.avgCompleteness.toFixed(2)} <span className="text-xs text-slate-400 font-bold">/ 5</span></div>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${(stats.avgCompleteness / 5) * 100}%` }} />
            </div>
            <div className="text-[10px] font-bold text-blue-600 mt-2 flex justify-between">
              <span>ความสมบูรณ์</span>
              <span>{((stats.avgCompleteness / 5) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* 3. Timeliness Card */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[2rem] p-6 border border-white shadow-lg shadow-slate-200/50 flex flex-col justify-between hover:-translate-y-1 transition-all">
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">3. ด้านความทันเวลา</div>
            <div className="text-3xl font-black text-slate-900 mt-2">{stats.avgTimeliness.toFixed(2)} <span className="text-xs text-slate-400 font-bold">/ 5</span></div>
          </div>
          <div className="mt-4">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: `${(stats.avgTimeliness / 5) * 100}%` }} />
            </div>
            <div className="text-[10px] font-bold text-purple-600 mt-2 flex justify-between">
              <span>ความรวดเร็ว</span>
              <span>{((stats.avgTimeliness / 5) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Star Rating Breakdown */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[2rem] p-8 border border-white shadow-lg shadow-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-none">การกระจายตัวของระดับคะแนน</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Score Distribution</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {[5, 4, 3, 2, 1].map((score) => {
              const count = stats.scoreDistribution[score] || 0;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <button
                  key={score}
                  onClick={() => setFilterScore(filterScore === score ? null : score)}
                  className={`w-full flex items-center gap-3 text-left p-2 rounded-xl transition-all ${
                    filterScore === score ? 'bg-amber-50 ring-2 ring-amber-400' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1 w-16 shrink-0 text-xs font-black text-slate-700">
                    <span>{score}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  </div>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-16 text-right shrink-0">
                    <span className="text-xs font-black text-slate-800">{count}</span>
                    <span className="text-[10px] font-medium text-slate-400 ml-1">({pct}%)</span>
                  </div>
                </button>
              );
            })}
          </div>

          {filterScore && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="font-bold text-amber-700">กำลังกรอง: {filterScore} ดาว</span>
              <button
                onClick={() => setFilterScore(null)}
                className="text-slate-400 hover:text-slate-700 font-bold underline"
              >
                ล้างตัวกรอง
              </button>
            </div>
          )}
        </div>

        {/* Top Departments Overview */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[2rem] p-8 border border-white shadow-lg shadow-slate-200/50 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-none">ความพึงพอใจจำแนกตามหน่วยงาน</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Satisfaction by Department</p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Top Departments
            </span>
          </div>

          {stats.deptStats.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
              ยังไม่มีข้อมูลการประเมินจากหน่วยงาน
            </div>
          ) : (
            <div className="space-y-3">
              {stats.deptStats.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-emerald-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-xs text-slate-700">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-800">{d.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 mt-0.5">จำนวนการประเมิน: {d.count} ครั้ง</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-base font-black text-amber-600">{d.avg}</div>
                      <div className="text-[9px] font-black text-slate-400 uppercase">Avg Score</div>
                    </div>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Feed of Suggestions & Responses */}
      <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white shadow-2xl shadow-slate-200/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                รายการประเมินและข้อเสนอแนะล่าสุด
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                Feedback & Suggestions Stream ({filteredEvaluations.length} รายการ)
              </p>
            </div>
          </div>
        </div>

        {filteredEvaluations.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Star className="w-8 h-8" />
            </div>
            <h4 className="text-base font-black text-slate-700">ยังไม่พบข้อมูลการประเมิน</h4>
            <p className="text-xs text-slate-400 font-bold mt-1">เมื่อผู้ใช้งานส่งแบบประเมิน ข้อมูลและข้อเสนอแนะจะปรากฏที่นี่</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvaluations.map((ev) => {
              const overall = ((ev.accuracy_score + ev.completeness_score + ev.timeliness_score) / 3).toFixed(1);
              return (
                <div
                  key={ev.id}
                  className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header of Item */}
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md uppercase tracking-wider border border-emerald-100">
                          {ev.request?.department || "หน่วยงาน"}
                        </span>
                        <h4 className="text-base font-black text-slate-900 mt-2 line-clamp-1">
                          {ev.request?.report_name || "คำขอรับบริการข้อมูล"}
                        </h4>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">
                          ผู้ขอ: <span className="font-bold text-slate-700">{ev.request?.requester_name || "-"}</span>
                        </div>
                      </div>
                      <div className="bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200 text-center shrink-0">
                        <div className="text-base font-black text-amber-600 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                          {overall}
                        </div>
                        <div className="text-[8px] font-black text-amber-800/60 uppercase">คะแนนรวม</div>
                      </div>
                    </div>

                    {/* Breakdown Scores */}
                    <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-slate-200/60 bg-white/60 rounded-xl p-2 text-center text-xs">
                      <div>
                        <div className="text-[9px] font-bold text-slate-400">1. ความถูกต้อง</div>
                        <div className="font-black text-slate-800 mt-0.5">{ev.accuracy_score}/5 ⭐</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400">2. ความครบถ้วน</div>
                        <div className="font-black text-slate-800 mt-0.5">{ev.completeness_score}/5 ⭐</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400">3. ความทันเวลา</div>
                        <div className="font-black text-slate-800 mt-0.5">{ev.timeliness_score}/5 ⭐</div>
                      </div>
                    </div>

                    {/* Suggestion Text */}
                    {ev.suggestion ? (
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                        <span className="font-black text-amber-600 block mb-1">💬 ข้อเสนอแนะ:</span>
                        "{ev.suggestion}"
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic py-1">
                        - ไม่มีข้อเสนอแนะเพิ่มเติม -
                      </div>
                    )}
                  </div>

                  {/* Footer date */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(ev.created_at).toLocaleDateString('th-TH', { dateStyle: 'medium' })}
                    </span>
                    <span>IMT EVALUATION</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
