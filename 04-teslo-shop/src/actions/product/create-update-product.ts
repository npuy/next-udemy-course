"use server";

import { PrismaClient } from "@/generated/prisma/client";
const prisma = new PrismaClient();

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Gender, Product, Size } from "@/generated/prisma/client";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL || "");

const productSchema = z.object({
  id: z.uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .nonnegative()
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .nonnegative()
    .transform((val) => Number(val.toFixed(0))),
  sizes: z.coerce.string().transform((val) => val.split(",")),
  tags: z.string(),
  categoryId: z.string(),
  gender: z.enum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);

  if (!productParsed.success) {
    console.error(productParsed.error);
    return { ok: false };
  }

  const product = productParsed.data;
  product.slug = product.slug.toLowerCase().trim().replaceAll(" ", "-");

  const { id, ...rest } = product;

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product;
      const tagsArray = rest.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase());

      if (id) {
        // Update product
        product = await tx.product.update({
          where: { id },
          data: {
            ...rest,
            sizes: { set: rest.sizes as Size[] },
            tags: { set: tagsArray },
          },
        });
      } else {
        // Create product
        product = await tx.product.create({
          data: {
            ...rest,
            sizes: rest.sizes as Size[],
            tags: tagsArray,
          },
        });
      }

      if (formData.has("images")) {
        const images = await uploadImages(formData.getAll("images") as File[]);
        if (!images) {
          throw new Error("Error uploading images");
        }

        await tx.productImage.createMany({
          data: images.map((image) => ({
            url: image,
            productId: product.id,
          })),
        });
      }

      return {
        product,
      };
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${prismaTx.product.slug}`);
    revalidatePath(`/products/${prismaTx.product.slug}`);

    return { ok: true, product: prismaTx.product };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Error at creating/updating product" };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      const buffer = Buffer.from(await image.arrayBuffer());
      return cloudinary.uploader
        .upload("data:image/jpeg;base64," + buffer.toString("base64"), {
          folder: "teslo-shop",
        })
        .then((r) => r.secure_url);
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (error) {
    console.error(error);
    return null;
  }
};
