/**
 * Note: Switched from 'use server' to standard TypeScript function
 * to support Static Site Generation (SSG) for GitHub Pages.
 */

const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || "";

export async function getRequests() {
  try {
    if (!GOOGLE_SCRIPT_URL) return { success: false, message: "Google Script URL not configured" };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      // Important: Use text/plain to avoid CORS preflight (OPTIONS) which GAS doesn't support
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ action: "getRequests" }),
    });

    const data = await response.json() as any[][];

    // Map GAS array rows to objects
    const mappedData = data.map((row, index) => ({
      id: index.toString(), 
      rowIndex: index,      
      type: row[0],
      urgency: row[1],
      title: row[2],
      frequency: row[3],
      condition: row[4],
      file_url: row[5],
      requester_name: row[6],
      department: row[7],
      phone: row[8],
      email: row[9],
      created_at: row[10],
      status: row[11],
      date_received: row[12],
      due_date: row[13],
      assigned_to: row[14],
      admin_note: row[15]
    }));

    return { success: true, data: mappedData };
  } catch (error: any) {
    console.error("getRequests GAS Error:", error);
    return { success: false, message: error.message };
  }
}

export async function updateRequestStatus(rowIndex: string, updates: { 
  status?: string, 
  assigned_to?: string, 
  admin_note?: string,
  dateReceived?: string,
  dateCompleted?: string
}) {
  try {
    if (!GOOGLE_SCRIPT_URL) return { success: false, message: "Google Script URL not configured" };

    const payload = {
      action: "updateRequestStatus",
      updateData: {
        rowIndex: rowIndex,
        status: updates.status,
        receiver: updates.assigned_to,
        infoNeeded: updates.admin_note,
        dateReceived: updates.dateReceived,
        dateCompleted: updates.dateCompleted
      }
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("updateRequestStatus GAS Error:", error);
    return { success: false, message: error.message };
  }
}

export async function addUserInformation(rowIndex: string, additionalInfo: string) {
  try {
    if (!GOOGLE_SCRIPT_URL) return { success: false, message: "Google Script URL not configured" };

    const payload = {
      action: "addUserInformation",
      updateData: {
        rowIndex: rowIndex,
        additionalInfo: additionalInfo
      }
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("addUserInformation GAS Error:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteRequest(id: string) {
  return { success: false, message: "การลบรายการยังไม่รองรับในระบบ Google Sheets" };
}
