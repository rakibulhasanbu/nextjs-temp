export const ROUTES = {
  superAdminRoutes: ["/overview", "/users"] as const,
  adminRoutes: ["/overview"] as const,
  public: ["/"] as const,
  auth: ["/auth/sign-in", "/auth/sign-up"] as const,
  authNotVerified: ["/auth/verify-email"] as const,
}

export const isRouteMatched = (pathname: string, routes: readonly string[]) =>
  routes.some((route) => pathname.startsWith(route))

export const isRouteExactMatched = (pathname: string, routes: readonly string[]) =>
  routes.some((route) => pathname === route)
