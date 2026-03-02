import { NextResponse } from "next/server";
import { auth, prisma } from "@/lib/auth";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
  // Extension Authorization
  const authHeader = req.headers.get("authorization");
  let userId: string | null = null;

  // Check extension token
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.EXTENSION_SECRET!) as any;
      // console.log("Decoded", decoded);

      userId = decoded.userId;
    } catch {
      console.log("Invalid Token");
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
  // console.log("POST API Job", body);

  const job = await prisma.jobApplication.create({
    data: {
      // Required fields
      userId: userId!,
      company: body.company,
      role: body.role,

      // Optional fields
      status: body.status ?? "APPLIED",
      dateApplied: body.dateApplied ? new Date(body.dateApplied) : new Date(),
      datePosted: body.datePosted ? new Date(body.datePosted) : new Date(),
      salaryMin: body.salaryMin !== null ? Number(body.salaryMin) : null,
      salaryMax: body.salaryMax !== null ? Number(body.salaryMax) : null,
      salaryCurrency: body.salaryCurrency ?? "USD",
      salaryType: body.salaryType ?? null,
      workMode: body.workMode ?? null,
      platform: body.platform ?? null,
      applicationUrl: body.applicationUrl ?? null,
      location: body.location ?? null,
      notes: body.notes ?? null,
    },
  });

  return NextResponse.json(job, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
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
