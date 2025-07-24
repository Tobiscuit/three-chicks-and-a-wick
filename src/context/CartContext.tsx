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
  addToCart: (product: CartProduct, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  increaseQuantity: (variantId: string) => void;
  decreaseQuantity: (variantId: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: CartProduct, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.variantId === product.variantId);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.variantId === product.variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
  };

  const removeFromCart = (variantId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.variantId !== variantId));
  };

  const increaseQuantity = (variantId: string) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.variantId === variantId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (variantId: string) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.variantId === variantId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
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