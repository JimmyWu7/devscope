import type { Status } from "../../shared/types";

export default function Header({ status }: { status: Status }) {
  return (
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
  );
}
