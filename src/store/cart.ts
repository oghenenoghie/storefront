import { create } from "zustand";
import { Cart } from "@/types";
import { cartApi } from "@/lib/api";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await cartApi.active();
      set({ cart: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  addItem: async (productId, quantity = 1) => {
    await cartApi.addItem(productId, quantity);
    await get().fetchCart();
  },
  updateItem: async (itemId, quantity) => {
    await cartApi.updateItem(itemId, quantity);
    await get().fetchCart();
  },
  removeItem: async (itemId) => {
    await cartApi.removeItem(itemId);
    await get().fetchCart();
  },
}));
