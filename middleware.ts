import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Criar cliente para middleware
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  // Verificar se há uma sessão ativa
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // URLs públicas que não precisam de autenticação
  const isPublicPage = 
    request.nextUrl.pathname.startsWith('/auth') || 
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/api/public');
  
  // Redirecionar usuários não autenticados para o login
  // exceto em páginas públicas
  if (!session && !isPublicPage) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Redirecionar usuários autenticados para fora das páginas de auth
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return response;
}

// Configurar quais rotas devem ser processadas pelo middleware
export const config = {
  matcher: [
    /*
     * Corresponde a todas as solicitações, exceto para:
     * - _next (arquivos estáticos do Next.js)
     * - public (arquivos estáticos públicos)
     * - favicon.ico, imagens, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|favicon.png|favicon.svg|images|.*\\.svg).*)',
  ],
}; 