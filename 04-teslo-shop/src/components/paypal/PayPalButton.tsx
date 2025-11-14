"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js";
import { payPalCheckPayment, setTransactionId } from "@/actions";

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
          invoice_id: orderId,
          amount: {
            value: roundedAmount,
            currency_code: "USD",
          },
        },
      ],
    });

    const { ok } = await setTransactionId(transactionId, orderId);

    if (!ok) throw new Error("Error setting transactionId");

    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();
    if (!details || !details.id) return;

    await payPalCheckPayment(details.id);
  };

  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
};
