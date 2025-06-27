import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Redirecionar usuários não-ADMIN de rotas /admin
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirecionar usuários não-ADMIN ou AGENT de rotas /admin/imoveis
    if (
      pathname.startsWith("/admin/imoveis") &&
      token?.role !== "ADMIN" &&
      token?.role !== "AGENT"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirecionar usuários não-ADMIN ou AGENT de rotas /admin/leads e /admin/visitas
    if (
      (pathname.startsWith("/admin/leads") ||
        pathname.startsWith("/admin/visitas")) &&
      token?.role !== "ADMIN" &&
      token?.role !== "AGENT"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirecionar usuários não-ADMIN de rotas /admin/usuarios, /admin/blog e /admin/depoimentos
    if (
      (pathname.startsWith("/admin/usuarios") ||
        pathname.startsWith("/admin/blog") ||
        pathname.startsWith("/admin/depoimentos")) &&
      token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"], // Protege todas as rotas que começam com /admin e /dashboard
};
