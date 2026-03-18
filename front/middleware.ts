import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/auth/login", "/auth/register", "/_next", "/api/proxy", "/api/auth/logout", "/favicon.ico", "/public"];
const TOKEN_COOKIE = "abr_auth_token";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublic) return NextResponse.next();

  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/proxy|auth/login|auth/register).*)",
  ],
};
