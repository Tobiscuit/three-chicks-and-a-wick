// src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// This is a simplified version of the Product type from the product-listings page.
// We only need a few fields for the cart.
export type CartProduct = {
  id: string; // This is the product's top-level ID
  variantId: string; // This is the specific variant ID required for checkout
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  image: {
    url: string;
    altText: string;
  };
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: string) => void;
  // We'll add updateQuantity later
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: CartProduct) => {
    setCartItems(prevItems => {
      // Use variantId to check for existing items, as it's more specific
      const existingItem = prevItems.find(item => item.product.variantId === product.variantId);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.variantId === product.variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    // This might need to be changed to use variantId if products can be in the cart with different variants
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 