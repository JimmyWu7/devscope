import { prisma } from '@/lib/db/prisma';
import { fetchGitHub } from './client';

export async function syncRepos(userId: string, accessToken: string) {
  // Mark sync as started
  await prisma.syncStatus.upsert({
    where: { userId },
    update: {
      status: 'syncing',
      lastSyncedAt: new Date(),
    },
    create: {
      userId,
      status: 'syncing',
      lastSyncedAt: new Date(),
    },
  });

  try {
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

    // Mark sync as successful
    await prisma.syncStatus.update({
      where: { userId },
      data: {
        status: 'success',
        lastSyncedAt: new Date(),
      },
    });
    return repos.length;
  } catch (error) {
    // Mark sync as failed
    await prisma.syncStatus.update({
      where: { userId },
      data: {
        status: 'error',
      },
    });

    throw error;
  }
}
