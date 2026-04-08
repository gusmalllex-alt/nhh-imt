import { supabase } from "@/lib/supabase";
import { sendLineNotification, sendEmailNotification } from "@/lib/notifications";

/**
 * Note: Switched from 'use server' to standard TypeScript function
 * to support Static Site Generation (SSG) for GitHub Pages.
 */

export async function submitRequestAction(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    let fileUrl = null;

    // 1. Upload File to Supabase Storage if exists
    if (file && file.size > 0 && file.name) {
      if (file.size > 5 * 1024 * 1024) throw new Error("ไฟล์ใหญ่เกินไปครับ (จำกัด 5MB)");

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('request-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type // Ensure correct content type is sent
        });

      if (uploadError) {
        console.error("Supabase Storage Error:", uploadError);
        throw new Error(`ไม่สามารถอัปโหลดไฟล์ได้: ${uploadError.message}`);
      } else {
        const { data: urlData } = supabase.storage
          .from('request-files')
          .getPublicUrl(filePath);
        fileUrl = urlData.publicUrl;
      }
    }

    const urgencyVal = formData.get("urgency") as string;
    const urgencyLabel = urgencyVal === "14" ? "ด่วนมาก" : urgencyVal === "30" ? "ด่วน" : "ปกติ";

    const type = formData.get("type") as string;
    const reportName = formData.get("title") as string;
    const requesterName = formData.get("requesterName") as string;
    const department = formData.get("department") as string;
    const phone = formData.get("phone") as string;

    // 2. Insert Record into Supabase Database
    const { data: dbData, error: dbError } = await supabase
      .from('requests')
      .insert([{
        type: type,
        urgency: urgencyLabel,
        report_name: reportName,
        data_usage: formData.get("frequency") as string,
        formula: formData.get("condition") as string,
        file_url: fileUrl,
        requester_name: requesterName,
        department: department,
        phone: phone,
        email: formData.get("email") as string,
        status: "รอดำเนินการ",
        created_at: new Date().toISOString()
      }])
      .select();

    if (dbError) throw dbError;

    // 3. Optional Notifications (Wrap in separate try-catch to prevent flow interruption)
    try {
      // LINE Notification
      const lineMsg = `📣 *มีคำขอใหม่ (Supabase)*\n\n📂 *ประเภท:* ${type}\n📝 *ชื่อรายงาน:* ${reportName}\n👤 *ผู้ขอ:* ${requesterName}\n🏢 *หน่วยงาน:* ${department}\n🔥 *ความเร่งด่วน:* ${urgencyLabel}\n📞 *โทร:* ${phone}`;
      await sendLineNotification(lineMsg);

      // Email Notifications
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "imt.nonghan@gmail.com";
      const userEmail = formData.get("email") as string;

      // Email to Admin
      const adminEmailSubject = `[IMT Portal] มีคำขอใหม่จากคุณ ${requesterName}`;
      const adminEmailBody = `มีการยื่นคำขอข้อมูลใหม่ในระบบ IMT\n\n` +
        `หัวข้อ: ${reportName}\n` +
        `ผู้ขอ: ${requesterName} (${department})\n` +
        `ประเภท: ${type}\n` +
        `ความเร่งด่วน: ${urgencyLabel}\n` +
        `ข้อมูลติดต่อ: ${userEmail || 'ไม่มี'} / ${phone}\n\n` +
        `จัดการข้อมูลได้ที่: https://gusmalllex-alt.github.io/nhh-imt/admin`;
      
      await sendEmailNotification(adminEmail, adminEmailSubject, adminEmailBody);

      // Confirmation Email to Requester
      if (userEmail && userEmail.includes('@')) {
        const userEmailSubject = `ยืนยันการรับคำขอข้อมูล: ${reportName}`;
        const userEmailBody = `เรียนคุณ ${requesterName},\n\n` +
          `ระบบได้รับคำขอข้อมูล "${reportName}" ของท่านเรียบร้อยแล้ว\n` +
          `ขณะนี้อยู่ระหว่างรอเจ้าหน้าที่รับเรื่อง\n\n` +
          `ท่านสามารถติดตามสถานะการดำเนินงานได้ที่: https://gusmalllex-alt.github.io/nhh-imt/status\n\n` +
          `ขอบคุณครับ\nกลุ่มงานดิจิทัลและเทคโนโลยีสารสนเทศ โรงพยาบาลหนองหาน`;
        
        await sendEmailNotification(userEmail, userEmailSubject, userEmailBody);
      }
    } catch (notifErr) {
      console.warn("Notification error (but data was saved):", notifErr);
    }

    return { 
      success: true, 
      message: "ส่งคำขอของท่านเรียบร้อยแล้ว (บันทึกเข้าระบบ Supabase)",
      data: dbData 
    };

  } catch (error: any) {
    console.error("SubmitRequestAction Error:", error);
    return { success: false, message: error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
  }
}
