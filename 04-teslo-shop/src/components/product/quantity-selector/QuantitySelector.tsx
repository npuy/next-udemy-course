"use client";

import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface QuantitySelectorProps {
  quantity: number;

  onQuantitySelect: (quantity: number) => void;
}

export const QuantitySelector = ({
  quantity,
  onQuantitySelect,
}: QuantitySelectorProps) => {
  const handleQuantityChange = (value: number) => {
    const newQuantity = quantity + value;
    if (newQuantity < 1) return;
    onQuantitySelect(newQuantity);
  };

  return (
    <div className="flex">
      <button onClick={() => handleQuantityChange(-1)}>
        <IoRemoveCircleOutline size={30} />
      </button>

      <span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded">
        {quantity}
      </span>

      <button onClick={() => handleQuantityChange(1)}>
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
};
