import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (req.nextUrl.pathname.startsWith('/api/auth') ||
            req.nextUrl.pathname.startsWith('/_next') ||
            req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname.startsWith('/imoveis') ||
            req.nextUrl.pathname.startsWith('/blog') ||
            req.nextUrl.pathname.startsWith('/contato') ||
            req.nextUrl.pathname.startsWith('/sobre') ||
            req.nextUrl.pathname.startsWith('/login') ||
            req.nextUrl.pathname.startsWith('/register') ||
            req.nextUrl.pathname.startsWith('/api/chat')) {
          return true
        }

        // Require authentication for admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token && (token.role === 'ADMIN' || token.role === 'OWNER')
        }

        // Require authentication for dashboard routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
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