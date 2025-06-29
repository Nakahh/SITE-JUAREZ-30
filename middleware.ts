
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acesso a rotas públicas
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/imoveis',
    '/blog',
    '/contato',
    '/sobre',
    '/depoimentos',
    '/corretores',
    '/simulador-financiamento',
    '/desenvolvedor',
    '/kryonix',
    '/api/auth',
    '/_next',
    '/favicon.ico'
  ]

  // Verificar se é uma rota pública
  const isPublicPath = publicPaths.some(path => 
    pathname === path || 
    pathname.startsWith(path + '/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')
  )

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Para rotas administrativas, podemos adicionar verificação adicional no futuro
  if (pathname.startsWith('/admin')) {
    // Por enquanto, permitir acesso
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
