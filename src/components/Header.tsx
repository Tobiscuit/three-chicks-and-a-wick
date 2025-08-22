import { cookies } from 'next/headers';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('shopify_access_token');

  return <HeaderClient isLoggedIn={isLoggedIn} />;
} 