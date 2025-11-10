import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    try {
        const path = request.nextUrl.pathname;
        const method = request.method;

        // Handle OPTIONS requests early
        if (method === 'OPTIONS' && path.startsWith('/api/')) {
            return new NextResponse(null, {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            });
        }

        const response = NextResponse.next();

        // Security headers
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        // CORS headers for API routes
        if (path.startsWith('/api/')) {
            response.headers.set('Access-Control-Allow-Origin', '*');
            response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        }

        // Cache headers for static assets
        if (/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/.test(path)) {
            response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        }

        return response;
    } catch (err) {
        console.error('Middleware crashed:', err);
        const fallbackUrl = request.nextUrl.clone();
        fallbackUrl.pathname = '/error';
        return NextResponse.redirect(fallbackUrl);
    }
}

export const config = {
    matcher: ['/api/:path*'],
};
