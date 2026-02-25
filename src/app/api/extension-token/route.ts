import { auth } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = jwt.sign(
    {
      userId: session.user.id,
      scope: "extension",
    },
    process.env.EXTENSION_SECRET!,
    { expiresIn: "1h" },
  );

  // console.log("Extension JWT Token", token);

  return NextResponse.json({ token });
}
