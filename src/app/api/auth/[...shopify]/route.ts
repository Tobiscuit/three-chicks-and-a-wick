import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic'; // Prevent static analysis at build time

// Support both our current env names and alternative names as fallbacks
const SHOPIFY_HEADLESS_APP_ID = process.env.NEXT_PUBLIC_SHOPIFY_HEADLESS_APP_ID;
const SHOPIFY_CUSTOMER_CLIENT_ID =
  process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_CLIENT_ID ||
  process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID;
// The secret will be accessed only at runtime inside the exchangeCodeForToken function
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Use Headless Customer Accounts endpoints
const SHOPIFY_AUTH_BASE_URL = `https://shopify.com/authentication/${SHOPIFY_HEADLESS_APP_ID}/oauth/authorize`;
const SHOPIFY_TOKEN_URL = `https://shopify.com/authentication/${SHOPIFY_HEADLESS_APP_ID}/oauth/token`;
const REDIRECT_URI = `${NEXT_PUBLIC_BASE_URL}/api/auth/callback`;

async function exchangeCodeForToken(code: string) {
  const clientSecret =
    process.env.SHOPIFY_CUSTOMER_CLIENT_SECRET ||
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_SECRET;
  const clientId =
    process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_CLIENT_ID ||
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID;
  
  if (!SHOPIFY_HEADLESS_APP_ID || !SHOPIFY_CUSTOMER_CLIENT_ID || !clientSecret || !NEXT_PUBLIC_BASE_URL) {
    try {
      const clientIdSource = process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_CLIENT_ID
        ? 'NEXT_PUBLIC_SHOPIFY_CUSTOMER_CLIENT_ID'
        : (process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID ? 'SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID' : '(none)');
      const clientSecretSource = process.env.SHOPIFY_CUSTOMER_CLIENT_SECRET
        ? 'SHOPIFY_CUSTOMER_CLIENT_SECRET'
        : (process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_SECRET ? 'SHOPIFY_CUSTOMER_ACCOUNT_API_SECRET' : '(none)');
      console.error('[auth] Missing required env(s) for token exchange', {
        HAS_SHOPIFY_HEADLESS_APP_ID: Boolean(SHOPIFY_HEADLESS_APP_ID),
        HAS_SHOPIFY_CUSTOMER_CLIENT_ID: Boolean(SHOPIFY_CUSTOMER_CLIENT_ID),
        HAS_CLIENT_SECRET: Boolean(clientSecret),
        HAS_BASE_URL: Boolean(NEXT_PUBLIC_BASE_URL),
        clientIdSource,
        clientSecretSource,
      });
    } catch {}
    throw new Error('Missing Shopify Headless Customer API credentials or base URL on the server.');
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(SHOPIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
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
  if (!SHOPIFY_HEADLESS_APP_ID || !SHOPIFY_CUSTOMER_CLIENT_ID || !NEXT_PUBLIC_BASE_URL) {
    // TEMP DIAGNOSTIC: log which vars are missing (remove after configuration is verified)
    try {
      console.error('Missing Shopify Headless credentials or base URL', {
        NEXT_PUBLIC_SHOPIFY_HEADLESS_APP_ID: SHOPIFY_HEADLESS_APP_ID || '(undefined)',
        NEXT_PUBLIC_SHOPIFY_CUSTOMER_CLIENT_ID: process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_CLIENT_ID || '(undefined)',
        ALT_CUSTOMER_ACCOUNT_CLIENT_ID: process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID || '(undefined)',
        NEXT_PUBLIC_BASE_URL: NEXT_PUBLIC_BASE_URL || '(undefined)',
      });
    } catch {}
    return new NextResponse('Server configuration error.', { status: 500 });
  }

  const shopifyParams = await params;
  const action = shopifyParams.shopify[0];
  const searchParams = request.nextUrl.searchParams;

  switch (action) {
    case 'login': {
      const state = crypto.randomUUID();
      const scopes = 'openid email customer-account-api:full';
      
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
        const response = NextResponse.redirect(`${NEXT_PUBLIC_BASE_URL}/?error=invalid_state`);
        response.cookies.delete('shopify_auth_state');
        return response;
      }
      
      try {
        const tokenData = await exchangeCodeForToken(code);

        const response = NextResponse.redirect(`${NEXT_PUBLIC_BASE_URL}/account`);
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
        const response = NextResponse.redirect(`${NEXT_PUBLIC_BASE_URL}/?error=auth_failed`);
        response.cookies.delete('shopify_auth_state');
        return response;
      }
    }

    case 'logout': {
      const response = NextResponse.redirect(`${NEXT_PUBLIC_BASE_URL}/`);
      response.cookies.delete('shopify_customer_token');
      return response;
    }

    default:
      return new NextResponse('Not Found', { status: 404 });
  }
} 