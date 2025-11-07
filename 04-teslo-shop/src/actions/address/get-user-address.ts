"use server";

import { PrismaClient } from "@/generated/prisma/client";
import { Address } from "@/interfaces";
const prisma = new PrismaClient();

export const getUserAddress = async (
  userId: string
): Promise<Address | undefined> => {
  try {
    const userAddress = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    });
    if (!userAddress) {
      return;
    }

    return {
      firstName: userAddress.firstName,
      lastName: userAddress.lastName,
      address: userAddress.address,
      address2: userAddress.address2 || "",
      city: userAddress.city,
      country: userAddress.countryId,
      phone: userAddress.phone,
      postalCode: userAddress.postalCode,
    };
  } catch (error) {
    console.error(error);
    return;
  }
};
