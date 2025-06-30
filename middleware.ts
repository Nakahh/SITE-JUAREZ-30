import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    const isAgent = token?.role === "AGENT";
    const isAuthenticated = !!token;
    const { pathname } = req.nextUrl;

    console.log(
      `Middleware: ${pathname}, User: ${token?.email || "anonymous"}, Role: ${token?.role || "none"}`,
    );

    // Proteger rotas admin - apenas ADMIN tem acesso
    if (pathname.startsWith("/admin")) {
      if (!isAdmin) {
        console.log("Admin access denied, redirecting to login");
        return NextResponse.redirect(
          new URL("/login?error=access_denied", req.url),
        );
      }
    }

    // Proteger rotas do dashboard - usuários autenticados
    if (pathname.startsWith("/dashboard")) {
      if (!isAuthenticated) {
        console.log("Dashboard access denied, redirecting to login");
        return NextResponse.redirect(
          new URL(
            "/login?callbackUrl=" + encodeURIComponent(pathname),
            req.url,
          ),
        );
      }
    }

    // Redirecionar usuários logados da página de login
    if (pathname === "/login" && isAuthenticated) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Sempre permitir acesso à API de auth
        if (pathname.startsWith("/api/auth")) {
          return true;
        }

        // Rotas admin precisam de role ADMIN
        if (pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        // Rotas do dashboard precisam de autenticação
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }

        // Outras rotas são públicas
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - Files with extension (e.g., .png, .jpg, .css, .js)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public/|.*\\..*).*)",
  ],
};
