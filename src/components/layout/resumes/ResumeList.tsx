import { prisma } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ResumeListProps {
  userId: string;
}

export default async function ResumeList({ userId }: ResumeListProps) {
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (resumes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          No resumes uploaded yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium">{resume.fileName}</span>
                <span className="text-sm text-muted-foreground">
                  {(resume.fileSize / 1024).toFixed(1)} KB •{" "}
                  {new Date(resume.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Link
              href={`/api/resumes/${resume.id}/view`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
