"use server";

import { PrismaClient } from "@/generated/prisma/client";
const prisma = new PrismaClient();

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  } catch (error) {
    console.error(error);
    return [];
  }
};
