import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
// import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
}

// interface DecodedToken {
//   userId: string;
//   scope: string;
//   exp: number;
// }

interface StorageData {
  devscopeToken?: string;
  devscopeUser?: User;
  devscopeStatus?: Status;
  darkMode?: boolean;
  privacyMode?: boolean;
}

type Status = "idle" | "connected" | "syncing" | "error";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [darkMode, setDarkMode] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);

  /**
   * Load everything from storage on mount
   */
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

  /**
   * Validate token expiration
   */
  // useEffect(() => {
  //   if (!token) return;

  //   try {
  //     const decoded = jwtDecode<DecodedToken>(token);
  //     const isExpired = decoded.exp * 1000 < Date.now();

  //     if (isExpired) disconnect();
  //   } catch {
  //     disconnect();
  //   }
  // }, [token]);

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
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Connected as
              </p>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>

            <button
              onClick={togglePrivacyMode}
              className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-sm cursor-pointer"
            >
              Privacy Mode: {privacyMode ? "On (2h auto-disconnect)" : "Off"}
            </button>

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
