
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN"
    const isAgent = token?.role === "AGENT"
    const isAuthenticated = !!token

    // Proteger rotas admin
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!isAdmin && !isAgent) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Proteger rotas do dashboard
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acesso a rotas públicas
        if (req.nextUrl.pathname.startsWith('/login') || 
            req.nextUrl.pathname.startsWith('/register') ||
            req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname.startsWith('/imoveis') ||
            req.nextUrl.pathname.startsWith('/blog') ||
            req.nextUrl.pathname.startsWith('/contato') ||
            req.nextUrl.pathname.startsWith('/sobre') ||
            req.nextUrl.pathname.startsWith('/api/') ||
            req.nextUrl.pathname.startsWith('/_next/') ||
            req.nextUrl.pathname.startsWith('/public/')) {
          return true
        }

        // Para rotas protegidas, verificar se está autenticado
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)',
  ]
}
