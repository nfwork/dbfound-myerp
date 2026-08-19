const STORAGE_KEY = "device_id";

let cachedId = "";

function createDeviceId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function getDeviceId() {
  if (cachedId) {
    return cachedId;
  }
  cachedId = localStorage.getItem(STORAGE_KEY);
  if (!cachedId) {
    cachedId = createDeviceId();
    localStorage.setItem(STORAGE_KEY, cachedId);
  }
  return cachedId;
}
