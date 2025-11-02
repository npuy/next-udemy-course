"use client";

import { useCartStore } from "@/store";

export const OrderSummary = () => {
  const info = useCartStore((state) => state.orderSummary);

  return (
    <div className="grid grid-cols-2">
      <span>Products</span>
      <span className="text-right">
        {info.numberOfItems === 0
          ? "1 article"
          : `${info.numberOfItems} articles`}
      </span>

      <span>Subtotal</span>
      <span className="text-right">${info.subTotal.toFixed(2)}</span>

      <span>Taxes ({info.taxRate * 100}%)</span>
      <span className="text-right">${info.tax.toFixed(2)}</span>

      <span className="mt-5 text-2xl">Total:</span>
      <span className="mt-5 text-2xl text-right">${info.total.toFixed(2)}</span>
    </div>
  );
};
