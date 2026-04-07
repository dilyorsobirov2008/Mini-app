import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  const response = NextResponse.next();
  
  // Custom header to pass pathname to server components
  response.headers.set('x-pathname', pathname);

  // Admin protection
  if (pathname.startsWith('/admin') && !pathname.includes('/admin/login')) {
    const token = request.cookies.get('admin_token');
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
