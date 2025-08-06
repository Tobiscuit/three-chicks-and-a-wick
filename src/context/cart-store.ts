// src/context/cart-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the types for the cart items
export interface StandardItem {
  type: 'STANDARD';
  variantId: string;
  quantity: number;
}

export interface CustomCandleItem {
  type: 'CUSTOM_CANDLE';
  configuration: {
    size: string;
    jarType: string;
    wickType: string;
    scentRecipe: {
      materials: string[];
      materialCount: number;
    };
  };
}

export type CartItem = StandardItem | CustomCandleItem;

// Define the state and actions for the cart
interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void; // Using variantId for standard or a unique key for custom
  updateItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => {
            if (item.type === 'STANDARD') {
              return item.variantId !== id;
            }
            // Add logic for custom item removal if needed
            return true;
          }),
        })),
      updateItemQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.type === 'STANDARD' && item.variantId === id) {
              return { ...item, quantity };
            }
            return item;
          }),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
