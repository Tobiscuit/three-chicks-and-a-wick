// src/components/CustomerAuth.tsx
'use client';

import { useCustomerAuth } from '@/hooks/useCustomerAuth';

export default function CustomerAuth() {
  const { customer, isLoading, error, isAuthenticated, login, logout } = useCustomerAuth();

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (isAuthenticated && customer) {
    return (
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Welcome back!</h3>
        <p className="mb-2">
          {customer.firstName} {customer.lastName}
        </p>
        <p className="text-sm text-gray-600 mb-4">{customer.email}</p>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Customer Login</h3>
      <p className="text-sm text-gray-600 mb-4">
        Sign in to access your account and order history.
      </p>
      <button
        onClick={login}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Login with Shopify
      </button>
    </div>
  );
}