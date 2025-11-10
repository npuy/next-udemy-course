"use server";

import { Address, Order, Size } from "@/interfaces";
import { auth } from "@/auth.config";

import { PrismaClient } from "@/generated/prisma/client";
const prisma = new PrismaClient();

interface OrderInformation {
  order: Order;
  address: Address;
  items: {
    title: string;
    quantity: number;
    price: number;
    image: string;
    size: Size;
  }[];
}

export const getOrderById = async (
  orderId: string
): Promise<OrderInformation> => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      orderAddress: true,
      orderItems: true,
    },
  });
  if (!order || !order.orderAddress)
    throw new Error(`Order with id ${orderId} not found`);
  const productsIds = order.orderItems.map((item) => item.productId);

  const productImages = await prisma.product.findMany({
    where: {
      id: {
        in: productsIds,
      },
    },
    include: {
      ProductImage: {
        select: {
          url: true,
        },
      },
    },
  });

  const items = order.orderItems.map((item) => {
    const product = productImages.find((p) => p.id === item.productId)!;
    return {
      title: product.title,
      quantity: item.quantity,
      price: product.price,
      image: product.ProductImage[0].url,
      size: item.size,
    };
  });

  return {
    items,
    order: {
      id: order.id,
      itemsInOrder: order.itemsInOrder,
      subTotal: order.subTotal,
      tax: order.tax,
      total: order.total,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
    },
    address: {
      address: order.orderAddress.address,
      address2: order.orderAddress.address2 || "",
      city: order.orderAddress.city,
      country: order.orderAddress.countryId,
      firstName: order.orderAddress.firstName,
      lastName: order.orderAddress.lastName,
      phone: order.orderAddress.phone,
      postalCode: order.orderAddress.postalCode,
    },
  };
};

export const getOrderByIdNew = async (orderId: string) => {
  const session = await auth();
  if (!session?.user)
    return {
      ok: false,
      message: "User must be logged in",
    };

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderAddress: true,
        orderItems: {
          select: {
            price: true,
            quantity: true,
            size: true,
            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw new Error("Order not found");

    if (session.user.role !== "admin" && order.userId !== session.user.id)
      throw new Error("User not authorized");

    if (!order.orderAddress || !order.orderItems)
      throw new Error("Invalid order");

    return {
      ok: true,
      order,
    };
  } catch (err) {
    console.error(err);
    return {
      ok: "false",
      message: "Order not found",
    };
  }
};
