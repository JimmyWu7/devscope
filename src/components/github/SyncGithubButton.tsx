"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SyncGithubButton() {
  const handleSyncGithub = async () => {
    try {
      const res = await fetch("/api/github/sync", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("GitHub synced successfully!");
      } else {
        toast.error(data.error ?? "Failed to sync GitHub");
      }
    } catch {
      toast.error("Unexpected error while syncing GitHub");
    }
  };

  return <Button onClick={handleSyncGithub}>Sync GitHub</Button>;
}
