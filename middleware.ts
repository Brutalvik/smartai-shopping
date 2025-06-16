import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("x-token")?.value;

  // Match any of these route prefixes
  const protectedPrefixes = ["/seller/dashboard", "/dashboard"];

  const pathname = request.nextUrl.pathname;

  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Redirect to signin if not authenticated
  if (isProtected && (!token || token.length < 20)) {
    const redirectUrl = new URL("/auth/signin", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/seller/:path*",
    "/dashboard/:path*",
    // (Optional) Future protection paths:
    // "/account/:path*",
    // "/orders/:path*",
  ],
};
