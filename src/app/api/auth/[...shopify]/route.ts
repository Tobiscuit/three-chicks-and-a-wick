import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic'; // Prevent static analysis at build time

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_CUSTOMER_CLIENT_ID = process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_CLIENT_ID;
// The secret will be accessed only at runtime inside the exchangeCodeForToken function
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const SHOPIFY_STORE_URL = `https://${SHOPIFY_STORE_DOMAIN}`;
const SHOPIFY_AUTH_BASE_URL = `${SHOPIFY_STORE_URL}/auth/oauth/authorize`;
const SHOPIFY_TOKEN_URL = `${SHOPIFY_STORE_URL}/auth/oauth/token`;
const REDIRECT_URI = `${NEXT_PUBLIC_BASE_URL}/api/auth/callback`;

async function exchangeCodeForToken(code: string) {
  const clientSecret = process.env.SHOPIFY_CUSTOMER_CLIENT_SECRET;
  
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_CUSTOMER_CLIENT_ID || !clientSecret || !NEXT_PUBLIC_BASE_URL) {
    throw new Error('Missing Shopify Customer API credentials or base URL on the server.');
  }

  const response = await fetch(SHOPIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: SHOPIFY_CUSTOMER_CLIENT_ID,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      code,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Shopify token exchange failed:', errorData);
    throw new Error('Failed to exchange authorization code for token.');
  }

  return response.json();
}

// Corrected the function signature below
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shopify: string[] }> }
) {
  // Runtime check for variables that should be public
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_CUSTOMER_CLIENT_ID || !NEXT_PUBLIC_BASE_URL) {
    console.error('Missing public Shopify credentials or base URL');
    return new NextResponse('Server configuration error.', { status: 500 });
  }

  const shopifyParams = await params;
  const action = shopifyParams.shopify[0];
  const searchParams = request.nextUrl.searchParams;

  switch (action) {
    case 'login': {
      const state = crypto.randomUUID();
      const scopes = 'openid email https://api.shopify.com/auth/shop.customers.read';
      
      const authUrl = new URL(SHOPIFY_AUTH_BASE_URL);
      authUrl.searchParams.set('client_id', SHOPIFY_CUSTOMER_CLIENT_ID!);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
      authUrl.searchParams.set('scope', scopes);
      authUrl.searchParams.set('state', state);

      const response = NextResponse.redirect(authUrl);
      response.cookies.set('shopify_auth_state', state, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 5 });
      return response;
    }

    case 'callback': {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const cookieStore = await cookies();
      const storedState = cookieStore.get('shopify_auth_state')?.value;

      if (!code || !state || state !== storedState) {
        const response = NextResponse.redirect(new URL('/?error=invalid_state', request.url));
        response.cookies.delete('shopify_auth_state');
        return response;
      }
      
      try {
        const tokenData = await exchangeCodeForToken(code);
        
        const response = NextResponse.redirect(new URL('/account', request.url));
        response.cookies.delete('shopify_auth_state');
        response.cookies.set('shopify_customer_token', tokenData.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: tokenData.expires_in,
        });

        return response;

      } catch (error) {
        console.error(error);
        const response = NextResponse.redirect(new URL('/?error=auth_failed', request.url));
        response.cookies.delete('shopify_auth_state');
        return response;
      }
    }

    case 'logout': {
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete('shopify_customer_token');
      return response;
    }

    default:
      return new NextResponse('Not Found', { status: 404 });
  }
} 