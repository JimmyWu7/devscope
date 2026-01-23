import { prisma } from '@/lib/db/prisma';
import { fetchGitHub } from './client';

export async function syncRepos(userId: string, accessToken: string) {
  // Fetch GitHub repos
  const repos = await fetchGitHub('/user/repos?per_page=100', accessToken);

  for (const repo of repos) {
    await prisma.repository.upsert({
      where: { githubRepoId: String(repo.id) },
      update: {
        name: repo.name,
        description: repo.description,
        primaryLanguage: repo.language,
        stars: repo.stargazers_count,
        userId,
      },
      create: {
        githubRepoId: String(repo.id),
        name: repo.name,
        description: repo.description,
        primaryLanguage: repo.language,
        stars: repo.stargazers_count,
        userId,
      },
    });
  }

  return repos.length;
}
