"use client";

import { useState } from "react";

import { QuantitySelector, SizeSelector } from "@/components";
import { Product, Size } from "@/interfaces";
import { useCartStore } from "@/store";

interface AddToCartProps {
  product: Product;
}

export const AddToCart = ({ product }: AddToCartProps) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart);

  const [size, setSize] = useState<Size | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [posted, setPosted] = useState(false);

  const addToCart = () => {
    setPosted(true);

    if (!size) return;

    addProductToCart({
      id: product.id,
      slug: product.slug,
      title: product.title,
      size,
      quantity,
      price: product.price,
      image: product.images[0],
    });
    setPosted(false);
    setSize(undefined);
    setQuantity(1);
  };

  return (
    <>
      {posted && !size && (
        <span className="mt-2 text-red-500">Must select Size*</span>
      )}

      {/* Size selector */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeSelect={setSize}
      />

      {/* Quantity selector */}

      <QuantitySelector quantity={quantity} onQuantitySelect={setQuantity} />

      {/* Button */}
      <button onClick={addToCart} className="btn-primary my-5">
        Add to cart
      </button>
    </>
  );
};
