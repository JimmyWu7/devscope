import { Sun, Moon, Monitor } from "lucide-react";

interface Props {
  themeMode: "system" | "light" | "dark";
  isDark: boolean;
  setTheme: (mode: "system" | "light" | "dark") => void;
  privacyMode: boolean;
  togglePrivacyMode: () => void;
  disconnect: () => void;
}

export default function Settings({
  themeMode,
  isDark,
  setTheme,
  privacyMode,
  togglePrivacyMode,
  disconnect,
}: Props) {
  return (
    <>
      {/* Privacy Mode */}
      <button
        onClick={togglePrivacyMode}
        className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-sm cursor-pointer"
      >
        Privacy Mode: {privacyMode ? "On (2h auto-disconnect)" : "Off"}
      </button>
      {/* Theme Toggle */}
      {/* Theme Selection */}
      <div className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 p-2 space-y-2">
        <div className="flex justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400 px-1">Theme</p>
          {/* Optional: small helper text */}
          {themeMode === "system" && (
            <p className="text-[10px] text-gray-400 px-1">
              Currently using {isDark ? "Dark" : "Light"} (system preference)
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {/* System */}
          <button
            onClick={() => setTheme("system")}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm transition cursor-pointer
              ${
                themeMode === "system"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
          >
            <Monitor className="w-4 h-4" />
            System
          </button>

          {/* Light */}
          <button
            onClick={() => setTheme("light")}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm transition cursor-pointer
              ${
                themeMode === "light"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
          >
            <Sun className="w-4 h-4 text-yellow-400" />
            Light
          </button>

          {/* Dark */}
          <button
            onClick={() => setTheme("dark")}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm transition cursor-pointer
              ${
                themeMode === "dark"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "hover:bg-gray-100 dark:hover:bg-zinc-800"
              }`}
          >
            <Moon className={`w-4 h-4 text-primary}`} />
            Dark
          </button>
        </div>
      </div>
      {/* Disconnect Button */}
      <button
        onClick={disconnect}
        className="w-full border py-2 rounded-xl border-gray-200 dark:border-zinc-700 hover:bg-red-600 transition text-sm cursor-pointer"
      >
        Disconnect
      </button>
    </>
  );
}
