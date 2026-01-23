import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !(session as any).userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session as any).userId;

  const [repoCount, syncStatus] = await Promise.all([
    prisma.repository.count({ where: { userId } }),
    prisma.syncStatus.findUnique({ where: { userId } }),
  ]);

  return NextResponse.json({
    repoCount,
    syncStatus,
  });
}
