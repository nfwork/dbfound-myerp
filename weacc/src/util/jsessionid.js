const STORAGE_KEY = "jsessionid";

let cachedId = "";

export function getJsessionid() {
  if (!cachedId) {
    cachedId = localStorage.getItem(STORAGE_KEY) || "";
  }
  return cachedId;
}

export function saveJsessionid(jsessionid) {
  if (!jsessionid || jsessionid === cachedId) {
    return;
  }
  cachedId = jsessionid;
  localStorage.setItem(STORAGE_KEY, jsessionid);
}

export function clearJsessionid() {
  cachedId = "";
  localStorage.removeItem(STORAGE_KEY);
}

export function appendJsessionid(url) {
  let jsessionid = getJsessionid();
  if (!jsessionid) {
    return url;
  }
  let index = url.indexOf("?");
  if (index > 0) {
    return url.substring(0, index) + ";jsessionid=" + jsessionid + url.substring(index);
  }
  return url + ";jsessionid=" + jsessionid;
}
