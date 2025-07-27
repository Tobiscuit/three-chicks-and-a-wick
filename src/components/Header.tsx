import { cookies } from 'next/headers';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const cookieStore = cookies();
  const isLoggedIn = cookieStore.has('shopify_customer_token');

  return <HeaderClient isLoggedIn={isLoggedIn} />;
} 