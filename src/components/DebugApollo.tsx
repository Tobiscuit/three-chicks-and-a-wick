// src/components/DebugApollo.tsx
'use client';

import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { testShopifyConnection } from '@/lib/debug-apollo';

const TEST_SHOP_QUERY = gql`
  query TestShop {
    shop {
      name
      description
    }
  }
`;

export default function DebugApollo() {
  const [testResult, setTestResult] = useState<any>(null);
  const { data, loading, error } = useQuery(TEST_SHOP_QUERY);

  const runTest = async () => {
    const result = await testShopifyConnection();
    setTestResult(result);
  };

  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Apollo Client Debug</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Direct Fetch Test:</h3>
          <button 
            onClick={runTest}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Direct Connection
          </button>
          {testResult && (
            <pre className="mt-2 p-2 bg-white rounded text-sm overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Apollo Query Test:</h3>
          {loading && <p>Loading...</p>}
          {error && (
            <div className="text-red-600">
              <p>Error: {error.message}</p>
              <pre className="mt-2 p-2 bg-red-50 rounded text-sm overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}
          {data && (
            <div className="text-green-600">
              <p>Success!</p>
              <pre className="mt-2 p-2 bg-green-50 rounded text-sm overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}