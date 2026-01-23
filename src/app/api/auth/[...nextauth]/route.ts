import NextAuth, { type NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from '@/lib/db/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: 'read:user public_repo' } },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile) return false;

      const githubProfile = profile as {
        id: number;
        login: string;
        avatar_url: string;
        name?: string;
      };

      await prisma.user.upsert({
        where: { githubId: String(githubProfile.id) },
        update: {
          username: githubProfile.login,
          avatarUrl: githubProfile.avatar_url,
          name: githubProfile.name ?? null,
        },
        create: {
          githubId: String(githubProfile.id),
          username: githubProfile.login,
          avatarUrl: githubProfile.avatar_url,
          name: githubProfile.name ?? null,
        },
      });
      return true;
    },
    async jwt({ token, account, profile }) {
      // 1️⃣ Store GitHub access token (FIRST LOGIN ONLY)
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      // 2️⃣ Store DB user ID
      if (profile) {
        const githubProfile = profile as { id: number };

        const user = await prisma.user.findUnique({
          where: { githubId: String(githubProfile.id) },
        });

        if (user) {
          token.userId = user.id;
        }
      }

      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).userId = token.userId;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
