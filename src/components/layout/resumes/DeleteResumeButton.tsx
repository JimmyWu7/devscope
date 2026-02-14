"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

interface DeleteResumeButtonProps {
  resumeId: string;
}

export default function DeleteResumeButton({
  resumeId,
}: DeleteResumeButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this resume?");
    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/resumes/${resumeId}/delete`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      toast.success("Resume deleted successfully");
      router.refresh();
    } catch {
      toast.error("Failed to delete resume");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <Button
        variant="destructive"
        size="icon"
        onClick={handleDelete}
        disabled={loading}
        className="cursor-pointer"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
