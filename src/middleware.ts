import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Define paths that REQUIRE authentication
  // We use .some() to match sub-paths (e.g., /projects/add matches /projects)
  const protectedPaths = [
    "/dashboard",
    "/profile",
    "/components/add",
    "/projects/add",
  ];

  // 2. Define paths that are ONLY for guests (Logged in users shouldn't see these)
  const authPaths = ["/login", "/register"];

  // 3. Get the token from cookies
  const token = request.cookies.get("token")?.value || "";

  // CHECK 1: Is user trying to access a protected route without a token?
  const isProtected = protectedPaths.some((prefix) => path.startsWith(prefix));
  
  if (isProtected && !token) {
    // Redirect to login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // CHECK 2: Is user trying to access login/register while already logged in?
  if (authPaths.includes(path) && token) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Continue with the request if checks pass
  return NextResponse.next();
}

// Config: Apply middleware to all routes EXCEPT static files (images, fonts, etc.)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};