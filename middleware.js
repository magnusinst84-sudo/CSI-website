import { NextResponse } from "next/server";
import { AUTH_SESSION_COOKIE } from "@/lib/auth-session";

/** Public routes — no login required */
const PUBLIC_PATHS = ["/", "/login"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".");

  if (isPublic) {
    return NextResponse.next();
  }

  const session = request.cookies.get(AUTH_SESSION_COOKIE)?.value;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
