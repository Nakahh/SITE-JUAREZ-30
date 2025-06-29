
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Middleware logic
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Permitir rotas públicas
        if (
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/_next') ||
          pathname === '/' ||
          pathname.startsWith('/imoveis') ||
          pathname.startsWith('/blog') ||
          pathname.startsWith('/contato') ||
          pathname.startsWith('/sobre') ||
          pathname.startsWith('/login') ||
          pathname.startsWith('/register') ||
          pathname.startsWith('/depoimentos') ||
          pathname.startsWith('/corretores') ||
          pathname.startsWith('/desenvolvedor') ||
          pathname.startsWith('/kryonix') ||
          pathname.startsWith('/simulador-financiamento') ||
          pathname.startsWith('/comparar') ||
          pathname.startsWith('/api/chat')
        ) {
          return true
        }

        // Requerer autenticação para rotas admin
        if (pathname.startsWith('/admin')) {
          return !!token && (token.role === 'ADMIN' || token.role === 'OWNER')
        }

        // Requerer autenticação para dashboard
        if (pathname.startsWith('/dashboard')) {
          return !!token
        }

        return true
      }
    }
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
