"use server";

import { Gender } from "@/generated/prisma/client";
import { z } from "zod";

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

  console.log(productParsed.data);

  return { ok: true };
};
