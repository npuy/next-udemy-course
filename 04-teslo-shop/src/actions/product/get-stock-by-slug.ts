"use server";

import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export const getStockBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug,
      },
      select: {
        inStock: true,
      },
    });

    return product?.inStock || 0;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching stock data");
  }
};
