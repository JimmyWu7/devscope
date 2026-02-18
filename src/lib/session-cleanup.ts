import { prisma } from "@/lib/auth";

export async function cleanExpiredSessions() {
  const deleted = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  console.log(`Deleted ${deleted.count} expired sessions`);
}
