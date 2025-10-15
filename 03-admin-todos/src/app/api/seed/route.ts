import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  await prisma.todo.deleteMany(); // delete * form todo

  await prisma.todo.createMany({
    data: [
      {
        description: "Soul Stone",
      },
      {
        description: "Power Stone",
        complete: true,
      },
      {
        description: "Time Stone",
      },
      {
        description: "Space Stone",
      },
      {
        description: "Reality Stone",
      },
    ],
  });

  return NextResponse.json({
    message: "Seed Executed",
  });
}
