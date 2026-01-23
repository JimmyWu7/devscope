'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/github/sync');
      const data = await res.json();

      if (res.ok) {
        setMessage(`Synced ${data.syncedRepos} repositories!`)
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>

      <button
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        onClick={handleSync}
        disabled={loading}
      >
        {loading ? 'Syncing...' : 'Sync GitHub Data'}
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
