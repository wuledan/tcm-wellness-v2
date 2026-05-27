import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        return {
          id: crypto.randomUUID(),
          email: credentials.email as string,
          name: (credentials.name as string) || (credentials.email as string).split("@")[0],
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
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
