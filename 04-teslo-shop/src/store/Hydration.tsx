// hydration.tsx
"use client"; // (a)

import * as React from "react";
import { useCartStore } from "./cart/cart-store";

export const Hydration = () => {
  React.useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []); // (b)

  return null;
};
