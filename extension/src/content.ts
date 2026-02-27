import { detectAndParse } from "./content/parsers";
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data.type === "DEV_SCOPE_EXTENSION_TOKEN") {
    chrome.runtime.sendMessage({
      type: "STORE_EXTENSION_TOKEN",
      token: event.data.token,
    });
  }
});

document.addEventListener("submit", () => {
  const jobData = detectAndParse();

  if (!jobData) return;

  chrome.runtime.sendMessage({
    type: "JOB_APPLICATION_DETECTED",
    payload: jobData,
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "ANALYZE_PAGE") {
    const jobData = detectAndParse();
    sendResponse(jobData);
  }

  return true;
});
