import { prisma } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteResumeButton from "./DeleteResumeButton";
import { redirect } from "next/navigation";

interface ResumeListProps {
  userId: string;
  page: number;
}

const PAGE_SIZE = 8;

export default async function ResumeList({ userId, page }: ResumeListProps) {
  const [total, resumes] = await prisma.$transaction([
    prisma.resume.count({ where: { userId } }),
    prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) {
    redirect(`/resumes?page=${totalPages}`);
  }

  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  if (resumes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground text-center">
          No resumes uploaded yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grid Layout */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {resumes.map((resume) => (
          <Card
            key={resume.id}
            className="overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="relative aspect-3/4 w-full bg-muted overflow-hidden flex items-center justify-center">
              <DeleteResumeButton resumeId={resume.id} />

              {/* Static PDF Preview */}
              {resume.thumbnailKey ? (
                <img
                  src={`/api/resumes/${resume.id}/thumbnail`}
                  alt="Resume thumbnail"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <FileText className="h-14 w-14 text-primary mb-3" />
                  <p className="font-medium truncate w-full">
                    {resume.fileName}
                  </p>
                </div>
              )}

              {/* Hover Overlay */}
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
          Page {page} of {totalPages} • Showing {start}–{end} of {total} resumes
        </p>

        <div className="flex gap-2">
          {/* Previous Button */}
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

          {/* Next Button */}
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
