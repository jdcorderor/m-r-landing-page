import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes
const protectedRoutes = ["/paciente"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authTokenWS")?.value;
  
  const currentPath = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some(route => currentPath.startsWith(route));

  if (!token) {
    if (isProtected) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}