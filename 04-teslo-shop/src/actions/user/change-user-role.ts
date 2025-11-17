"use server";

import { auth } from "@/auth.config";

import { PrismaClient } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
const prisma = new PrismaClient();

export const changeUserRole = async (userId: string, role: string) => {
  const session = await auth();
  if (session?.user.role !== "admin")
    return {
      ok: false,
      message: "Not authorized",
    };

  try {
    const newRole = role === "admin" ? "admin" : "user";
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: newRole,
      },
    });

    revalidatePath("/admin/users");

    return {
      ok: true,
      message: "Role updated",
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error updating role",
    };
  }
};
