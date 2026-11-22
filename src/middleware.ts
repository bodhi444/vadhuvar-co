import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "fm_admin_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "cinematic-frame-motion-studio-ultra-secure-secret-key-2025"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const token = request.cookies.get(COOKIE_NAME)?.value;

    let isAuthenticated = false;
    if (token) {
      try {
        await jwtVerify(token, SECRET_KEY);
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    // If authenticated and visiting login page, redirect to dashboard
    if (isAuthenticated && isLoginPage) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // If not authenticated and visiting protected admin page, redirect to login
    if (!isAuthenticated && !isLoginPage) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
