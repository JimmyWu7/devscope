import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface StorageResult {
  devscopeToken?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface DecodedToken {
  userId: string;
  scope: string;
  exp: number;
}

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Load token from storage
  useEffect(() => {
    chrome.storage.local.get(["devscopeToken"], (result) => {
      const storedToken = (result as StorageResult).devscopeToken ?? null;
      setToken(storedToken);
    });
  }, []);

  // Validate token expiration BEFORE calling API
  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        chrome.storage.local.remove("devscopeToken");
        setToken(null);
        setUser(null);
        return;
      }
    } catch (err) {
      console.error("Invalid token format");
      chrome.storage.local.remove("devscopeToken");
      setToken(null);
      setUser(null);
    }
  }, [token]);

  // Fetch user info
  useEffect(() => {
    if (!token) return;

    async function fetchUser() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          chrome.storage.local.remove("devscopeToken");
          setToken(null);
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [token]);

  function connectToDevScope() {
    chrome.tabs.create({
      url: "http://localhost:3000/extension-auth",
    });
  }

  function disconnect() {
    chrome.storage.local.remove("devscopeToken");
    setToken(null);
    setUser(null);
  }

  return (
    <div className="w-[340px] p-5 bg-linear-to-b from-white to-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight">DevScope</h2>
        <span className="text-xs text-gray-400">Extension</span>
      </div>

      {!token ? (
        <button
          onClick={connectToDevScope}
          className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition shadow-sm cursor-pointer"
        >
          Connect to DevScope
        </button>
      ) : loading ? (
        <div className="text-sm text-gray-500 animate-pulse">
          Syncing session...
        </div>
      ) : user ? (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-white shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Connected as</p>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>

          <button
            onClick={disconnect}
            className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition text-sm cursor-pointer"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Reconnecting...</p>
      )}
    </div>
  );
}

export default App;
