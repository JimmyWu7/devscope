import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
// import { jwtDecode } from "jwt-decode"; // Use for expired JWT token

interface User {
  id: string;
  name: string;
  email: string;
}

interface StorageData {
  devscopeToken?: string;
  devscopeUser?: User;
  devscopeStatus?: Status;
  darkMode?: boolean;
  privacyMode?: boolean;
}

interface JobApplication {
  company: string;
  role: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  dateApplied: string;
  datePosted: string;
  applicationUrl: string;
  notes: string;
}

type Status = "idle" | "connected" | "syncing" | "error";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [darkMode, setDarkMode] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [jobData, setJobData] = useState<JobApplication | null>(null);

  //  Load everything from storage on mount
  useEffect(() => {
    chrome.storage.local.get(
      [
        "devscopeToken",
        "devscopeUser",
        "devscopeStatus",
        "darkMode",
        "privacyMode",
      ],
      (result) => {
        const data = result as StorageData;

        setToken(data.devscopeToken ?? null);
        setUser(data.devscopeUser ?? null);
        setStatus(data.devscopeStatus ?? "idle");
        setDarkMode(data.darkMode ?? false);
        setPrivacyMode(data.privacyMode ?? false);
      },
    );

    chrome.storage.onChanged.addListener((changes) => {
      if (changes.devscopeUser)
        setUser(changes.devscopeUser.newValue as User | null);

      if (changes.devscopeStatus)
        setStatus((changes.devscopeStatus.newValue as Status) ?? "idle");

      if (changes.devscopeToken)
        setToken(changes.devscopeToken.newValue as string | null);

      if (changes.darkMode) setDarkMode(changes.darkMode.newValue as boolean);
    });
  }, []);

  function connectToDevScope() {
    chrome.tabs.create({
      url: "http://localhost:3000/extension-auth",
    });
  }

  function disconnect() {
    chrome.storage.local.set({
      devscopeStatus: "idle",
    });
    chrome.storage.local.remove([
      "devscopeToken",
      "devscopeUser",
      "devscopeStatus",
    ]);

    setToken(null);
    setUser(null);
    setStatus("idle");
  }

  function toggleDarkMode() {
    const newMode = !darkMode;
    setDarkMode(newMode);
    chrome.storage.local.set({ darkMode: newMode });
    console.log("Dark Mode toggled:", newMode); // Debugging line
  }

  function togglePrivacyMode() {
    const newValue = !privacyMode;
    setPrivacyMode(newValue);
    chrome.storage.local.set({ privacyMode: newValue });
  }

  async function analyzeCurrentPage() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.id) return;

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const getText = (selector: string) =>
          document.querySelector(selector)?.textContent?.trim() ?? "";

        const hostname = window.location.hostname;

        let company = "";
        let role = "";
        let location = "";
        let datePosted = "";
        let salary = "";

        // LinkedIn
        if (hostname.includes("linkedin.com")) {
          // COMPANY
          company =
            document
              .querySelector(
                ".job-details-jobs-unified-top-card__company-name a",
              )
              ?.textContent?.trim() ?? "";

          // ROLE
          role =
            document
              .querySelector(".job-details-jobs-unified-top-card__job-title h1")
              ?.textContent?.trim() ?? "";

          // LOCATION + DATE POSTED
          const tertiaryContainer = document.querySelector(
            ".job-details-jobs-unified-top-card__tertiary-description-container",
          );

          if (tertiaryContainer) {
            const spans = Array.from(
              tertiaryContainer.querySelectorAll("span"),
            );

            for (const span of spans) {
              const text = span.textContent?.trim() ?? "";

              // LOCATION
              if (
                !location &&
                text &&
                !text.includes("·") &&
                !text.includes("ago") &&
                !text.includes("applicants")
              ) {
                location = text;
              }

              // DATE POSTED
              if (text.toLowerCase().includes("ago")) {
                datePosted = text;
              }
            }
          }

          // SALARY EXTRACTION
          const parseSalary = (text: string) => {
            if (!text) return "";

            // Normalize dashes
            const normalized = text.replace(/[–—]/g, "-");

            // Match salary range
            const rangeMatch = normalized.match(
              /\$\s?[\d,.]+k?(?:\/\w+)?\s*-\s*\$\s?[\d,.]+k?(?:\/\w+)?/i,
            );

            if (rangeMatch) return rangeMatch[0];

            // Match single salary
            const singleMatch = normalized.match(/\$\s?[\d,.]+k?(?:\/\w+)?/i);

            if (singleMatch) return singleMatch[0];

            return "";
          };

          // TOP CARD FIRST
          const topCard = document.querySelector(
            ".job-details-fit-level-preferences",
          );

          if (topCard) {
            salary = parseSalary(topCard.textContent || "");
          }

          // FALLBACK TO DESCRIPTION
          if (!salary) {
            const description =
              document.querySelector("#job-details")?.textContent || "";

            salary = parseSalary(description);
          }
        }

        // Parse and calculate datePosted
        if (datePosted) {
          // Match for "days ago", "weeks ago", etc.
          const dayMatch = datePosted.match(/(\d+)\s*days?\s*ago/);
          const weekMatch = datePosted.match(/(\d+)\s*weeks?\s*ago/);
          const monthMatch = datePosted.match(/(\d+)\s*months?\s*ago/);

          const now = new Date();

          if (dayMatch) {
            const daysAgo = parseInt(dayMatch[1], 10);
            now.setDate(now.getDate() - daysAgo);
            datePosted = now.toISOString().split("T")[0];
          } else if (weekMatch) {
            const weeksAgo = parseInt(weekMatch[1], 10);
            now.setDate(now.getDate() - weeksAgo * 7);
            datePosted = now.toISOString().split("T")[0];
          } else if (monthMatch) {
            const monthsAgo = parseInt(monthMatch[1], 10);
            now.setMonth(now.getMonth() - monthsAgo);
            datePosted = now.toISOString().split("T")[0];
          }
        }

        // Handshake
        if (hostname.includes("joinhandshake.com")) {
          role = getText("h1");
          company = getText("a[href*='/employers/']");
          location = getText("[data-hook='location']");
        }

        const result = {
          company,
          role,
          location,
          salary,
          salaryMin: "",
          salaryMax: "",
          dateApplied: new Date().toISOString().split("T")[0],
          datePosted,
          applicationUrl: window.location.href,
          notes: "",
        };

        // console.log("DevScope Analyze Result:", result);

        return result;
      },
    });

    const extracted = results[0]?.result;

    // Parse Salary Range for Min and Max
    if (extracted?.salary) {
      const normalized = extracted.salary.replace(/[–—]/g, "-").toLowerCase();

      const convertToNumber = (value: string) => {
        const cleaned = value.replace(/[^0-9k.]/g, "");

        if (cleaned.includes("k")) {
          return (parseFloat(cleaned.replace("k", "")) * 1000).toString();
        }

        return cleaned;
      };

      if (normalized.includes("-")) {
        const [minRaw, maxRaw] = normalized.split("-");
        extracted.salaryMin = convertToNumber(minRaw);
        extracted.salaryMax = convertToNumber(maxRaw);
      } else {
        extracted.salaryMin = convertToNumber(normalized);
        extracted.salaryMax = "";
      }
    }

    if (!extracted) return;

    console.log("Received in popup:", extracted);

    setJobData(extracted);
  }

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="w-[340px] p-5 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight">DevScope</h2>

          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                status === "connected"
                  ? "bg-green-500"
                  : status === "syncing"
                    ? "bg-yellow-400 animate-pulse"
                    : status === "error"
                      ? "bg-red-500"
                      : "bg-gray-300"
              }`}
            />
            <span className="text-xs text-gray-400 capitalize">{status}</span>
          </div>
        </div>

        {/* Not Connected */}
        {!token ? (
          <div className="space-y-2">
            <button
              onClick={connectToDevScope}
              className="w-full bg-black text-white py-3 rounded-xl font-medium border border-gray-200 dark:border-zinc-700 hover:bg-gray-800 dark:hover:bg-zinc-800 transition shadow-sm cursor-pointer"
            >
              Connect to DevScope
            </button>
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-sm cursor-pointer"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700" />
              )}
              <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        ) : user ? (
          // Connected User Info
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Connected as
              </p>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
            <button
              onClick={analyzeCurrentPage}
              className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-blue-600 hover:text-white transition text-sm cursor-pointer"
            >
              Analyze This Page
            </button>

            {jobData && (
              <div className="mt-3 space-y-2 border-t pt-3">
                {/* Company */}
                <input
                  className="w-full p-2 rounded border dark:bg-zinc-800"
                  placeholder="Company Name *"
                  value={jobData.company}
                  onChange={(e) =>
                    setJobData({ ...jobData, company: e.target.value })
                  }
                />
                {/* Role */}
                <input
                  className="w-full p-2 rounded border dark:bg-zinc-800"
                  placeholder="Role *"
                  value={jobData.role}
                  onChange={(e) =>
                    setJobData({ ...jobData, role: e.target.value })
                  }
                />
                {/* Min Salary and Max Salary */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="w-1/2 p-2 rounded border dark:bg-zinc-800"
                    placeholder="Salary Min"
                    value={jobData.salaryMin}
                    onChange={(e) =>
                      setJobData({ ...jobData, salaryMin: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="w-1/2 p-2 rounded border dark:bg-zinc-800"
                    placeholder="Salary Max"
                    value={jobData.salaryMax}
                    onChange={(e) =>
                      setJobData({ ...jobData, salaryMax: e.target.value })
                    }
                  />
                </div>
                {/* Location */}
                <input
                  className="w-full p-2 rounded border dark:bg-zinc-800"
                  placeholder="Location"
                  value={jobData.location}
                  onChange={(e) =>
                    setJobData({ ...jobData, location: e.target.value })
                  }
                />
                {/* Date Applied */}
                <input
                  type="date"
                  className="w-full p-2 rounded border dark:bg-zinc-800"
                  value={jobData.dateApplied}
                  onChange={(e) =>
                    setJobData({ ...jobData, dateApplied: e.target.value })
                  }
                />
                {/* Date Posted */}
                <input
                  type="date"
                  className="w-full p-2 rounded border dark:bg-zinc-800"
                  placeholder="Date Posted"
                  value={jobData.datePosted}
                  onChange={(e) =>
                    setJobData({ ...jobData, datePosted: e.target.value })
                  }
                />
                {/* Application URL */}
                <input
                  type="url"
                  className="w-full p-2 rounded border dark:bg-zinc-800"
                  placeholder="Application URL"
                  value={jobData.applicationUrl}
                  onChange={(e) =>
                    setJobData({ ...jobData, applicationUrl: e.target.value })
                  }
                />
                {/* Notes */}
                <textarea
                  className="w-full p-2 rounded border dark:bg-zinc-800"
                  placeholder="Notes"
                  value={jobData.notes}
                  onChange={(e) =>
                    setJobData({ ...jobData, notes: e.target.value })
                  }
                />
                {/* Confirmation Button */}
                <div className="flex gap-2">
                  <button
                    className="flex-1 py-2 rounded bg-green-600 text-white cursor-pointer"
                    onClick={() => console.log("Track on DevScope:", jobData)}
                  >
                    Yes, Track
                  </button>

                  <button
                    className="flex-1 py-2 rounded border cursor-pointer"
                    onClick={() => setJobData(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {/* Privacy Mode */}
            <button
              onClick={togglePrivacyMode}
              className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-sm cursor-pointer"
            >
              Privacy Mode: {privacyMode ? "On (2h auto-disconnect)" : "Off"}
            </button>
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-sm cursor-pointer"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700" />
              )}
              <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
            {/* Disconnect Button */}
            <button
              onClick={disconnect}
              className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-red-600 transition text-sm cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 animate-pulse">
            Syncing session...
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
