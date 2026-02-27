import Header from "./components/Header";
import JobForm from "./components/JobForm";
import { useStorage } from "./hooks/useStorage";
import { useAnalyzePage } from "./hooks/useAnalyzePage";
import Settings from "./components/Settings";

function App() {
  const {
    token,
    user,
    status,
    themeMode,
    isDark,
    setTheme,
    privacyMode,
    togglePrivacyMode,
    disconnect,
  } = useStorage();

  const { jobData, setJobData, analyzeCurrentPage } = useAnalyzePage();

  function connect() {
    chrome.tabs.create({
      url: "http://localhost:3000/extension-auth",
    });
  }

  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className="w-[340px] p-5 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
        <Header status={status} />

        {!token ? (
          <button
            onClick={connect}
            className="w-full bg-black text-white py-3 rounded-xl font-medium border border-gray-200 dark:border-zinc-700 hover:bg-gray-800 dark:hover:bg-zinc-800 transition shadow-sm cursor-pointer"
          >
            Connect to DevScope
          </button>
        ) : (
          <>
            {user && (
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
                  <JobForm jobData={jobData} setJobData={setJobData} />
                )}

                <Settings
                  themeMode={themeMode}
                  isDark={isDark}
                  setTheme={setTheme}
                  privacyMode={privacyMode}
                  togglePrivacyMode={togglePrivacyMode}
                  disconnect={disconnect}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
