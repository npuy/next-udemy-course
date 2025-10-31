"use server";

import { PrismaClient } from "@/generated/prisma/client";
import { Product } from "@/interfaces";

const prisma = new PrismaClient();

export const getProductBySlug = async (
  slug: string
): Promise<Product | null> => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug,
      },
      include: {
        ProductImage: {
          select: {
            url: true,
          },
        },
      },
    });

    if (!product) return null;

    return {
      ...product,
      images: product.ProductImage.map((image) => image.url),
    };
  } catch (error) {
    console.error(error);
    throw new Error("Error getting product by slug");
  }
};
