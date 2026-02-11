import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function GET() {
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: "test.txt",
      Body: "Hello from Next.js",
    }),
  );

  return NextResponse.json({ success: true });
}
