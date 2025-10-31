"use server";

import { PrismaClient } from "@/generated/prisma/client";
import type { Gender } from "@/interfaces";

const prisma = new PrismaClient();

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  if (isNaN(Number(take))) take = 1;
  if (take < 1) take = 1;

  const skip = (page - 1) * take;
  try {
    const products = await prisma.product.findMany({
      skip,
      take,
      where: {
        gender,
      },
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          },
        },
      },
    });

    // TODO: Se deberia de realizar ambos pedidos a la vez porque son independientes (promise all)
    const totalCount = await prisma.product.count({
      where: {
        gender,
      },
    });
    const totalPages = Math.ceil(totalCount / take);

    return {
      currentPage: page,
      totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    };
  } catch {
    throw new Error("Error al obtener los productos");
  }
};
