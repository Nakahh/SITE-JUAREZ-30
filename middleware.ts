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
        const { pathname } = req.nextUrl

        // Admin routes require ADMIN role
        if (pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN'
        }

        // App routes require authentication
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/(app)')) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)',
  ]
}