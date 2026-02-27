import { useEffect, useState } from "react";
import type { Status, StorageData, ThemeMode, User } from "../../shared/types";

export function useStorage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [isDark, setIsDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const [privacyMode, setPrivacyMode] = useState(false);

  function resolveDark(mode: ThemeMode) {
    if (mode === "dark") return true;
    if (mode === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  useEffect(() => {
    chrome.storage.local.get(
      [
        "devscopeToken",
        "devscopeUser",
        "devscopeStatus",
        "themeMode",
        "privacyMode",
      ],
      (result) => {
        const data = result as StorageData & {
          themeMode?: ThemeMode;
        };

        setToken(data.devscopeToken ?? null);
        setUser(data.devscopeUser ?? null);
        setStatus(data.devscopeStatus ?? "idle");
        const mode = data.themeMode ?? "system";
        setThemeMode(mode);
        setIsDark(resolveDark(mode));
        setPrivacyMode(data.privacyMode ?? false);
      },
    );

    chrome.storage.onChanged.addListener((changes) => {
      if (changes.devscopeUser)
        setUser((changes.devscopeUser.newValue as User) ?? null);

      if (changes.devscopeStatus)
        setStatus((changes.devscopeStatus.newValue as Status) ?? "idle");

      if (changes.devscopeToken)
        setToken((changes.devscopeToken.newValue as string) ?? null);

      if (changes.themeMode) {
        const newMode = (changes.themeMode.newValue as ThemeMode) ?? "system";
        setThemeMode(newMode);
        setIsDark(resolveDark(newMode));
      }

      if (changes.privacyMode)
        setPrivacyMode((changes.privacyMode.newValue as boolean) ?? false);
    });
  }, []);

  useEffect(() => {
    if (themeMode !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const listener = () => {
      setIsDark(media.matches);
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [themeMode]);

  function setTheme(mode: ThemeMode) {
    setThemeMode(mode);
    setIsDark(resolveDark(mode));
    chrome.storage.local.set({ themeMode: mode });
  }

  function togglePrivacyMode() {
    const newValue = !privacyMode;
    setPrivacyMode(newValue);
    chrome.storage.local.set({ privacyMode: newValue });
  }

  function disconnect() {
    chrome.storage.local.remove([
      "devscopeToken",
      "devscopeUser",
      "devscopeStatus",
      "lastSync",
      "lastActivityAt",
    ]);

    setToken(null);
    setUser(null);
    setStatus("idle");
  }

  return {
    token,
    user,
    status,
    themeMode,
    isDark,
    setTheme,
    privacyMode,
    togglePrivacyMode,
    disconnect,
  };
}
