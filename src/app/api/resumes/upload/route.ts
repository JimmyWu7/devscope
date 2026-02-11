import { auth, prisma } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF allowed" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  const fileKey = `resumes/${session.user.id}/${randomUUID()}.pdf`;

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileKey,
      Body: bytes,
      ContentType: "application/pdf",
    }),
  );

  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      fileName: file.name,
      fileKey,
      fileSize: file.size,
    },
  });

  return NextResponse.json(resume);
}
