// src/hooks/useCustomerAuth.ts
import { useState, useEffect } from 'react';
import { fetchCustomerProfile, initiateShopifyLogin, logoutCustomer } from '@/lib/shopify-client';

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

export function useCustomerAuth() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const profile = await fetchCustomerProfile();
      const { emailAddress, phoneNumber, ...rest } = profile.customer;
      setCustomer({
        ...rest,
        email: emailAddress.emailAddress,
        phone: phoneNumber?.phoneNumber,
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'Not authenticated') {
        setCustomer(null);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    initiateShopifyLogin();
  };

  const logout = async () => {
    try {
      await logoutCustomer();
      setCustomer(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    customer,
    isLoading,
    error,
    isAuthenticated: !!customer,
    login,
    logout,
    refetch: checkAuthStatus,
  };
}