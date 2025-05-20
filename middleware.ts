import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path is for admin routes (except login)
  const isAdminRoute = path.startsWith("/admin") && !path.startsWith("/admin/login")

  // Get the admin_authenticated cookie
  const isAuthenticated = request.cookies.get("admin_authenticated")?.value === "true"

  // If it's an admin route and the user is not authenticated, redirect to login
  if (isAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // If the user is authenticated and trying to access login page, redirect to dashboard
  if (path === "/admin/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/admin/:path*"],
}
