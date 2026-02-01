"use server";

import { auth, prisma } from "@/lib/auth";
import { syncGitHubData } from "@/lib/github";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await prisma.account.findFirst({
    where: { userId: session.user.id, providerId: "github" },
  });

  if (!account?.accessToken) {
    return NextResponse.json(
      { error: "No GitHub token found" },
      { status: 400 }
    );
  }

  await syncGitHubData({
    userId: session.user.id,
    accessToken: account.accessToken,
  });

  return NextResponse.json({ success: true });
}
