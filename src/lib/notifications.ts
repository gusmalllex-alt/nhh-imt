const GAS_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "";

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
        message: message
      }),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("LINE Notification Error:", error);
    return { success: false, message: error.message };
  }
}
