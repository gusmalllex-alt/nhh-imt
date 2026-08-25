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

    // Fetch evaluations if table exists
    let evaluationsMap: Record<string, any> = {};
    try {
      const { data: evalData } = await supabase
        .from('evaluations')
        .select('*');
      if (evalData) {
        evalData.forEach((ev: any) => {
          evaluationsMap[ev.request_id] = ev;
        });
      }
    } catch (e) {
      // Graceful fallback if evaluations table not yet created
    }

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
      admin_note: req.info_needed,
      evaluation: evaluationsMap[req.id] || null
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
             const isCompleted = updates.status === "ดำเนินการเรียบร้อย";
             const subject = isCompleted
               ? `[IMT Portal] ดำเนินการเรียบร้อย: ${reqInfo.report_name} (ขอความอนุเคราะห์ประเมินความพึงพอใจ)`
               : `[IMT Portal] อัปเดตสถานะคำขอ: ${reqInfo.report_name}`;

             let body = `เรียนคุณ ${reqInfo.requester_name},\n\n` +
               `คำขอข้อมูลเรื่อง "${reqInfo.report_name}" ของท่าน ขณะนี้มีการเปลี่ยนแปลงสถานะเป็น: 【${updates.status}】\n\n`;

             if (isCompleted) {
                body += `🎉 กลุ่มงานสุขภาพดิจิทัล ได้ดำเนินการจัดทำข้อมูลตามคำขอของท่านเสร็จสิ้นเรียบร้อยแล้วครับ\n\n` +
                  `⭐ เพื่อนำผลไปพัฒนาและปรับปรุงคุณภาพการให้บริการให้ดียิ่งขึ้น ขอความอนุเคราะห์ท่านสละเวลาสั้นๆ ทำแบบประเมินความพึงพอใจ (1-5 ดาว) ได้ที่:\n` +
                  `🔗 https://gusmalllex-alt.github.io/nhh-imt/status\n` +
                  `*(ท่านสามารถคลิกปุ่ม "⭐ แบบประเมินความพึงพอใจ" ต่อท้ายคำขอของท่านในหน้าระบบติดตามสถานะได้ทันที)*\n\n`;
             } else {
                body += `ท่านสามารถติดตามรายละเอียดและความคืบหน้าได้ที่:\n` +
                  `🔗 https://gusmalllex-alt.github.io/nhh-imt/status\n\n`;
             }

             body += `ขอบคุณครับ\nกลุ่มงานสุขภาพดิจิทัล โรงพยาบาลหนองหาน · จังหวัดอุดรธานี`;
             
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

export interface EvaluationPayload {
  requestId: string;
  accuracyScore: number;
  completenessScore: number;
  timelinessScore: number;
  suggestion?: string;
}

export async function submitEvaluation(payload: EvaluationPayload) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, message: "ระบบยังไม่ได้เชื่อมต่อฐานข้อมูล (Supabase)" };
    }

    if (!payload.requestId) {
      return { success: false, message: "ไม่พบรหัสคำขอที่ต้องการประเมิน" };
    }

    // Check if already evaluated
    const { data: existing } = await supabase
      .from('evaluations')
      .select('id')
      .eq('request_id', payload.requestId)
      .maybeSingle();

    if (existing) {
      return { success: false, message: "คำขอนี้ได้รับการประเมินความพึงพอใจแล้วครับ" };
    }

    const { data, error } = await supabase
      .from('evaluations')
      .insert([{
        request_id: payload.requestId,
        accuracy_score: payload.accuracyScore,
        completeness_score: payload.completenessScore,
        timeliness_score: payload.timelinessScore,
        suggestion: payload.suggestion?.trim() || null,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    // Optional notification to line for good feedback
    try {
      const avg = ((payload.accuracyScore + payload.completenessScore + payload.timelinessScore) / 3).toFixed(1);
      const msg = `⭐ *มีการส่งแบบประเมินความพึงพอใจ*\n\n🎯 *คะแนนเฉลี่ย:* ${avg}/5 ดาว\n- ความถูกต้อง: ${payload.accuracyScore}/5\n- ความครบถ้วน: ${payload.completenessScore}/5\n- ความทันเวลา: ${payload.timelinessScore}/5${payload.suggestion ? `\n\n💬 *ข้อเสนอแนะ:* ${payload.suggestion}` : ''}`;
      await sendLineNotification(msg);
    } catch (e) {
      // Ignore notification fail
    }

    return { success: true, message: "บันทึกผลการประเมินความพึงพอใจเรียบร้อยแล้ว ขอบคุณสำหรับข้อเสนอแนะ!", data: data?.[0] };
  } catch (error: any) {
    console.error("submitEvaluation Error:", error);
    return { success: false, message: error.message || "เกิดข้อผิดพลาดในการบันทึกแบบประเมิน" };
  }
}

export async function getEvaluations() {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, message: "ระบบยังไม่ได้เชื่อมต่อฐานข้อมูล (Supabase)", data: [] };
    }

    // Join with requests if possible or fetch both
    const { data: evalData, error: evalErr } = await supabase
      .from('evaluations')
      .select('*')
      .order('created_at', { ascending: false });

    if (evalErr) throw evalErr;

    const { data: reqData } = await supabase
      .from('requests')
      .select('id, report_name, requester_name, department, type, date_due, created_at');

    const reqMap: Record<string, any> = {};
    if (reqData) {
      reqData.forEach((r: any) => {
        reqMap[r.id] = r;
      });
    }

    const mapped = (evalData || []).map((ev: any) => ({
      id: ev.id,
      request_id: ev.request_id,
      accuracy_score: Number(ev.accuracy_score) || 0,
      completeness_score: Number(ev.completeness_score) || 0,
      timeliness_score: Number(ev.timeliness_score) || 0,
      average_score: Number(((Number(ev.accuracy_score || 0) + Number(ev.completeness_score || 0) + Number(ev.timeliness_score || 0)) / 3).toFixed(2)),
      suggestion: ev.suggestion || "",
      created_at: ev.created_at,
      request: reqMap[ev.request_id] || null
    }));

    return { success: true, data: mapped };
  } catch (error: any) {
    console.error("getEvaluations Error:", error);
    return { success: false, message: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูลแบบประเมิน", data: [] };
  }
}

