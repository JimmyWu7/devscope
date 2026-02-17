import Link from "next/link";
import { prisma } from "@/lib/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Lock } from "lucide-react";

interface ProjectProps {
  userId: string;
  page: number;
  language: string;
  type: string;
  sort: string;
  year: string;
}

const PAGE_SIZE = 9;

export default async function Projects({
  userId,
  page,
  language,
  type,
  sort,
  year,
}: ProjectProps) {
  const where: any = { userId };

  if (year !== "all") {
    const start = new Date(Number(year), 0, 1); // Jan 1 of that year
    const end = new Date(Number(year) + 1, 0, 1); // Jan 1 of next year
    where.pushedAt = { gte: start, lt: end };
  }

  // Language filter
  if (language !== "all") {
    where.language = language;
  }

  // Type filter
  if (type === "public") where.isPrivate = false;
  // if (type === "private") where.isPrivate = true;
  if (type === "forked") where.isFork = true;

  // Sort by
  let orderBy: any = { pushedAt: "desc" };
  switch (sort) {
    case "updated_asc":
      orderBy = { pushedAt: "asc" };
      break;
    case "stars_desc":
      orderBy = { stars: "desc" };
      break;
    case "stars_asc":
      orderBy = { stars: "asc" };
      break;
    case "forks_desc":
      orderBy = { forks: "desc" };
      break;
    case "forks_asc":
      orderBy = { forks: "asc" };
      break;
    case "name_asc":
      orderBy = { name: "asc" };
      break;
    case "name_desc":
      orderBy = { name: "desc" };
      break;
  }

  const [repos, total] = await Promise.all([
    prisma.githubRepo.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.githubRepo.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

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
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-6">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1;

            // Build URL with filters and sort
            const params = new URLSearchParams();
            params.set("page", pageNumber.toString());
            if (language !== "all") params.set("language", language);
            if (type !== "all") params.set("type", type);
            if (sort !== "updated_desc") params.set("sort", sort);
            if (year !== "all") params.set("year", year);

            return (
              <Link
                key={pageNumber}
                href={`/projects?${params.toString()}`}
                className={`px-3 py-1 rounded-md text-sm border ${
                  page === pageNumber
                    ? "bg-muted-foreground text-white"
                    : "hover:bg-muted"
                }`}
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
