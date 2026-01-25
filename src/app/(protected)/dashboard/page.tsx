'use client';

import CommitActivityChart from '@/components/dashboard/CommitActivityChart';
import { useEffect, useState } from 'react';

type SyncStatus = {
  status: string;
  lastSyncedAt?: string;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [repoCount, setRepoCount] = useState<number | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [activityData, setActivityData] = useState<
    { date: string; count: number }[]
  >([]);

  const loadDashboard = async () => {
    const res = await fetch('/api/dashboard');
    const data = await res.json();
    setRepoCount(data.repoCount);
    setSyncStatus(data.syncStatus);

    const activityRes = await fetch('/api/analytics/commits');
    const activity = await activityRes.json();
    setActivityData(activity);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleSync = async () => {
    setLoading(true);
    setMessage('');

    try {
      setSyncStatus((prev) =>
        prev ? { ...prev, status: 'syncing' } : { status: 'syncing' },
      );
      const res = await fetch('/api/github/sync');
      const data = await res.json();

      if (res.ok) {
        await loadDashboard();
        setMessage(
          `Synced ${data.repos} repositories and ${data.commits} commits.`,
        );
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
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="space-y-2 rounded border p-4">
        <p>
          <strong>Repositories:</strong> {repoCount ?? '—'}
        </p>
        <p>
          <strong>Last Sync:</strong>{' '}
          {syncStatus?.lastSyncedAt
            ? new Date(syncStatus.lastSyncedAt).toLocaleString()
            : 'Never'}
        </p>
        <p>
          <strong>Status:</strong> {syncStatus?.status ?? 'idle'}
        </p>
      </div>

      <button
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        onClick={handleSync}
        disabled={loading}
      >
        {loading ? 'Syncing...' : 'Sync GitHub Data'}
      </button>

      {message && <p>{message}</p>}
      {activityData.length > 0 && <CommitActivityChart data={activityData} />}
    </div>
  );
}
