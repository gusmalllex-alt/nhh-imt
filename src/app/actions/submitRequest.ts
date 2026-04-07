/**
 * Note: Switched from 'use server' to standard TypeScript function
 * to support Static Site Generation (SSG) for GitHub Pages.
 */

// นำ URL ของ Web App จาก Google Apps Script (ตอนกด Deploy) มาใส่ในไฟล์ .env.local
const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "";

/**
 * Utility to convert File to Base64 (needed for GAS payload)
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:mime/type;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export async function submitRequestAction(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    let fileBase64 = null;
    let fileName = null;
    let mimeType = null;

    if (file && file.size > 0 && file.name) {
      fileName = file.name;
      mimeType = file.type;
      fileBase64 = await fileToBase64(file);
    }

    const urgencyVal = formData.get("urgency") as string;
    const urgencyLabel = urgencyVal === "14" ? "ด่วนมาก" : urgencyVal === "30" ? "ด่วน" : "ปกติ";

    // Prepare payload for GAS addNewRequest
    const scriptPayload = {
      action: "addNewRequest",
      formData: {
        type: formData.get("type") as string,
        urgency: urgencyLabel,
        reportName: formData.get("title") as string,
        dataUsage: formData.get("frequency") as string,
        formula: formData.get("condition") as string,
        requesterName: formData.get("requesterName") as string,
        department: formData.get("department") as string,
        phone: formData.get("phone") as string,
        requesterEmail: formData.get("email") as string,
        fileData: fileBase64,
        fileName: fileName,
        mimeType: mimeType
      }
    };

    if (!GOOGLE_SCRIPT_URL) {
      return { success: false, message: "ไม่พบการตั้งค่า Google Script URL" };
    }

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        // Important: Use text/plain to avoid CORS preflight (OPTIONS) which GAS doesn't support
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(scriptPayload),
      });
      
      const responseData = await response.json();
      return responseData;
      
    } catch (e) {
      console.error("GAS Submission Error:", e);
      return { success: false, message: "เชื่อมต่อระบบบันทึกข้อมูลล้มเหลว (Network Error)" };
    }

  } catch (error: any) {
    console.error("SubmitRequestAction Error:", error);
    return { success: false, message: error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล" };
  }
}

