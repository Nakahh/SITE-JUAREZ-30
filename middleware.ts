import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const { token } = req.nextauth

    // Redirecionar usuários não-ADMIN de rotas /admin
    if (pathname.startsWith("/admin") && token?.papel !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Redirecionar usuários não-ADMIN, CORRETOR ou ASSISTENTE de rotas /admin/imoveis
    if (
      pathname.startsWith("/admin/imoveis") &&
      token?.papel !== "ADMIN" &&
      token?.papel !== "CORRETOR" &&
      token?.papel !== "ASSISTENTE"
    ) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Redirecionar usuários não-ADMIN ou CORRETOR de rotas /admin/leads e /admin/visitas
    if (
      (pathname.startsWith("/admin/leads") || pathname.startsWith("/admin/visitas")) &&
      token?.papel !== "ADMIN" &&
      token?.papel !== "CORRETOR"
    ) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Redirecionar usuários não-ADMIN de rotas /admin/usuarios, /admin/blog e /admin/depoimentos
    if (
      (pathname.startsWith("/admin/usuarios") ||
        pathname.startsWith("/admin/blog") ||
        pathname.startsWith("/admin/depoimentos")) &&
      token?.papel !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Apenas usuários autenticados podem acessar rotas protegidas
    },
    pages: {
      signIn: "/login", // Página de login personalizada
    },
  },
)

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"], // Protege todas as rotas que começam com /admin e /dashboard
}
