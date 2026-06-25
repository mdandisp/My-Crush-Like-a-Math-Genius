import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Ambil token dari cookies (yang nantinya akan diset setelah login dari backend)
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  // Halaman yang butuh login (dilindungi)
  const protectedRoutes = ['/dashboard', '/admin', '/leaderboard', '/topic', '/quiz'];

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Jika user mencoba masuk ke halaman dilindungi TAPI tidak punya token
  if (isProtectedRoute && !token) {
    // Redirect ke halaman login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika user mencoba masuk ke halaman admin TAPI bukan admin
  if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Jika user SUDAH login tapi mencoba ke halaman login/register
  const isAuthRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Konfigurasi path mana saja yang akan dicek oleh middleware ini
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/leaderboard/:path*',
    '/topic/:path*',
    '/quiz/:path*',
    '/login',
    '/register'
  ],
};
