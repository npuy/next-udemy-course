import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const take = Number(searchParams.get("take")) ?? 10;
  if (isNaN(take))
    return NextResponse.json(
      { message: "Take must be a number" },
      { status: 400 }
    );

  const skip = Number(searchParams.get("skip")) ?? 0;
  if (isNaN(skip))
    return NextResponse.json(
      { message: "Skip must be a number" },
      { status: 400 }
    );

  const todos = await prisma.todo.findMany({
    take,
    skip,
  });

  return NextResponse.json(todos);
}

const postSchema = yup.object({
  description: yup.string().required(),
  complete: yup.boolean().optional().default(false),
});

export async function POST(request: Request) {
  const rawBody = await request.json();
  try {
    const { description, complete } = await postSchema.validate(rawBody);

    const todo = await prisma.todo.create({ data: { description, complete } });

    return NextResponse.json(todo);
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}
