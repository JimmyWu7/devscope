import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !(session as any).userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session as any).userId;

  const commits: { committedAt: Date }[] = await prisma.commit.findMany({
    where: {
      repository: { userId },
    },
    select: {
      committedAt: true,
    },
  });

  // Aggregate by day
  const activity: Record<string, number> = {};

  commits.forEach((commit) => {
    const day = commit.committedAt.toISOString().split('T')[0];
    activity[day] = (activity[day] || 0) + 1;
  });

  const result = Object.entries(activity).map(([date, count]) => ({
    date,
    count,
  }));

  return NextResponse.json(result);
}
