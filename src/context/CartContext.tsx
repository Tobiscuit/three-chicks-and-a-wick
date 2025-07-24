// src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { CREATE_CART_MUTATION, ADD_TO_CART_MUTATION, GET_CART_QUERY } from '@/lib/shopify';

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
  checkoutUrl: string | null;
  isCartLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isCartLoading, setIsCartLoading] = useState(true);

  const [createCart] = useMutation(CREATE_CART_MUTATION);
  const [addToCartMutation] = useMutation(ADD_TO_CART_MUTATION);
  const [getCart, { data: cartData }] = useLazyQuery(GET_CART_QUERY);

  useEffect(() => {
    const storedCartId = localStorage.getItem('shopify_cart_id');
    if (storedCartId) {
      setCartId(storedCartId);
      getCart({ variables: { cartId: storedCartId } });
    }
    setIsCartLoading(false);
  }, [getCart]);
  
  useEffect(() => {
    if (cartData && cartData.cart) {
      setCheckoutUrl(cartData.cart.checkoutUrl);
      const items = cartData.cart.lines.edges.map((edge: any) => {
        const { merchandise, quantity } = edge.node;
        return {
          product: {
            id: merchandise.product.id,
            variantId: merchandise.id,
            title: merchandise.product.title,
            price: {
              amount: merchandise.price.amount,
              currencyCode: merchandise.price.currencyCode,
            },
            image: {
              url: merchandise.image.url,
              altText: merchandise.image.altText || merchandise.product.title,
            },
          },
          quantity,
        };
      });
      setCartItems(items);
    }
  }, [cartData]);


  const addToCart = async (product: CartProduct, quantity: number = 1) => {
    setIsCartLoading(true);
    let currentCartId = cartId;
    let newCart = false;

    if (!currentCartId) {
      try {
        const { data } = await createCart({
          variables: {
            input: {
              lines: [
                {
                  merchandiseId: product.variantId,
                  quantity: quantity,
                },
              ],
            },
          },
        });
        if (data.cartCreate.cart) {
          currentCartId = data.cartCreate.cart.id;
          setCartId(currentCartId);
          setCheckoutUrl(data.cartCreate.cart.checkoutUrl);
          localStorage.setItem('shopify_cart_id', currentCartId);
          newCart = true;
        } else {
          // Handle user errors
          console.error("Error creating cart:", data.cartCreate.userErrors);
          setIsCartLoading(false);
          return;
        }
      } catch (error) {
        console.error("Failed to create cart:", error);
        setIsCartLoading(false);
        return;
      }
    }

    if (!newCart && currentCartId) {
      try {
        await addToCartMutation({
          variables: {
            cartId: currentCartId,
            lines: [
              {
                merchandiseId: product.variantId,
                quantity: quantity,
              },
            ],
          },
        });
      } catch (error) {
        console.error("Failed to add to cart:", error);
        setIsCartLoading(false);
        return;
      }
    }

    // This part still uses local state for immediate UI feedback.
    // A more robust solution would refetch the cart state from Shopify.
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
    
    setIsCartLoading(false);
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
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, checkoutUrl, isCartLoading }}>
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