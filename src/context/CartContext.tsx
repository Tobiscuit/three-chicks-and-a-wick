'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  GET_CART_QUERY,
  REMOVE_FROM_CART_MUTATION,
  UPDATE_CART_LINE_MUTATION
} from '@/lib/shopify';

export type CartProduct = {
  id: string;
  variantId: string;
  handle: string;
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
  lineId: string;
  product: CartProduct;
  quantity: number;
};


type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: CartProduct, quantity?: number) => void;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
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
  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART_MUTATION);
  const [updateCartLineMutation] = useMutation(UPDATE_CART_LINE_MUTATION);

  const [getCart, { data: cartData, refetch: refetchCart }] = useLazyQuery(GET_CART_QUERY, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const storedCartId = localStorage.getItem('shopify_cart_id');
    if (storedCartId) {
      setCartId(storedCartId);
      getCart({ variables: { cartId: storedCartId } });
    } else {
      setIsCartLoading(false);
    }
  }, [getCart]);

  useEffect(() => {
    if (cartData && cartData.cart) {
      setCheckoutUrl(cartData.cart.checkoutUrl);
      const items = cartData.cart.lines.edges.map((edge: { node: any }) => {
        const { node } = edge;
        return {
          lineId: node.id,
          product: {
            id: node.merchandise.product.id,
            variantId: node.merchandise.id,
            handle: node.merchandise.product.handle,
            title: node.merchandise.product.title,
            price: {
              amount: node.merchandise.price.amount,
              currencyCode: node.merchandise.price.currencyCode,
            },
            image: {
              url: node.merchandise.image.url,
              altText: node.merchandise.image.altText || node.merchandise.product.title,
            },
          },
          quantity: node.quantity,
        };
      });
      setCartItems(items);
      setIsCartLoading(false);
    } else if (cartData === null) {
        setIsCartLoading(false);
    }
  }, [cartData]);


  const addToCart = async (product: CartProduct, quantity: number = 1) => {
    setIsCartLoading(true);
    let currentCartId = cartId;

    if (!currentCartId) {
      try {
        const { data } = await createCart({
          variables: {
            input: {
              lines: [{ merchandiseId: product.variantId, quantity: quantity }],
            },
          },
        });
        if (data.cartCreate.cart) {
          currentCartId = data.cartCreate.cart.id;
          setCartId(currentCartId);
          setCheckoutUrl(data.cartCreate.cart.checkoutUrl);
          localStorage.setItem('shopify_cart_id', currentCartId);
          if (refetchCart && currentCartId) {
            await refetchCart({ cartId: currentCartId });
          }
        } else {
          console.error("Error creating cart:", data.cartCreate.userErrors);
        }
      } catch (error) {
        console.error("Failed to create cart:", error);
      }
    } else {
      try {
        await addToCartMutation({
          variables: {
            cartId: currentCartId,
            lines: [{ merchandiseId: product.variantId, quantity: quantity }],
          },
        });
        if (refetchCart && currentCartId) {
          await refetchCart({ cartId: currentCartId });
        }
      } catch (error) {
        console.error("Failed to add to cart:", error);
      }
    }
    setIsCartLoading(false);
  };

  const removeFromCart = async (lineId: string) => {
    if (!cartId) return;
    setIsCartLoading(true);
    try {
      await removeFromCartMutation({
        variables: { cartId, lineIds: [lineId] }
      });
      if (refetchCart) await refetchCart({ cartId });
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
    setIsCartLoading(false);
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cartId || quantity < 1) return;
    setIsCartLoading(true);
    try {
      await updateCartLineMutation({
        variables: {
          cartId,
          lines: [{ id: lineId, quantity: quantity }],
        }
      });
      if (refetchCart) await refetchCart({ cartId });
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
    setIsCartLoading(false);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, checkoutUrl, isCartLoading }}>
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