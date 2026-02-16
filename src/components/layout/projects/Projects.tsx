import Link from "next/link";
import { prisma } from "@/lib/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Lock } from "lucide-react";

interface ProjectProps {
  userId: string;
  page: number;
}

export default async function Projects({ userId }: ProjectProps) {
  const repos = await prisma.githubRepo.findMany({
    where: { userId },
    orderBy: [{ pushedAt: "desc" }],
  });

  if (repos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground text-center">
          No repositories found. Try syncing GitHub.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <Link
            key={repo.id}
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="relative h-full transition-all duration-200 hover:shadow-lg hover:border-primary/40 hover:-translate-y-1">
              {/* Forked Badge */}
              {repo.isFork && (
                <Badge
                  variant="outline"
                  className="absolute top-2 right-2 flex items-center gap-1 text-xs"
                >
                  <GitFork className="h-3 w-3" />
                  Forked
                </Badge>
              )}
              <CardHeader className="flex flex-col justify-between pb-2">
                <span className="font-medium truncate group-hover:text-primary transition-colors">
                  {repo.name}
                  <p className="text-xs text-muted-foreground">
                    {repo.fullName}
                  </p>
                </span>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                  {repo.description ?? "No description provided."}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {repo.language && (
                    <Badge variant="secondary">{repo.language}</Badge>
                  )}

                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {repo.stars}
                  </div>

                  <div className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    {repo.forks}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Last Updated {new Date(repo.pushedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
