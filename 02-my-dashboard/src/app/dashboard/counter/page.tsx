import { CartCounter } from "@/shopping-cart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Just a counter",
};

export default function CounterPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <span>Shopping cart</span>
      <CartCounter value={10} />
    </div>
  );
}
