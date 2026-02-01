import React from "react";
import { prisma } from "./auth";

export async function syncGitHubData({
  userId,
  accessToken,
}: {
  userId: string;
  accessToken: string;
}) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.github+json",
  };

  const profileRes = await fetch("https://api.github.com/user", { headers });
  const profile = await profileRes.json();

  await prisma.githubProfile.upsert({
    where: { userId },
    update: {
      username: profile.login,
      avatarUrl: profile.avatar_url,
      profileUrl: profile.html_url,
    },
    create: {
      userId,
      githubId: profile.id,
      username: profile.login,
      avatarUrl: profile.avatar_url,
      profileUrl: profile.html_url,
    },
  });

  const reposRes = await fetch(
    "https://api.github.com/user/repos?per_page=100&type=public",
    { headers }
  );
  const repos = await reposRes.json();

  await prisma.githubRepo.deleteMany({ where: { userId } });

  await prisma.githubRepo.createMany({
    data: repos.map((repo: any) => ({
      userId,
      repoId: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      isFork: repo.fork,
      isPrivate: repo.private,
      htmlUrl: repo.html_url,
      pushedAt: new Date(repo.pushed_at),
    })),
  });

  await prisma.githubSync.upsert({
    where: { userId },
    update: { syncedAt: new Date() },
    create: { userId, syncedAt: new Date() },
  });
}
