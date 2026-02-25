function extractLinkedInJob() {
  const role = document.querySelector("h1")?.textContent?.trim() ?? "";
  const company =
    document.querySelector('a[href*="/company/"]')?.textContent?.trim() ?? "";
  return {
    role,
    company,
    location: window.location.href,
    dateApplied: new Date().toISOString(),
  };
}
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data.type === "DEV_SCOPE_EXTENSION_TOKEN") {
    chrome.runtime.sendMessage({
      type: "STORE_EXTENSION_TOKEN",
      token: event.data.token,
    });
  }
});

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (!target) return;
  if (target.innerText?.toLowerCase().includes("submit")) {
    const jobData = extractLinkedInJob();
    console.log("Detected job submission:", jobData);
    chrome.runtime.sendMessage({
      type: "JOB_APPLICATION_DETECTED",
      payload: jobData,
    });
  }
});
