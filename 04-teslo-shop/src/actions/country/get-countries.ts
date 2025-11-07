"use server";

import { PrismaClient } from "@/generated/prisma/client";
const prisma = new PrismaClient();

export const getCountries = async () => {
  try {
    return await prisma.country.findMany({
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};
