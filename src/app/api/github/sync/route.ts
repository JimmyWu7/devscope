import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { syncRepos } from '@/lib/github/syncRepos';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken || !(session as any).userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Look up user in DB
  const userId = (session as any).userId;

  if (!userId) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const token = (session as any).accessToken;
    const result = await syncRepos(userId, token);

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
