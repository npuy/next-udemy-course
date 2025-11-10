"use server";

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";

import { PrismaClient } from "@/generated/prisma/client";
const prisma = new PrismaClient();

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productsToOrder: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId)
    return {
      ok: false,
      message: "No user session",
    };

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productsToOrder.map((p) => p.productId),
      },
    },
  });

  const { itemsInOrder, subTotal } = productsToOrder.reduce(
    ({ itemsInOrder, subTotal }, p) => {
      const product = products.find((prod) => prod.id === p.productId);
      if (!product) throw new Error("Product not found");
      return {
        itemsInOrder: itemsInOrder + p.quantity,
        subTotal: subTotal + product.price * p.quantity,
      };
    },
    {
      itemsInOrder: 0,
      subTotal: 0,
    }
  );

  const tax = subTotal * 0.15;
  const total = subTotal * 1.15;

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Update product stock
      const updatedProductsPromises = products.map((prod) => {
        const productQuantity = productsToOrder
          .filter((p) => p.productId === prod.id)
          .reduce((acc, item) => acc + item.quantity, 0);

        if (productQuantity === 0)
          throw new Error(`${prod.id} not defined quantity`);

        return tx.product.update({
          where: { id: prod.id },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      updatedProducts.forEach((product) => {
        if (product.inStock < 0)
          throw new Error(`${product.title} does not have enough stock`);
      });

      // 2. Create order - details
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          tax,
          total,

          orderItems: {
            createMany: {
              data: productsToOrder.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price: products.find((prod) => prod.id === p.productId)!.price,
              })),
            },
          },
        },
      });

      // 3. Create order address
      const { country, ...addressRest } = address;
      const orderAddress = await tx.orderAddress.create({
        data: {
          orderId: order.id,
          countryId: country,
          ...addressRest,
        },
      });

      // 4. Return
      return {
        order,
        orderAddress,
        updatedProducts,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx,
    };
  } catch (err) {
    return {
      ok: false,
      message: (err as Error).message || "Could not place order",
    };
  }
};
