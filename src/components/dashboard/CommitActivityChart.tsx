'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useMemo, useState } from 'react';

type DataPoint = {
  date: string;
  count: number;
};

type Range = '1W' | '1M' | '3M' | 'YTD' | '1Y' | 'ALL';

type Props = {
  data: DataPoint[];
};

const RANGE_OPTIONS: Range[] = ['1W', '1M', '3M', 'YTD', '1Y', 'ALL'];

export default function CommitActivityChart({ data }: Props) {
  const [range, setRange] = useState<Range>('1M');

  // Ensure chronological order
  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [data]);

  const filteredData = useMemo(() => {
    if (range === 'ALL') return sortedData;

    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case '1W':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'YTD':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return sortedData.filter((d) => new Date(d.date) >= startDate);
  }, [sortedData, range]);

  return (
    <div className="rounded border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Commit Activity</h2>
        <p className="text-sm text-gray-500">
          {filteredData.reduce((sum, d) => sum + d.count, 0)} total commits
        </p>

        <div className="flex gap-1">
          {RANGE_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded px-2 py-1 text-sm ${
                range === r
                  ? 'bg-blue-600 text-white'
                  : 'border text-gray-600 hover:bg-gray-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })
              }
            />
            <YAxis allowDecimals={false} />
            <Tooltip
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
