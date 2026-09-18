import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function withCors(req: NextRequest, res: NextResponse) {
  const origin = req.headers.get('origin') || '*';
  res.headers.set('Access-Control-Allow-Origin', origin);
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  return res;
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (request.method === 'OPTIONS') {
      return withCors(request, new NextResponse(null, { status: 204 }));
    }
    return withCors(request, NextResponse.next());
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
