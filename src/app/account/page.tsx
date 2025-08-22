"use client";

import { useEffect, useState } from 'react';

type Order = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: {
      node: {
        title: string;
        quantity: number;
      };
    }[];
  };
};

type OrdersData = {
  orders: {
    edges: { node: Order }[];
  };
};

export default function AccountPage() {
  const [ordersData, setOrdersData] = useState<OrdersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/customer/orders');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch orders');
        }

        const data = await response.json();
        setOrdersData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Account</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Order History</h2>
          </div>
          <div className="border-t border-gray-200">
            {loading ? (
              <p className="p-6 text-center text-gray-500">Loading order history...</p>
            ) : error ? (
              <p className="p-6 text-center text-red-500">Error: {error}</p>
            ) : !ordersData || ordersData.orders.edges.length === 0 ? (
              <p className="p-6 text-center text-gray-500">You have no orders yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {ordersData.orders.edges.map(({ node: order }) => (
                  <li key={order.id} className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-indigo-600">Order {order.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.processedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: order.totalPrice.currencyCode }).format(parseFloat(order.totalPrice.amount))}
                        </p>
                        <p className={`text-xs font-semibold px-2 py-1 rounded-full ${order.financialStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {order.financialStatus}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Items:</h4>
                      <ul className="mt-2 text-sm text-gray-500">
                        {order.lineItems.edges.map((item, index) => (
                          <li key={index}>- {item.node.title} (x{item.node.quantity})</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
