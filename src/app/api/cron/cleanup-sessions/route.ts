import { cleanExpiredSessions } from "@/lib/session-cleanup";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const isCron = req.headers.get("x-vercel-cron");

  if (!isCron) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await cleanExpiredSessions();
  return NextResponse.json({ success: true });
}
