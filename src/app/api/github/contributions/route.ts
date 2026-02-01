import { auth, prisma } from "@/lib/auth";
import { fetchGithubContributions } from "@/lib/github-contributions";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const githubAccount = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
  });

  const githubProfile = await prisma.githubProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!githubAccount?.accessToken || !githubProfile?.username) {
    return NextResponse.json(
      { error: "GitHub not connected" },
      { status: 400 }
    );
  }

  const calendar = await fetchGithubContributions(
    githubProfile.username,
    githubAccount.accessToken
  );

  return NextResponse.json(calendar);
}
