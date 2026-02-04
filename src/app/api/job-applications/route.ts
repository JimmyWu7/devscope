import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"
import { auth, prisma } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // console.log("POST Job", body);

  const job = await prisma.jobApplication.create({
    data: {
      ...body,
      userId: session.user.id,
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
