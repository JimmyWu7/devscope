import { prisma } from '@/lib/db/prisma';
import { fetchGitHub } from './client';

export async function syncRepos(userId: string, accessToken: string) {
  // Mark sync as started
  await prisma.syncStatus.upsert({
    where: { userId },
    update: {
      status: 'syncing',
    },
    create: {
      userId,
      status: 'syncing',
    },
  });

  try {
    // Fetch GitHub repos
    const repos = await fetchGitHub('/user/repos?per_page=100', accessToken);

    let totalCommits = 0;

    for (const repo of repos) {
      const dbRepo = await prisma.repository.upsert({
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
      // Fetch commits (last 30)
      const commits = await fetchGitHub(
        `/repos/${repo.owner.login}/${repo.name}/commits?per_page=30`,
        accessToken,
      );
      for (const commit of commits) {
        const existing = await prisma.commit.findUnique({
          where: { githubCommitSha: commit.sha },
        });

        if (!existing) {
          await prisma.commit.create({
            data: {
              githubCommitSha: commit.sha,
              message: commit.commit.message,
              committedAt: new Date(commit.commit.author.date),
              repositoryId: dbRepo.id,
            },
          });

          totalCommits++;
        }
      }
    }

    // Mark sync as successful
    await prisma.syncStatus.update({
      where: { userId },
      data: {
        status: 'success',
        lastSyncedAt: new Date(),
      },
    });
    return {
      repos: repos.length,
      commits: totalCommits,
    };
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
