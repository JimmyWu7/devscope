import { auth, prisma } from "@/lib/auth";
import { headers } from "next/headers";
import { r2 } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, context: RouteContext) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await context.params;

  if (!id) {
    return new Response("Invalid ID", { status: 400 });
  }

  const resume = await prisma.resume.findUnique({
    where: { id },
  });

  if (!resume || resume.userId !== session.user.id || !resume.thumbnailKey) {
    return new Response("Not found", { status: 404 });
  }

  const object = await r2.send(
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: resume.thumbnailKey,
    }),
  );

  return new Response(object.Body as ReadableStream, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
