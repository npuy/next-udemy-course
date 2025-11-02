import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrderSummaryInformation {
  numberOfItems: number;
  subTotal: number;
  tax: number;
  taxRate: number;
  total: number;
}

interface State {
  cart: CartProduct[];
  orderSummary: OrderSummaryInformation;

  getTotalItems: () => number;
  addProductToCart: (product: CartProduct) => void;
  removeProductFromCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
}

function calculateOrderSummary(cart: CartProduct[]): OrderSummaryInformation {
  const numberOfItems = cart.reduce(
    (total, product) => total + product.quantity,
    0
  );
  const subTotal = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  const taxRate = 0.15;
  const tax = subTotal * taxRate;
  const total = subTotal + tax;

  return {
    numberOfItems,
    subTotal,
    taxRate,
    tax,
    total,
  };
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      orderSummary: {
        numberOfItems: 0,
        subTotal: 0,
        tax: 0,
        taxRate: 0,
        total: 0,
      },

      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, product) => total + product.quantity, 0);
      },
      addProductToCart: (product) =>
        set((state) => {
          const productInCart = state.cart.find(
            (p) => p.id === product.id && p.size === product.size
          );

          if (productInCart) {
            // If the product is already in the cart, update its quantity
            const updatedCart = state.cart.map((p) =>
              p.id === product.id && p.size === product.size
                ? { ...p, quantity: p.quantity + product.quantity }
                : p
            );

            const orderSummary = calculateOrderSummary(updatedCart);

            return {
              cart: updatedCart,
              orderSummary,
            };
          }

          // If the product is not in the cart, add it
          const updatedCart = [...state.cart, product];
          const orderSummary = calculateOrderSummary(updatedCart);
          return {
            cart: updatedCart,
            orderSummary,
          };
        }),
      removeProductFromCart: (product) =>
        set((state) => {
          const updatedCart = state.cart.filter(
            (p) => !(p.id === product.id && p.size === product.size)
          );

          const orderSummary = calculateOrderSummary(updatedCart);
          return {
            cart: updatedCart,
            orderSummary,
          };
        }),
      updateProductQuantity: (product, quantity) =>
        set((state) => {
          const updatedCart = state.cart.map((p) =>
            p.id === product.id && p.size === product.size
              ? { ...p, quantity }
              : p
          );

          const orderSummary = calculateOrderSummary(updatedCart);
          return {
            cart: updatedCart,
            orderSummary,
          };
        }),
    }),
    {
      name: "cart-storage",
      skipHydration: true,
    }
  )
);
