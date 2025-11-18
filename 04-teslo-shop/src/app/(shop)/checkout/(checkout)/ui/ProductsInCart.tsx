"use client";

import { useCartStore } from "@/store";
import { ProductImage } from "@/components";

export const ProductsInCart = () => {
  const productsInCart = useCartStore((state) => state.cart);

  return (
    <>
      {/* Items */}
      {productsInCart.map((product) => (
        <div key={`${product.size} - ${product.slug}`} className="flex mb-5">
          <ProductImage
            src={product.image}
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
            <span>{`${product.size} - ${product.title} (${product.quantity})`}</span>
            <p className="font-bold">
              ${(product.price * product.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
