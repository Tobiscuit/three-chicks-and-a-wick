import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// --- Environment Variables ---
const SHOPIFY_HEADLESS_APP_ID = process.env.NEXT_PUBLIC_SHOPIFY_HEADLESS_APP_ID;
const SHOPIFY_CUSTOMER_CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID;
const SHOPIFY_CUSTOMER_CLIENT_SECRET = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_SECRET;
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// --- Shopify API Endpoints ---
const SHOPIFY_AUTH_BASE_URL = `https://shopify.com/authentication/${SHOPIFY_HEADLESS_APP_ID}/oauth/authorize`;
const SHOPIFY_TOKEN_URL = `https://shopify.com/authentication/${SHOPIFY_HEADLESS_APP_ID}/oauth/token`;
const REDIRECT_URI = `${NEXT_PUBLIC_BASE_URL}/api/auth/callback`;

// --- Type Definitions ---
type TokenData = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
};

type JwtPayload = {
  nonce?: string;
  [key: string]: unknown;
};

// --- Utility Functions ---

function decodeJwt(token: string): { payload: JwtPayload } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    const payload = JSON.parse(atob(parts[1]));
    return { payload };
  } catch (error) {
    console.error("Failed to decode JWT", error);
    throw new Error('Failed to decode JWT payload.');
  }
}

async function exchangeCodeForToken(code: string): Promise<TokenData> {
    const clientSecret = SHOPIFY_CUSTOMER_CLIENT_SECRET;
    const clientId = SHOPIFY_CUSTOMER_CLIENT_ID;

    if (!clientId || !clientSecret) {
        throw new Error('Missing Shopify client credentials for token exchange.');
    }

    const basicAuth = btoa(`${clientId}:${clientSecret}`);
    const response = await fetch(SHOPIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
        },
        body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: REDIRECT_URI,
        code,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Shopify token exchange failed: ${JSON.stringify(errorData)}`);
    }

    return response.json();
}

async function refreshToken(token: string): Promise<TokenData> {
    const clientSecret = SHOPIFY_CUSTOMER_CLIENT_SECRET;
    const clientId = SHOPIFY_CUSTOMER_CLIENT_ID;

    if (!clientId || !clientSecret) {
        throw new Error('Missing Shopify client credentials for refresh token.');
    }

    const basicAuth = btoa(`${clientId}:${clientSecret}`);
    const response = await fetch(SHOPIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
        },
        body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        refresh_token: token,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Shopify token refresh failed: ${JSON.stringify(errorData)}`);
    }

    return response.json();
}


// Corrected the function signature below
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shopify: string[] }> }
) {
  if (!SHOPIFY_HEADLESS_APP_ID || !SHOPIFY_CUSTOMER_CLIENT_ID || !NEXT_PUBLIC_BASE_URL) {
    return new NextResponse('Server configuration error.', { status: 500 });
  }

  const shopifyParams = await params;
  const action = shopifyParams.shopify[0];
  const searchParams = request.nextUrl.searchParams;

  switch (action) {
    case 'login': {
      const state = crypto.randomUUID();
      const nonce = crypto.randomUUID();
      const scopes = 'openid email customer-account-api:full';

      const authUrl = new URL(SHOPIFY_AUTH_BASE_URL);
      authUrl.searchParams.set('client_id', SHOPIFY_CUSTOMER_CLIENT_ID!);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
      authUrl.searchParams.set('scope', scopes);
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('nonce', nonce);

      const response = NextResponse.redirect(authUrl);
      const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 5, // 5 minutes
      };
      response.cookies.set('shopify_auth_state', state, cookieOptions);
      response.cookies.set('shopify_auth_nonce', nonce, cookieOptions);
      return response;
    }

    case 'callback': {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const cookieStore = cookies();
      const storedState = cookieStore.get('shopify_auth_state')?.value;
      const storedNonce = cookieStore.get('shopify_auth_nonce')?.value;

      cookieStore.delete('shopify_auth_state');
      cookieStore.delete('shopify_auth_nonce');

      if (!code || !state || state !== storedState) {
        return NextResponse.redirect(`${NEXT_PUBLIC_BASE_URL}/?error=invalid_state`);
      }

      try {
        const tokenData = await exchangeCodeForToken(code);
        const { payload: idTokenPayload } = decodeJwt(tokenData.id_token);

        if (idTokenPayload.nonce !== storedNonce) {
          console.error('Nonce validation failed');
          return NextResponse.redirect(`${NEXT_PUBLIC_BASE_URL}/?error=invalid_nonce`);
        }

        const response = NextResponse.redirect(`${NEXT_PUBLIC_BASE_URL}/account`);
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            maxAge: tokenData.expires_in,
        };

        response.cookies.set('shopify_access_token', tokenData.access_token, cookieOptions);
        response.cookies.set('shopify_id_token', tokenData.id_token, cookieOptions);

        if (tokenData.refresh_token) {
            response.cookies.set('shopify_refresh_token', tokenData.refresh_token, {
                ...cookieOptions,
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });
        }

        return response;

      } catch (error) {
        console.error(error);
        return NextResponse.redirect(`${NEXT_PUBLIC_BASE_URL}/?error=auth_failed`);
      }
    }

    case 'logout': {
      const cookieStore = cookies();
      const idToken = cookieStore.get('shopify_id_token')?.value;

      cookieStore.delete('shopify_access_token');
      cookieStore.delete('shopify_id_token');
      cookieStore.delete('shopify_refresh_token');

      if (!idToken) {
        return NextResponse.redirect(NEXT_PUBLIC_BASE_URL!);
      }

      const logoutUrl = new URL(`https://shopify.com/authentication/${SHOPIFY_HEADLESS_APP_ID}/logout`);
      logoutUrl.searchParams.set('id_token_hint', idToken);
      logoutUrl.searchParams.set('post_logout_redirect_uri', NEXT_PUBLIC_BASE_URL!);

      return NextResponse.redirect(logoutUrl);
    }

    case 'refresh': {
      const cookieStore = cookies();
      const refreshTokenValue = cookieStore.get('shopify_refresh_token')?.value;

      if (!refreshTokenValue) {
        return new NextResponse('No refresh token found.', { status: 401 });
      }

      try {
        const tokenData = await refreshToken(refreshTokenValue);

        const response = new NextResponse('Token refreshed.', { status: 200 });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            maxAge: tokenData.expires_in,
        };

        response.cookies.set('shopify_access_token', tokenData.access_token, cookieOptions);
        if (tokenData.refresh_token) {
           response.cookies.set('shopify_refresh_token', tokenData.refresh_token, {
            ...cookieOptions,
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
        }

        return response;
      } catch (error) {
        console.error(error);
        return new NextResponse('Failed to refresh token.', { status: 500 });
      }
    }

    default:
      return new NextResponse('Not Found', { status: 404 });
  }
} 