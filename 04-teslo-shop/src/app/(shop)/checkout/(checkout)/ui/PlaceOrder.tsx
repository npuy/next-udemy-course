"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";

export const PlaceOrder = () => {
  const router = useRouter();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState<undefined | string>("");

  const address = useAddressStore((state) => state.address);
  const info = useCartStore((state) => state.orderSummary);
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));
    const resp = await placeOrder(productsToOrder, address);

    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message);
    }

    clearCart();
    router.push("/orders/" + resp.order?.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2">Shipping address</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city} {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="w-full h-0.5 rounded bg-gray-200 mb-10 " />

      <h2 className="text-2xl mb-2">Order resume</h2>

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
        <span className="mt-5 text-2xl text-right">
          ${info.total.toFixed(2)}
        </span>
      </div>
      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">
            By clicking {'"Checkout"'} you agree to our{" "}
            <a href="#" className="underline">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </span>
        </p>

        <p className="text-red-500">{errorMessage}</p>

        <button
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
          onClick={onPlaceOrder}
          // href={"/orders/123"}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};
