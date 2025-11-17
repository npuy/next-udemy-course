"use server";

import { auth } from "@/auth.config";

import { PrismaClient } from "@/generated/prisma/client";
const prisma = new PrismaClient();

export const getUsers = async () => {
  const session = await auth();

  if (session?.user.role !== "admin")
    return {
      ok: false,
      message: "Not authorized",
    };

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        email: "desc",
      },
    });

    return {
      ok: true,
      users,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error getting users",
    };
  }
};
