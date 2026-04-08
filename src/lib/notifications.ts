const GAS_URL = "https://script.google.com/macros/s/AKfycbxx9ZaF9iCFAq7jNJDA4FFNFKnQK5JLRHE21jgIxQP252YLSBubussoan60TbRmUNem/exec";

/**
 * Utility to send LINE notifications via the existing Google Apps Script bridge.
 * This is necessary because the LINE Messaging API does not support CORS from the browser.
 */
export async function sendLineNotification(message: string) {
  if (!GAS_URL) return { success: false, message: "Notification bridge not configured" };

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        action: "sendLineNotification",
        message: `${message}\n\n🌐 จัดการข้อมูล: https://gusmalllex-alt.github.io/nhh-imt/admin`
      }),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("LINE Notification Error:", error);
    return { success: false, message: error.message };
  }
}

/**
 * Utility to send Email notifications via the GAS bridge.
 */
export async function sendEmailNotification(to: string, subject: string, body: string) {
  if (!GAS_URL) return { success: false, message: "Notification bridge not configured" };

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        action: "sendEmail",
        to: to,
        subject: subject,
        body: body
      }),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Email Notification Error:", error);
    return { success: false, message: error.message };
  }
}
