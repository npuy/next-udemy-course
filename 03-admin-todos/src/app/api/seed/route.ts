import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  await prisma.todo.deleteMany(); // delete * form todo
  await prisma.user.deleteMany(); // delete * form todo

  await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@mail.com",
      password: bcrypt.hashSync("1234", 10),
      roles: ["admin", "user"],
      todos: {
        create: [
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
      },
    },
  });

  return NextResponse.json({
    message: "Seed Executed",
  });
}
