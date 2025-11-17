"use server";

import { auth } from "@/auth.config";

import { PrismaClient } from "@/generated/prisma/client";
const prisma = new PrismaClient();

export const getOrders = async () => {
  const session = await auth();

  if (session?.user.role !== "admin")
    return { ok: false, message: "User must be logged in" };

  try {
    const orders = await prisma?.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderAddress: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      ok: true,
      orders,
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      message: "Error getting orders",
    };
  }
};
