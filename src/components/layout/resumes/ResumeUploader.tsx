"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function ResumeUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customName, setCustomName] = useState("");
  const [uploading, setUploading] = useState(false);

  function sanitizeInput(value: string) {
    return value
      .replace(/[^\w\s-]/g, "") // allow letters, numbers, spaces, dash
      .slice(0, 50); // max 50 chars
  }

  function handleSelect(file: File) {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    setSelectedFile(file);
    setCustomName(file.name.replace(".pdf", ""));
    setOpen(true);
  }

  async function handleUpload() {
    if (!selectedFile) return;

    const cleanedName = sanitizeInput(customName).trim();

    if (!cleanedName) {
      toast.error("Resume name cannot be empty.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("customName", cleanedName);

    try {
      const res = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      toast.success("Resume uploaded successfully!");
      handleClose();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setSelectedFile(null);
    setCustomName("");
    setUploading(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleChangeFile() {
    if (uploading) return;

    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  }

  return (
    <>
      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleSelect(file);
        }}
      />

      {/* Upload Resume Button */}
      <Button
        size="sm"
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer"
      >
        <Upload className="h-4 w-4" />
        Upload Resume
      </Button>

      {/* Upload Dialog Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-md p-6 relative">
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 cursor-pointer hover:text-red-500" />
            </button>

            <h2 className="text-lg font-semibold mb-4">Upload Resume</h2>

            {/* Change selected file button */}
            {selectedFile && (
              <div className="flex items-center justify-between text-sm mb-4 pb-3 border-b">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="truncate">{selectedFile.name}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleChangeFile}
                  disabled={uploading}
                  className="text-xs cursor-pointer"
                >
                  Change
                </Button>
              </div>
            )}

            {/* Custom Filename Input Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">File Name</label>

              <Input
                value={customName}
                onChange={(e) => setCustomName(sanitizeInput(e.target.value))}
              />

              <p className="text-xs text-muted-foreground">
                Max 50 characters. Letters, numbers, spaces and dashes only.
              </p>
            </div>

            {/* Confirm Resume Upload Button */}
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full cursor-pointer"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Confirm Upload"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
