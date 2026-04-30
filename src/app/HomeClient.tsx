"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FileUp, Send, CheckCircle2, Building, Phone, Mail, 
  User, FileText, AlertCircle, Calendar, PieChart, LayoutDashboard, 
  Zap, Clock, Timer, Sparkles, ShieldAlert, Activity, ShieldCheck, HeartPulse
} from "lucide-react";
import { submitRequestAction } from "./actions/submitRequest";
import logo from "../../public/nhh.png";

export default function HomeClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("");
  const [selectedFrequency, setSelectedFrequency] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedType || !selectedUrgency) {
      alert("กรุณาเลือกประเภทข้อมูล และ ความเร่งด่วน");
      return;
    }
    
    const form = e.currentTarget;
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(form);
      const result = await submitRequestAction(formData);

      setIsSubmitting(false);

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 5000);
        form.reset();
        setSelectedType("");
        setSelectedUrgency("");
        setSelectedFileName(null);
      } else {
        alert("ข้อผิดพลาด: " + result.message);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      console.error("Submission Crash:", err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ: " + (err.message || "Unknown error"));
    }
  };

  const dataTypes = [
    { id: 'ตัวชี้วัด', label: 'ตัวชี้วัด (KPIs)', emoji: '📊', desc: 'ข้อมูลตัวชี้วัด และสถิติเปรียบเทียบตาราง' },
    { id: 'รายงาน', label: 'รายงาน (Reports)', emoji: '📋', desc: 'แฟ้มตารางข้อมูลดิบ หรือสรุปผลต่างๆ' },
    { id: 'แดชบอร์ด', label: 'แดชบอร์ด (Dashboard)', emoji: '🖥️', desc: 'ระบบกราฟสรุปภาพรวมสำหรับผู้บริหาร' }
  ];

  const urgencies = [
    { id: '60', label: 'ปกติ', time: 'ภายใน 60 วัน', emoji: '✅', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: '30', label: 'ด่วน', time: 'ภายใน 30 วัน', emoji: '⚠️', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: '14', label: 'ด่วนมาก', time: 'ภายใน 14 วัน', emoji: '🚨', color: 'bg-rose-50 text-rose-700 border-rose-200' }
  ];

  const frequencies = [
    { id: 'one-time', label: 'ครั้งเดียว', emoji: '🎯', desc: 'One-time' },
    { id: 'day', label: 'รายวัน', emoji: '☀️', desc: 'Daily' },
    { id: 'week', label: 'รายสัปดาห์', emoji: '📅', desc: 'Weekly' },
    { id: 'month', label: 'รายเดือน', emoji: '🗓️', desc: 'Monthly' },
    { id: 'quarter', label: 'รายไตรมาส', emoji: '📦', desc: 'Quarterly' },
    { id: 'year', label: 'รายปี', emoji: '🎉', desc: 'Annually' }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-200">
      
      {/* Header Section with Dark Emerald Gradient & Grid */}
      <header className="relative bg-gradient-to-b from-[#003820] to-[#004d30] pt-16 pb-32 px-4 overflow-hidden shadow-xl">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.15] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        
        {/* Status Activity Link */}
        <div className="absolute top-6 right-6 z-30">
          <Link href="/status" className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all font-bold shadow-lg group">
            <Activity className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
            <span className="text-sm">ติดตามสถานะ</span>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Logo */}
          <div className="mb-8 inline-block animate-float">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <Image 
                src={logo} 
                alt="โลโก้โรงพยาบาลหนองหาน (Nonghan Hospital Logo) ใช้สำหรับแบบฟอร์มคำขอสารสนเทศ" 
                width={100} 
                height={100} 
                className="object-contain w-24 h-24 drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight drop-shadow-md">
            แบบสำรวจความต้องการระบบสารสนเทศ
          </h1>
          <p className="text-emerald-100 text-xs md:text-sm font-bold mb-8 opacity-90">
             กลุ่มงานสุขภาพดิจิทัล โรงพยาบาลหนองหาน · จังหวัดอุดรธานี
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 -mt-20 pb-20 relative z-20">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Data Details */}
          <div className="bg-white rounded-[1.5rem] shadow-xl shadow-emerald-900/5 p-4 md:p-8 border border-slate-200 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-none">1. ข้อมูลที่ต้องการ</h2>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">IMT Data Specification</p>
              </div>
            </div>

            <div className="space-y-10">
              {/* Category Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                   📑 รายละเอียดที่ต้องการ <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {dataTypes.map((type) => (
                    <label 
                      key={type.id}
                      className={`relative flex flex-col items-center justify-center p-3 cursor-pointer rounded-xl border-2 transition-all duration-300 ${
                        selectedType === type.id 
                          ? 'bg-emerald-50 border-emerald-500 shadow-sm' 
                          : 'bg-slate-100/50 border-transparent hover:bg-slate-100'
                      }`}
                    >
                      <input 
                        type="radio" name="type" value={type.id} required className="sr-only"
                        onChange={(e) => setSelectedType(e.target.value)}
                      />
                      <span className="text-2xl mb-1">{type.emoji}</span>
                      <span className={`text-xs font-black ${selectedType === type.id ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Title & Condition */}
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                     📝 ชื่อเรื่อง / ชื่อรายงาน <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" name="title" required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none font-medium text-sm focus:border-emerald-500 focus:bg-white transition-all text-slate-900"
                    placeholder="ระบุสิ่งที่ต้องการ..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                     🏗️ เงื่อนไข / สูตรคำนวณ / รายละเอียด <span className="text-rose-500">*</span>
                  </label>
                  <textarea 
                    name="condition" rows={3} required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none font-medium text-sm focus:border-emerald-500 focus:bg-white transition-all text-slate-900 resize-none"
                    placeholder="อธิบายแฟ้มที่ต้องการดึง อย่างละเอียด..."
                  />
                </div>
              </div>

              {/* Urgency & Frequency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      ⚡ ระดับความเร่งด่วน <span className="text-rose-500">*</span>
                   </label>
                   <div className="flex flex-col gap-1.5">
                      {urgencies.map((u) => (
                        <label 
                          key={u.id}
                          className={`flex items-center justify-between p-2.5 cursor-pointer rounded-lg border-2 transition-all ${
                            selectedUrgency === u.id 
                              ? u.color 
                              : 'bg-slate-100/50 border-transparent hover:bg-slate-100'
                          }`}
                        >
                          <input 
                            type="radio" name="urgency" value={u.id} required className="sr-only"
                            onChange={(e) => setSelectedUrgency(e.target.value)}
                          />
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{u.emoji}</span>
                            <div className="flex flex-col leading-tight">
                              <span className="text-sm font-bold text-slate-800">{u.label}</span>
                              <span className="text-xs font-medium text-slate-500">{u.time}</span>
                            </div>
                          </div>
                          <div className={`w-3.5 h-3.5 rounded-full border-2 border-current flex items-center justify-center ${selectedUrgency === u.id ? 'opacity-100' : 'opacity-20'}`}>
                             {selectedUrgency === u.id && <div className="w-1 h-1 rounded-full bg-current" />}
                          </div>
                        </label>
                      ))}
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    📅 รอบการใช้ข้อมูล <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {frequencies.map((f) => (
                      <label 
                        key={f.id}
                        className={`relative flex flex-col items-center justify-center p-2.5 cursor-pointer rounded-lg border-2 transition-all duration-300 ${
                          selectedFrequency === f.id 
                            ? 'bg-emerald-50 border-emerald-500 shadow-sm' 
                            : 'bg-slate-100/50 border-transparent hover:bg-slate-100'
                        }`}
                      >
                        <input 
                          type="radio" name="frequency" value={f.id} required className="sr-only"
                          onChange={(e) => setSelectedFrequency(e.target.value)}
                        />
                        <span className="text-lg mb-1">{f.emoji}</span>
                        <div className="flex flex-col items-center leading-none">
                          <span className={`text-sm font-black ${selectedFrequency === f.id ? 'text-emerald-700' : 'text-slate-800'}`}>
                            {f.label}
                          </span>
                          <span className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wide">{f.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* File Attachment */}
              <div className="space-y-4 pt-4">
                  <label className="text-base font-bold text-gray-800 flex items-center gap-2">
                    📎 แนบไฟล์ตัวอย่าง (ถ้ามี)
                  </label>
                  <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer group">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3">
                      <FileUp className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-sm font-bold text-gray-600">
                      {selectedFileName ? `📄 ${selectedFileName}` : "คลิกที่นี่เพื่อแนบไฟล์"}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 mt-1">
                      {selectedFileName ? "คลิกเพื่อเปลี่ยนไฟล์" : "PDF, Excel, Word (MAX 5MB)"}
                    </span>
                    <input 
                      type="file" 
                      name="file" 
                      className="sr-only" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert("ขนาดไฟล์ใหญ่เกินไป ห้ามเกิน 5MB ครับ");
                            e.target.value = "";
                            setSelectedFileName(null);
                          } else {
                            setSelectedFileName(file.name);
                          }
                        }
                      }}
                    />
                  </label>
              </div>
            </div>
          </div>

          {/* Section 2: Contact Info */}
          <div className="bg-white rounded-[1.5rem] shadow-xl shadow-emerald-900/5 p-4 md:p-8 border border-slate-200 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 leading-none">2. ข้อมูลผู้แจ้ง</h2>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Requester Information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    👤 ชื่อ-นามสกุล <span className="text-rose-500">*</span>
                  </label>
                  <input type="text" name="requesterName" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none font-medium text-sm focus:border-emerald-500 focus:bg-white transition-all text-slate-900" placeholder="ระบุชื่อจริง..." />
               </div>
               <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    📞 เบอร์โทรศัพท์ <span className="text-rose-500">*</span>
                  </label>
                  <input type="tel" name="phone" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none font-medium text-sm focus:border-emerald-500 focus:bg-white transition-all text-slate-900" placeholder="08X-XXX-XXXX..." />
               </div>
               <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    💬 Line ID (ถ้ามี)
                  </label>
                  <input type="text" name="lineId" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none font-medium text-sm focus:border-emerald-500 focus:bg-white transition-all text-slate-900" placeholder="ID Line..." />
               </div>
               <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    📧 อีเมล <span className="text-rose-500">*</span>
                  </label>
                  <input type="email" name="email" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none font-medium text-sm focus:border-emerald-500 focus:bg-white transition-all text-slate-900" placeholder="ระบุอีเมล..." />
               </div>
               <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    🏢 แผนก / หน่วยงาน <span className="text-rose-500">*</span>
                  </label>
                  <select name="department" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 outline-none font-medium text-sm appearance-none cursor-pointer focus:border-emerald-500 focus:bg-white transition-all text-slate-900">
                    <option value="" disabled>คลิกเลือกหน่วยงาน...</option>
                    {[
                      "งานธุรการ", "งาน CKD", "งาน LAB", "องค์กรแพทย์", "งานกายภาพบำบัด", "งานการพยาบาล", "งานการพยาบาลป่วยผ่าตัดและวิสัญญีพยาบาล",
                      "งานการพยาบาลผู้คลอด", "งานการพยาบาลผู้ป่วยนอก", "งานการพยาบาลผู้ป่วยหนัก", "งานการพยาบาลผู้ป่วยอุบัติเหตุฉุกเฉินและนิติเวช",
                      "งานการพยาบาลผู้ป่วยใน (ชาย)", "งานการพยาบาลผู้ป่วยใน (พิเศษ)", "งานการพยาบาลผู้ป่วยใน (หญิง)", "งานการพยาบาลผู้ป่วยใน (เด็ก)",
                      "งานการเงินและบัญชี", "งานคลินิกพิเศษ", "งานคลีนิกสีขาว", "งานคุณภาพ QIC", "งานซ่อมบำรุง", "งานทรัพยากรบุคคล", "งานทันตกรรม",
                      "งานบริหารทั่วไป", "งานปฐมภูมิ", "งานประกันสุขภาพ", "งานประชาสัมพันธ์", "งานพยาบาลหน่วยควบคุมการติดเชื้อและงานจ่ายกลาง",
                      "งานพัสดุ", "งานยานพาหนะ", "งานยาเสพติด", "งานรักษาความปลอดภัย", "งานรังสีวิทยา", "งานวิสัญญีพยาบาล", "งานสุขภาพจิต",
                      "งานสุขาภิบาล", "งานสูติ-นรีเวช", "งานเทคโนโลยีสารสนเทศและพัฒนาระบบสุขภาพดิจิทัล", "งานเภสัชกรรมผู้ป่วยนอก", "งานเภสัชกรรมผู้ป่วยใน",
                      "งานเวชระเบียนและข้อมูลทางการแพทย์", "งานแผนงานและประเมินผล", "งานแพทย์แผนไทย", "งานโภชนศาสตร์", "งานโสตทัศนศึกษา"
                    ].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
               </div>
            </div>
          </div>

          {/* Submit Area */}
          <div className="flex flex-col items-center gap-6 pt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full max-w-lg overflow-hidden relative flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xl text-white transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
                isSubmitting ? 'bg-slate-400' : 'bg-[#004d40] shadow-emerald-900/20'
              }`}
            >
              {isSubmitting ? 'กำลังส่งข้อมูล...' : '🚀 ยืนยันการส่งข้อมูล'}
              {/* Shine Effect */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </button>
          </div>
        </form>
      </main>

      {/* --- Success Modal --- */}
      {isSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 duration-300 border border-emerald-50 relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full opacity-50" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-50 rounded-full opacity-50" />
              
              <div className="relative">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-inner">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-2">ส่งคำขอสำเร็จ!</h3>
                <p className="text-sm font-bold text-slate-500 mb-8 leading-relaxed">
                  ขอบคุณที่ใช้บริการครับ เจ้าหน้าที่จะดำเนินการตรวจสอบ<br/>และแจ้งผลกลับโดยเร็วที่สุด
                </p>
                
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  รับทราบ
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="bg-[#003820] pt-12 pb-8 px-4 mt-12 text-center relative overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-[0.1] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
           <div className="inline-block p-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm shadow-lg">
             <Image 
               src={logo} 
               alt="NHH Logo Footer" 
               width={45} 
               height={45} 
               className="object-contain"
             />
           </div>
           
           <div className="text-white">
             <h3 className="text-lg font-black mb-0.5">กลุ่มงานสุขภาพดิจิทัล</h3>
             <p className="text-emerald-400 font-bold text-xs">โรงพยาบาลหนองหาน · Nonghan Hospital</p>
           </div>

           <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-6 text-emerald-100/70 font-bold text-xs">
              <span className="flex items-center justify-center gap-2"><Phone className="w-3.5 h-3.5" /> 042-261135-6 ต่อ 235 หรือ 469</span>
              <span className="flex items-center justify-center gap-2"><HeartPulse className="w-3.5 h-3.5" /> 24/7 Service</span>
           </div>

           <div className="pt-8 opacity-30 text-emerald-50 text-[9px] font-bold uppercase tracking-[0.2em] space-y-1">
              <div>© 2026 NONGHAN HOSPITAL IT CENTER · IMT HUB</div>
              <div className="text-[8px] opacity-70">พัฒนาโดย <span className="text-emerald-300">กลุ่มงานสุขภาพดิจิทัล</span></div>
           </div>
        </div>
      </footer>

      {/* Required Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-shimmer { animation: shimmer 2s infinite ease-in-out; }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}} />

    </div>
  );
}
