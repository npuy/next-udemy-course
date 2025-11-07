"use server";

import type { Address } from "@/interfaces";
import { PrismaClient } from "@/generated/prisma/client";
const prisma = new PrismaClient();

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddress(address, userId);

    return {
      ok: true,
      message: "Addres created or updated successfully",
      address: newAddress,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Addres could not be created",
    };
  }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: { userId },
    });

    const addressToSave = {
      userId,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      address2: address.address2,
      postalCode: address.postalCode,
      city: address.city,
      countryId: address.country,
      phone: address.phone,
    };

    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      });
      return newAddress;
    }
    const updatedAddress = await prisma.userAddress.update({
      where: { userId },
      data: addressToSave,
    });

    return updatedAddress;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating or replacing address");
  }
};
