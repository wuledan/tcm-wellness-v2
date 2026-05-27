import { auth } from "@/auth";

export default auth((req) => {
  const protectedPaths = ["/dashboard", "/quiz/result", "/profile"];
  const isProtected = protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p));

  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/quiz/result/:path*", "/profile/:path*"],
};
