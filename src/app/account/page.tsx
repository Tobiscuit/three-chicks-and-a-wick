'use client';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

export default function AccountPage() {
  const { customer, isLoading, error, isAuthenticated, logout } = useCustomerAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a 
            href="/api/auth/login" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Login Again
          </a>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Logged In</h1>
          <p className="text-gray-600 mb-4">Please log in to access your account.</p>
          <a 
            href="/api/auth/login" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login with Shopify
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600">Welcome back!</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          <div className="grid gap-6">
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
                <p><strong>Email:</strong> {customer.email}</p>
                {customer.phone && <p><strong>Phone:</strong> {customer.phone}</p>}
                <p><strong>Customer ID:</strong> {customer.id}</p>
              </div>
            </div>

            {/* Debug Information */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(customer, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
