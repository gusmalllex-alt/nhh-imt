"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, Calendar as CalendarIcon, RefreshCw, ChevronLeft, ChevronRight, 
  Home, Activity, FileText, CheckCircle2, Clock, AlertCircle, PlayCircle, XCircle,
  FileDown
} from "lucide-react";
import { getRequests } from "../actions/adminActions";

export default function StatusTracking() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getRequests();
    if (result.success) {
      setRequests(result.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  // Status Style Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ดำเนินการเรียบร้อย":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 font-bold text-xs ring-1 ring-emerald-300"><CheckCircle2 className="w-3.5 h-3.5" /> เรียบร้อย</span>;
      case "รอดำเนินการ":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-700 font-bold text-xs ring-1 ring-amber-300"><Clock className="w-3.5 h-3.5" /> รอดำเนินการ</span>;
      case "รับเรื่อง":
      case "กำลังดำเนินการ":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 font-bold text-xs ring-1 ring-blue-300"><PlayCircle className="w-3.5 h-3.5" /> {status}</span>;
      case "ขอข้อมูลเพิ่ม":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/80 text-purple-700 font-bold text-xs ring-1 ring-purple-300"><AlertCircle className="w-3.5 h-3.5" /> ข้อมูลเพิ่ม</span>;
      case "ยกเลิก":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-700 font-bold text-xs ring-1 ring-rose-300"><XCircle className="w-3.5 h-3.5" /> ยกเลิก</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100/80 text-gray-700 font-bold text-xs ring-1 ring-gray-300">{status}</span>;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    if (urgency === "ด่วนมาก") return "text-rose-600 font-extrabold";
    if (urgency === "ด่วน") return "text-orange-600 font-bold";
    return "text-emerald-600 font-semibold";
  };

  const filteredRequests = requests.filter(req => 
    req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.requester_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 selection:bg-emerald-200 pb-12">
      {/* MOPH Green Header Background */}
      <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-emerald-900 to-emerald-800 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-emerald-100 hover:text-white transition-colors mb-2 text-sm font-medium">
              <Home className="w-4 h-4" /> กลับสู่หน้าหลัก
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Activity className="w-8 h-8 text-emerald-300" /> ติดตามสถานะคำขอ
            </h1>
          </div>
          
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white font-bold transition-all shadow-sm ring-1 ring-white/30"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            รีเฟรชข้อมูล
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "คำขอทั้งหมด", count: requests.length, color: "border-slate-400 bg-white", text: "text-slate-800" },
            { label: "รอดำเนินการ", count: requests.filter(r => r.status === "รอดำเนินการ").length, color: "border-amber-400 bg-amber-50", text: "text-amber-700" },
            { label: "ขอข้อมูลเพิ่ม", count: requests.filter(r => r.status === "ขอข้อมูลเพิ่ม").length, color: "border-purple-400 bg-purple-50", text: "text-purple-700" },
            { label: "รับเรื่อง", count: requests.filter(r => r.status === "รับเรื่อง").length, color: "border-blue-400 bg-blue-50", text: "text-blue-700" },
            { label: "เรียบร้อย", count: requests.filter(r => r.status === "ดำเนินการเรียบร้อย").length, color: "border-emerald-400 bg-emerald-50", text: "text-emerald-700" },
            { label: "ยกเลิก", count: requests.filter(r => r.status === "ยกเลิก").length, color: "border-rose-400 bg-rose-50", text: "text-rose-700" }
          ].map((card, idx) => (
            <div key={idx} className={`rounded-2xl border-l-8 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center ${card.color}`}>
              <div className={`text-4xl font-black mb-1 ${card.text}`}>{card.count}</div>
              <div className="text-xs sm:text-sm font-bold text-gray-600">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Box */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Filters Area */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 space-y-4">
            
            {/* Search Input */}
            <div className="relative max-w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                placeholder="ค้นหาจากชื่อข้อมูล, ผู้ขอ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-black text-gray-500 uppercase tracking-wider">วันที่แจ้ง</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-black text-gray-500 uppercase tracking-wider">ความเร่งด่วน</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-black text-gray-500 uppercase tracking-wider w-[20%]">ชื่อข้อมูล</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-black text-gray-500 uppercase tracking-wider w-[25%]">เงื่อนไข / รายละเอียด</th>
                    <th scope="col" className="px-4 py-3.5 text-center text-xs font-black text-gray-500 uppercase tracking-wider">ไฟล์</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-black text-gray-500 uppercase tracking-wider">ผู้ขอ / หน่วยงาน</th>
                    <th scope="col" className="px-4 py-3.5 text-left text-xs font-black text-gray-500 uppercase tracking-wider">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-500 font-bold">
                        กำลังโหลดข้อมูล...
                      </td>
                    </tr>
                  ) : filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-500 font-bold">
                        ไม่พบข้อมูล
                      </td>
                    </tr>
                  ) : filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-emerald-50/30 transition-colors text-sm">
                      <td className="px-4 py-4 whitespace-nowrap font-semibold text-gray-700">
                        {new Date(req.created_at).toLocaleDateString('th-TH')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={getUrgencyColor(req.urgency)}>{req.urgency}</span>
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-900 border-l border-r border-gray-50">
                        {req.title}
                      </td>
                      <td className="px-4 py-4 text-gray-600 border-r border-gray-50">
                        <span className="line-clamp-2" title={req.condition}>{req.condition}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        {req.file_url ? (
                          <a 
                            href={req.file_url} 
                            target="_blank"
                            className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 p-2 rounded-full transition-colors inline-block" 
                            title="ดาวน์โหลดไฟล์"
                          >
                            <FileDown className="w-5 h-5 mx-auto" />
                          </a>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-bold text-gray-800">{req.requester_name}</div>
                        <div className="text-emerald-600 font-medium text-xs mt-0.5">{req.department}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getStatusBadge(req.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

