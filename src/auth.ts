import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
        language: { label: "Language", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const email = credentials.email as string;
        const name = (credentials.name as string) || email.split("@")[0];
        const language = (credentials.language as string) || "en";

        // Upsert user in DB
        const user = await prisma.user.upsert({
          where: { email },
          update: {
            name,
            language,
          },
          create: {
            email,
            name,
            language,
            role: "user",
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          language: user.language,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
    authorized({ request: { nextUrl }, auth: session }) {
      const protectedPaths = ["/dashboard", "/quiz/result", "/profile"];
      const isProtected = protectedPaths.some((p) => nextUrl.pathname.startsWith(p));

      if (isProtected && !session?.user) {
        const loginUrl = new URL("/login", nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return false;
      }

      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
