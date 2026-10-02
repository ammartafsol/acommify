import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Routes that don't require authentication (auth routes)
const AUTH_ROUTES = [
  "/login",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

// Public routes accessible without authentication
const PUBLIC_ROUTES = ["/"];
const PUBLIC_PREFIXES = ["/legal"];

const getStrippedRoute = (pathname) =>
  pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

// Function to check if route is an auth route
const isAuthRoute = (pathname) => {
  const route = getStrippedRoute(pathname);
  return AUTH_ROUTES.includes(route);
};

// Function to check if route is a public (no-auth) route
const isPublicRoute = (pathname) => {
  const route = getStrippedRoute(pathname);
  return (
    PUBLIC_ROUTES.includes(route) ||
    PUBLIC_PREFIXES.some((prefix) => route.startsWith(prefix))
  );
};

// Function to check if route requires authentication
const requiresAuth = (pathname) => {
  return !isAuthRoute(pathname) && !isPublicRoute(pathname);
};

export default function middleware(request) {
  const { pathname } = request.nextUrl;
  const intlResponse = intlMiddleware(request);

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/_vercel") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    pathname.startsWith("/public")
  ) {
    return intlResponse;
  }

  const encryptedToken = request.cookies.get("_xpdx_acom-web")?.value;

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (encryptedToken && isAuthRoute(pathname)) {
    const dashboardUrl = new URL("/resident", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Check if route requires authentication
  if (requiresAuth(pathname)) {
    if (!encryptedToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|.*\\..*).*)",
  ],
};
