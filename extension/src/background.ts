/* {
    "role": "Junior Software Developer",
    "company": "",
    "location": "https://www.linkedin.com/jobs/collections/recommended/?currentJobId=4375059212",
    "dateApplied": "2026-02-24T06:20:56.249Z"
} */

const API_BASE = "http://localhost:3000";
const IDLE_WARNING_MS = 24 * 60 * 60 * 1000; // 24 hours
const AUTO_DISCONNECT_MS = 1 * 60 * 1000; // 2 hours

async function attemptRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/extension-refresh`, {
      method: "POST",
      credentials: "include", // VERY important
    });

    if (!res.ok) return false;

    const { token } = await res.json();

    await chrome.storage.local.set({
      devscopeToken: token,
      devscopeStatus: "connected",
    });

    // Immediately sync with new token
    await syncUser(token);

    return true;
  } catch (err) {
    console.error("Refresh failed:", err);
    return false;
  }
}

async function checkInactivity() {
  const result = await chrome.storage.local.get([
    "lastActivityAt",
    "privacyMode",
    "devscopeToken",
  ]);

  const lastActivityAt = result.lastActivityAt as number | undefined;
  const privacyMode = result.privacyMode as boolean | undefined;
  const devscopeToken = result.devscopeToken as string | undefined;

  if (!devscopeToken) return;
  if (typeof lastActivityAt !== "number") return;

  const timeSinceActivity = Date.now() - lastActivityAt;

  // Smart Idle Indicator (24h)
  if (timeSinceActivity > IDLE_WARNING_MS) {
    await chrome.storage.local.set({
      devscopeStatus: "idle",
    });
  }

  // Privacy Mode Auto Disconnect (2h)
  if (privacyMode === true && timeSinceActivity > AUTO_DISCONNECT_MS) {
    await chrome.storage.local.set({ devscopeStatus: "idle" });
    await chrome.storage.local.remove([
      "devscopeToken",
      "devscopeUser",
      "lastActivityAt",
      "lastSync",
    ]);
    return;
  }
}

/**
 * Sync user session with backend
 */
async function syncUser(token: string) {
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/api/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Remove expired (1hr)token, user is logged out
    if (res.status === 401) {
      const refreshed = await attemptRefresh();
      if (!refreshed) {
        await chrome.storage.local.remove([
          "devscopeToken",
          "devscopeUser",
          "devscopeStatus",
          "lastSync",
        ]);
      }

      return;
    }

    if (!res.ok) throw new Error("Sync failed");

    const data = await res.json();

    await chrome.storage.local.set({
      devscopeUser: data.user,
      devscopeStatus: "connected",
      lastSync: Date.now(),
    });
  } catch (error) {
    console.error("Background sync failed:", error);

    await chrome.storage.local.set({
      devscopeStatus: "error",
    });
  }
}

/**
 * Message listener
 */
chrome.runtime.onMessage.addListener((message) => {
  // Store extension token
  if (message.type === "STORE_EXTENSION_TOKEN") {
    chrome.storage.local.set({
      devscopeToken: message.token,
      devscopeStatus: "connected",
      lastActivityAt: Date.now(),
    });

    // Immediately sync after login
    syncUser(message.token);
  }

  // Job detection (keep existing behavior)
  if (message.type === "JOB_APPLICATION_DETECTED") {
    chrome.storage.local.set({
      latestJobApplication: message.payload,
      lastActivityAt: Date.now(),
    });
  }

  return true;
});

/**
 * Auto-sync every 5 minutes
 */
setInterval(
  async () => {
    await checkInactivity();
    chrome.storage.local.get(["devscopeToken"], (result) => {
      const token = result.devscopeToken as string | undefined;

      if (!token) {
        return;
      }

      chrome.storage.local.set({ devscopeStatus: "syncing" });
      syncUser(token);
    });
  },
  5 * 60 * 1000,
);
