// src/app/api/auth/[...shopify]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_CUSTOMER_CLIENT_ID = process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_CLIENT_ID;
const SHOPIFY_CUSTOMER_CLIENT_SECRET = process.env.SHOPIFY_CUSTOMER_CLIENT_SECRET;
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_CUSTOMER_CLIENT_ID || !SHOPIFY_CUSTOMER_CLIENT_SECRET || !NEXT_PUBLIC_BASE_URL) {
  throw new Error('Missing Shopify Customer API credentials or base URL. Please check your .env.local file.');
}

const SHOPIFY_STORE_URL = `https://${SHOPIFY_STORE_DOMAIN}`;
const SHOPIFY_AUTH_BASE_URL = `${SHOPIFY_STORE_URL}/auth/oauth/authorize`;
const SHOPIFY_TOKEN_URL = `${SHOPIFY_STORE_URL}/auth/oauth/token`;
const REDIRECT_URI = `${NEXT_PUBLIC_BASE_URL}/api/auth/callback`;

// Helper function to handle Shopify token exchange
async function exchangeCodeForToken(code: string) {
  const response = await fetch(SHOPIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: SHOPIFY_CUSTOMER_CLIENT_ID,
      client_secret: SHOPIFY_CUSTOMER_CLIENT_SECRET,
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

// The main handler for all /api/auth/* routes
export async function GET(request: NextRequest, { params }: { params: { shopify: string[] } }) {
  const action = params.shopify[0];
  const searchParams = request.nextUrl.searchParams;

  switch (action) {
    case 'login': {
      // Generate a unique state for security
      const state = crypto.randomUUID();
      await cookies().set('shopify_auth_state', state, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 5 }); // 5 minutes

      const scopes = 'openid email https://api.shopify.com/auth/shop.customers.read';
      
      const authUrl = new URL(SHOPIFY_AUTH_BASE_URL);
      authUrl.searchParams.set('client_id', SHOPIFY_CUSTOMER_CLIENT_ID!);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
      authUrl.searchParams.set('scope', scopes);
      authUrl.searchParams.set('state', state);

      return NextResponse.redirect(authUrl);
    }

    case 'callback': {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const storedState = (await cookies().get('shopify_auth_state'))?.value;

      // Clear the state cookie after checking it
      await cookies().delete('shopify_auth_state');

      if (!code || !state || state !== storedState) {
        return NextResponse.redirect(new URL('/?error=invalid_state', request.url));
      }
      
      try {
        const tokenData = await exchangeCodeForToken(code);
        
        // Securely store the access token in an HTTP-only cookie
        await cookies().set('shopify_customer_token', tokenData.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: tokenData.expires_in,
        });

        // Redirect to a protected account page
        return NextResponse.redirect(new URL('/account', request.url));

      } catch (error) {
        console.error(error);
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
      }
    }

    case 'logout': {
      // Clear the session cookie
      await cookies().delete('shopify_customer_token');
      // Redirect to the homepage
      return NextResponse.redirect(new URL('/', request.url));
    }

    default:
      return new NextResponse('Not Found', { status: 404 });
  }
} 