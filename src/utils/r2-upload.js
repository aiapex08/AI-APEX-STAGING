// Direct SharePoint Upload via apex-bridge
// Flow: file → POST /api/uploadToSharePoint → SharePoint URL

const APEX_BRIDGE_BASE = "https://apex-bridge-gtamg9f8d3a9afc8.westeurope-01.azurewebsites.net";

// Upload a file directly to SharePoint via apex-bridge.
// Returns the SharePoint URL.
export async function uploadFile(file, folder = "", customFileName = "") {
  const nameToUse = customFileName || file.name;
  const safeName  = nameToUse.replace(/[#?&=%]/g, "_");
  const folderPath = folder ? `Estimation/${folder}` : "Estimation";

  const formData = new FormData();
  formData.append("file", file, safeName);
  formData.append("folder", folderPath);
  formData.append("fileName", safeName);

  const res = await fetch(`${APEX_BRIDGE_BASE}/api/uploadToSharePoint`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => String(res.status));
    throw new Error(`apex-bridge uploadToSharePoint ${res.status}: ${text}`);
  }

  const data = await res.json();
  if (!data.sharePointUrl) throw new Error("apex-bridge returned no sharePointUrl");
  console.log("✅ SharePoint upload:", data.sharePointUrl);
  return data.sharePointUrl;
}

// Delete a file from SharePoint via apex-bridge.
export async function deleteFile(fileUrl) {
  if (!fileUrl) return;
  try {
    const res = await fetch(`${APEX_BRIDGE_BASE}/api/deleteFromSharePoint`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileUrl }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => String(res.status));
      console.warn(`apex-bridge deleteFromSharePoint ${res.status}: ${text}`);
    }
  } catch (err) {
    console.warn("deleteFile failed:", err.message);
  }
}

export { APEX_BRIDGE_BASE };
