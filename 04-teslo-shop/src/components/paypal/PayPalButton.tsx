"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { CreateOrderData, CreateOrderActions } from "@paypal/paypal-js";

interface Props {
  orderId: string;
  amount: number;
}

export const PayPalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="animate-pulse mb-14.5">
        <div className="h-10 bg-gray-300 rounded" />
        <div className="h-10 bg-gray-300 rounded mt-2" />
      </div>
    );
  }

  const roundedAmount = amount.toFixed(2).toString();

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ) => {
    const transactionId = await actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            value: roundedAmount,
            currency_code: "USD",
          },
        },
      ],
    });

    console.log(transactionId);

    return transactionId;
  };

  return <PayPalButtons createOrder={createOrder} />;
};
