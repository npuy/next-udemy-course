"use server";

import { PrismaClient } from "@/generated/prisma/client";
const prisma = new PrismaClient();

import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL || "");

import { revalidatePath } from "next/cache";

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  if (!imageUrl.startsWith("http"))
    return { ok: false, message: "Invalid image URL" };

  const imageName = imageUrl.split("/").pop()?.split(".")[0] ?? "";
  console.log({ imageName });
  try {
    await cloudinary.uploader.destroy("teslo-shop/" + imageName);
    const deletedImage = await prisma.productImage.delete({
      where: { id: imageId },
      select: {
        product: {
          select: { slug: true },
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${deletedImage.product.slug}`);
    revalidatePath(`/products/${deletedImage.product.slug}`);

    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Error deleting product image" };
  }
};
