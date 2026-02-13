import { prisma } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import DeleteResumeButton from "./DeleteResumeButton";

interface ResumeListProps {
  userId: string;
  page: number;
}

const PAGE_SIZE = 3;

export default async function ResumeList({ userId, page }: ResumeListProps) {
  const total = await prisma.resume.count({
    where: { userId },
  });

  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

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
    <div className="space-y-8">
      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {resumes.map((resume) => (
          <Card
            key={resume.id}
            className="overflow-hidden hover:shadow-md transition-shadow group"
          >
            {/* Delete Button */}
            <div className="relative aspect-square w-full bg-muted overflow-hidden">
              <DeleteResumeButton resumeId={resume.id} />
              <iframe
                src={`/api/resumes/${resume.id}/view#toolbar=0`}
                className="w-full h-full pointer-events-none"
              />

              <div className="absolute inset-0 bg-background/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Link
                  href={`/api/resumes/${resume.id}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="cursor-pointer">
                    <Eye className="h-4 w-4 mr-2" />
                    View Resume
                  </Button>
                </Link>
              </div>
            </div>

            <CardContent className="px-4 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{resume.fileName}</span>
              </div>

              <p className="text-xs text-muted-foreground">
                {(resume.fileSize / 1024).toFixed(1)} KB •{" "}
                {new Date(resume.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          {/* Previous */}
          {page > 1 ? (
            <Link href={`/resumes?page=${page - 1}`} scroll={false}>
              <Button variant="outline" size="sm" className="cursor-pointer">
                Previous
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="cursor-pointer"
            >
              Previous
            </Button>
          )}

          {/* Next */}
          {page < totalPages ? (
            <Link href={`/resumes?page=${page + 1}`} scroll={false}>
              <Button variant="outline" size="sm" className="cursor-pointer">
                Next
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="cursor-pointer"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
