'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  GET_CART_QUERY,
  REMOVE_FROM_CART_MUTATION,
  UPDATE_CART_LINE_MUTATION
} from '@/lib/shopify';
import { debounce } from 'lodash';

type ShopifyCart = {
  cart: {
    id: string;
    checkoutUrl: string;
    lines: {
      edges: {
        node: {
          id: string;
          quantity: number;
          merchandise: {
            id: string;
            title: string;
            price: {
              amount: string;
              currencyCode: string;
            };
            image: {
              url: string;
              altText: string;
            };
            product: {
              id: string;
              title: string;
              handle: string;
            };
          };
        };
      }[];
    };
  };
};

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
  updateQuantity: (lineId: string, quantity: number) => void;
  checkoutUrl: string | null;
  isCartLoading: boolean;
  proceedToCheckout: () => Promise<void>;
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

  const [getCart, { data: cartData, refetch: refetchCart }] = useLazyQuery<ShopifyCart>(GET_CART_QUERY, {
    fetchPolicy: 'network-only',
  });

  const debouncedUpdate = useCallback(
    debounce(async (cartId: string, lineId: string, quantity: number) => {
      try {
        setIsCartLoading(true);
        await updateCartLineMutation({
          variables: {
            cartId,
            lines: [{ id: lineId, quantity: quantity }],
          },
        });
        if (refetchCart) {
          return refetchCart({ cartId });
        }
      } catch (error) {
        console.error("Failed to update quantity:", error);
        // Optionally, trigger a refetch or show an error to the user
        if (refetchCart) {
          await refetchCart({ cartId });
        }
      } finally {
        setIsCartLoading(false);
      }
    }, 500),
    [updateCartLineMutation, refetchCart]
  );
  
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
      const items = cartData.cart.lines.edges.map((edge) => {
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
          if (currentCartId) {
            localStorage.setItem('shopify_cart_id', currentCartId);
          }
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

  const updateQuantity = (lineId: string, quantity: number) => {
    if (!cartId || quantity < 1) return;

    // Create a new array with the updated quantity for the specific item.
    const newCartItems = cartItems.map((item) => {
      if (item.lineId === lineId) {
        return { ...item, quantity };
      }
      return item;
    });

    // Set the new cart items for an optimistic UI update.
    setCartItems(newCartItems);

    // Call the debounced function to update the cart on the server.
    debouncedUpdate(cartId, lineId, quantity);
  };

  const proceedToCheckout = async () => {
    setIsCartLoading(true);
    try {
      if (debouncedUpdate && 'flush' in debouncedUpdate) {
        await (debouncedUpdate.flush as () => Promise<void>)();
      }

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else if (cartId) {
        const { data: freshCartData } = await getCart({ variables: { cartId } });
        if (freshCartData && freshCartData.cart.checkoutUrl) {
          window.location.href = freshCartData.cart.checkoutUrl;
        } else {
          console.error("Could not retrieve checkout URL.");
        }
      } else {
        console.error("Checkout URL is not available and there is no cart.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setIsCartLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, checkoutUrl, isCartLoading, proceedToCheckout }}>
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