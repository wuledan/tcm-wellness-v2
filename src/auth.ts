import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Only import Prisma if DATABASE_URL is set
function getPrisma() {
  try {
    if (!process.env.DATABASE_URL) return null;
    const { PrismaClient } = require("@prisma/client");
    const g = globalThis as unknown as { __prisma: any };
    if (!g.__prisma) g.__prisma = new PrismaClient();
    return g.__prisma;
  } catch {
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
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

        let role = "user";
        const prisma = getPrisma();
        if (prisma) {
          try {
            const user = await prisma.user.upsert({
              where: { email },
              update: { name, language },
              create: { email, name, language, role },
            });
            role = user.role || "user";
          } catch (e) {
            console.warn("DB lookup failed, using default role:", e);
          }
        }

        return {
          id: email,
          email,
          name,
          role,
          language,
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
      const protectedPaths = ["/dashboard", "/quiz/result", "/profile", "/admin"];
      const isProtected = protectedPaths.some((p) => nextUrl.pathname.startsWith(p));

      if (isProtected && !session?.user) {
        const loginUrl = new URL("/login", nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return false;
      }

      // Admin pages also need admin role check - handled in layout
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
