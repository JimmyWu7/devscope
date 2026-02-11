"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ResumeUploader() {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    setUploading(true);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/resumes/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);
    toast.success("Resume uploaded!");
    window.location.reload();
  }

  return (
    <Card className="border-dashed border-2 border-muted hover:border-primary transition-colors">
      <CardContent className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}

          <p className="text-sm text-muted-foreground">
            Upload your resume (PDF only)
          </p>

          {fileName && (
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              {fileName}
            </div>
          )}
        </div>

        <Button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="cursor-pointer"
        >
          {uploading ? "Uploading..." : "Choose File"}
        </Button>
      </CardContent>
    </Card>
  );
}
