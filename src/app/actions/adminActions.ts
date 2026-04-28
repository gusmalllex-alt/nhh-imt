import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { sendLineNotification, sendEmailNotification } from "@/lib/notifications";

/**
 * Note: Switched from 'use server' to standard TypeScript function
 * to support Static Site Generation (SSG) for GitHub Pages.
 */

export async function getRequests() {
  try {
    if (!isSupabaseConfigured) {
      return { success: false, message: "ระบบยังไม่ได้เชื่อมต่อฐานข้อมูล (Supabase)" };
    }
    
    if (!supabase) {
      throw new Error("Supabase is not configured. Please check your environment variables.");
    }
    
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Supabase already returns objects, so we just map to the keys expected by our components
    const mappedData = (data as any[]).map((req: any, index: number) => ({
      id: req.id,
      rowIndex: index, // Still useful for legacy list handling if needed
      type: req.type,
      urgency: req.urgency,
      title: req.report_name,
      frequency: req.data_usage,
      condition: req.formula,
      file_url: req.file_url,
      requester_name: req.requester_name,
      department: req.department,
      phone: req.phone,
      email: req.email,
      created_at: req.created_at,
      status: req.status,
      date_received: req.date_rcv,
      due_date: req.date_due,
      assigned_to: req.receiver,
      admin_note: req.info_needed
    }));

    return { success: true, data: mappedData };
  } catch (error: any) {
    console.error("getRequests Supabase Error:", error);
    return { success: false, message: error.message };
  }
}

export async function updateRequestStatus(requestId: string, updates: { 
  status?: string, 
  assigned_to?: string, 
  admin_note?: string,
  dateReceived?: string,
  dateCompleted?: string
}) {
  try {
    if (!isSupabaseConfigured) {
      return { success: false, message: "ระบบยังไม่ได้เชื่อมต่อฐานข้อมูล (Supabase)" };
    }

    const updatePayload: any = {};
    if (updates.status) updatePayload.status = updates.status;
    if (updates.assigned_to) updatePayload.receiver = updates.assigned_to;
    if (updates.admin_note) updatePayload.info_needed = updates.admin_note;
    if (updates.dateReceived) updatePayload.date_rcv = updates.dateReceived;
    if (updates.dateCompleted) updatePayload.date_due = updates.dateCompleted;

    const { data, error } = await supabase
      .from('requests')
      .update(updatePayload)
      .eq('id', requestId)
      .select();

    if (error) throw error;

    // Automatic Date Logic in update
    if (updates.status === 'รับเรื่อง' && !data[0].date_rcv) {
       const receivedDate = new Date();
       const urgency = data[0].urgency;
       const dueDate = new Date(receivedDate);
       const daysToAdd = (urgency === 'ด่วนมาก') ? 14 : (urgency === 'ด่วน') ? 30 : 60;
       dueDate.setDate(dueDate.getDate() + daysToAdd);
       
       await supabase.from('requests').update({
         date_rcv: receivedDate.toISOString(),
         date_due: dueDate.toISOString()
       }).eq('id', requestId);
    }

    // 3. Send Status update notification
    if (updates.status) {
       try {
          const { data: reqInfo } = await supabase
            .from('requests')
            .select('report_name, email, requester_name')
            .eq('id', requestId)
            .single();

          if (reqInfo && reqInfo.email) {
             const subject = `[IMT Portal] อัปเดตสถานะคำขอ: ${reqInfo.report_name}`;
             const body = `เรียนคุณ ${reqInfo.requester_name},\n\n` +
               `คำขอข้อมูลเรื่อง "${reqInfo.report_name}" มีการเปลี่ยนแปลงสถานะเป็น: ${updates.status}\n\n` +
               `คุณสามารถติดตามรายละเอียดและความคืบหน้าได้ที่: https://gusmalllex-alt.github.io/nhh-imt/status\n\n` +
               `ขอบคุณครับ\nกลุ่มงานดิจิทัลและเทคโนโลยีสารสนเทศ โรงพยาบาลหนองหาน`;
             
             await sendEmailNotification(reqInfo.email, subject, body);
          }
       } catch (err) {
          console.error("Status update email failed:", err);
       }
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("updateRequestStatus Supabase Error:", error);
    return { success: false, message: error.message };
  }
}

export async function addUserInformation(requestId: string, additionalInfo: string) {
  try {
    if (!isSupabaseConfigured) {
      return { success: false, message: "ระบบยังไม่ได้เชื่อมต่อฐานข้อมูล (Supabase)" };
    }

    // 1. Fetch existing data
    const { data: currentReq, error: fetchErr } = await supabase
      .from('requests')
      .select('formula, info_needed, report_name, requester_name')
      .eq('id', requestId)
      .single();

    if (fetchErr) throw fetchErr;

    const now = new Date();
    const timestamp = now.toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
    const userAddition = `\n\n--- ผู้ใช้ตอบกลับ (${timestamp}) ---\n${additionalInfo}`;

    const newFormula = (currentReq.formula || "") + userAddition;
    const newInfoNeeded = (currentReq.info_needed || "") + userAddition;

    // 2. Update Supabase
    const { error: updateErr } = await supabase
      .from('requests')
      .update({
        formula: newFormula,
        info_needed: newInfoNeeded,
        status: "รอดำเนินการ",
        updated_at: now.toISOString()
      })
      .eq('id', requestId);

    if (updateErr) throw updateErr;

    // 3. Send LINE notification
    const msg = `💬 *ผู้ใช้ตอบกลับข้อมูล (Supabase)*\n\n📝 *ชื่อเรื่อง:* ${currentReq.report_name}\n👤 *จาก:* ${currentReq.requester_name}\n\n"${additionalInfo}"`;
    await sendLineNotification(msg);

    // 4. Send Email notification to Admin
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "imt.nonghan@gmail.com";
    const emailSubject = `[IMT Portal] มีการตอบกลับข้อมูลเพิ่มเติม: ${currentReq.report_name}`;
    const emailBody = `มีการส่งข้อมูลเพิ่มเติมจากผู้ขอใช้งาน\n\n` +
      `ชื่อเรื่อง: ${currentReq.report_name}\n` +
      `ผู้ส่ง: ${currentReq.requester_name}\n` +
      `ข้อความ: "${additionalInfo}"\n\n` +
      `จัดการข้อมูล: https://gusmalllex-alt.github.io/nhh-imt/admin`;
    
    await sendEmailNotification(adminEmail, emailSubject, emailBody);

    return { success: true, message: "ส่งข้อมูลเพิ่มเติมเรียบร้อยแล้ว" };
  } catch (error: any) {
    console.error("addUserInformation Supabase Error:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteRequest(requestId: string) {
  try {
    if (!isSupabaseConfigured) {
      return { success: false, message: "ระบบยังไม่ได้เชื่อมต่อฐานข้อมูล (Supabase)" };
    }

    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('id', requestId);

    if (error) throw error;
    return { success: true, message: "ลบรายการเรียบร้อยแล้ว" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
