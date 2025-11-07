"use server";

import { PrismaClient } from "@/generated/prisma/client";
const prisma = new PrismaClient();

export const deleteUserAddress = async (userId: string) => {
  try {
    await prisma.userAddress.delete({
      where: {
        userId,
      },
    });

    return {
      ok: true,
      message: "Address deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Address could not be deleted",
    };
  }
};
