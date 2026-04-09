import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

function generateCartItemId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (
    product: Product,
    quantity?: number,
    variationId?: number,
    selectedAttributes?: Record<string, string>,
    personalization?: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),

      addItem: (product, quantity = 1, variationId, selectedAttributes, personalization) => {
        // Match by product.id + variationId so different variants are separate cart entries
        const existing = get().items.find(
          (i) => i.product.id === product.id && i.variationId === variationId
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.cartItemId === existing.cartItemId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
            isOpen: true,
          }));
        } else {
          set((state) => ({
            items: [
              ...state.items,
              {
                cartItemId: generateCartItemId(),
                product,
                quantity,
                variationId,
                selectedAttributes,
                personalization,
              },
            ],
            isOpen: true,
          }));
        }
      },

      // Use cartItemId (not productId) so we can target a specific variant
      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        })),

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce(
          (sum, i) =>
            sum +
            (parseFloat(i.product.price) || parseFloat(i.product.regular_price) || 0) *
              i.quantity,
          0
        ),
    }),
    { name: "cart-storage" }
  )
);
