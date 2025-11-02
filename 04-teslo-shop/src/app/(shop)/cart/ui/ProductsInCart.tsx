"use client";

import Image from "next/image";

import { QuantitySelector } from "@/components";
import { useCartStore } from "@/store";
import Link from "next/link";

export const ProductsInCart = () => {
  const productsInCart = useCartStore((state) => state.cart);
  const updateProductQuantity = useCartStore(
    (state) => state.updateProductQuantity
  );
  const removeProductFromCart = useCartStore(
    (state) => state.removeProductFromCart
  );

  return (
    <>
      {/* Items */}
      {productsInCart.map((product) => (
        <div key={`${product.size} - ${product.slug}`} className="flex mb-5">
          <Image
            src={`/products/${product.image}`}
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={`${product.size} - ${product.title}`}
            className="rounded mr-5"
          />

          <div>
            <Link
              className="hover:underline cursor-pointer"
              href={`/product/${product.slug}`}
            >
              <p>{`${product.size} - ${product.title}`}</p>
            </Link>
            <p>${product.price.toFixed(2)}</p>
            <QuantitySelector
              quantity={product.quantity}
              onQuantitySelect={(quantity) => {
                updateProductQuantity(product, quantity);
              }}
            />

            <button
              className="underline mt-3"
              onClick={() => removeProductFromCart(product)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
