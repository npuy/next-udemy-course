"use server";

import { PrismaClient } from "@/generated/prisma/client";
const prisma = new PrismaClient();

export const setTransactionId = async (
  transactionId: string,
  orderId: string
) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId: transactionId,
      },
    });

    return {
      ok: true,
      message: "TransactionId set",
      updatedOrder,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error setting transactionId",
    };
  }
};
