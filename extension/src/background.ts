// Listen for extension token storage
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === "STORE_EXTENSION_TOKEN") {
    chrome.storage.local.set({
      devscopeToken: message.token,
    });

    // sendResponse({ success: true });
  }
  return true;
});

// Listen for job application submission
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === "JOB_APPLICATION_DETECTED") {
    console.log("Received job application:", message.payload);

    chrome.storage.local.set({
      latestJobApplication: message.payload,
    });
  }
  return true;
});
