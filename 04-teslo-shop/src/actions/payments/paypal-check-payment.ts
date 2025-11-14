"use server";

import { PayPalOrderStatusResponse } from "@/interfaces";

import { PrismaClient } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
const prisma = new PrismaClient();

export const payPalCheckPayment = async (transactionId: string) => {
  const authToken = await getPayPalBearerToken();

  if (!authToken) {
    return {
      ok: false,
      message: "Error getting auth token",
    };
  }

  const resp = await verifyPayPalPayment(transactionId, authToken);

  if (!resp) {
    return {
      ok: false,
      message: "Error verifying payment",
    };
  }

  const { status, purchase_units } = resp;
  const { invoice_id: orderId } = purchase_units[0];
  console.log({ status, purchase_units });

  if (status !== "COMPLETED") {
    return {
      ok: false,
      message: "Payment not completed",
    };
  }

  try {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    revalidatePath(`/orders/${orderId}`);

    return {
      ok: true,
      message: "Payment completed",
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error verifying payment",
    };
  }
};

const getPayPalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET_KEY;
  const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? "";

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(oauth2Url, {
      ...requestOptions,
      cache: "no-store",
    }).then((r) => r.json());
    return result.access_token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const verifyPayPalPayment = async (
  transactionId: string,
  bearerToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const res = await fetch(paypalOrderUrl, {
      ...requestOptions,
      cache: "no-store",
    }).then((r) => r.json());

    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};
