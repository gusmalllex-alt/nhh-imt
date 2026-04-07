import { supabase } from "@/lib/supabase";
import { sendLineNotification } from "@/lib/notifications";

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
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('request-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Supabase Storage Error:", uploadError);
        // We continue even if file upload fails, but you might want to stop
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

    // 3. Send LINE Notification (using GAS as a bridge)
    const lineMsg = `📣 *มีคำขอใหม่ (Supabase)*\n\n📂 *ประเภท:* ${type}\n📝 *ชื่อรายงาน:* ${reportName}\n👤 *ผู้ขอ:* ${requesterName}\n🏢 *หน่วยงาน:* ${department}\n🔥 *ความเร่งด่วน:* ${urgencyLabel}\n📞 *โทร:* ${phone}`;
    await sendLineNotification(lineMsg);

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
