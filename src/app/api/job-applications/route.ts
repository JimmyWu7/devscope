import { NextResponse } from "next/server";
import { auth, prisma } from "@/lib/auth";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  // Extension Authorization
  const authHeader = req.headers.get("authorization");
  let userId: string | null = null;

  // Check extension token
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.EXTENSION_SECRET!) as any;

      userId = decoded.userId;
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  // Web App Authorization
  if (!userId) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    userId = session.user.id;
  }

  const body = await req.json();
  // console.log("POST Job", body);

  const job = await prisma.jobApplication.create({
    data: {
      ...body,
      userId: userId,
      dateApplied: new Date(body.dateApplied),
      datePosted: body.datePosted ? new Date(body.datePosted) : new Date(), // ✅ default to now
      salaryMin: body.salaryMin ?? null,
      salaryMax: body.salaryMax ?? null,
      salaryCurrency: body.salaryCurrency ?? null,
      applicationUrl: body.applicationUrl ?? null,
      location: body.location ?? null,
      notes: body.notes ?? null,
    },
  });

  return NextResponse.json(job);
}

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = await prisma.jobApplication.findMany({
    where: { userId: session.user.id },
    orderBy: { dateApplied: "desc" },
  });

  return NextResponse.json(jobs);
}
