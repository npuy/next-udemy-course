import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as yup from "yup";

interface Segments {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, { params }: Segments) {
  const { id } = await params;

  const todo = await prisma.todo.findFirst({
    where: {
      id,
    },
  });

  if (!todo)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json(todo);
}

const putSchema = yup.object({
  description: yup.string().optional(),
  complete: yup.boolean().optional(),
});

export async function PUT(request: Request, { params }: Segments) {
  const { id } = await params;

  const todo = await prisma.todo.findFirst({
    where: {
      id,
    },
  });

  if (!todo)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  try {
    const { description, complete } = await putSchema.validate(
      await request.json()
    );

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { description, complete },
    });

    return NextResponse.json(updatedTodo);
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: Segments) {
  const { id } = await params;

  const todo = await prisma.todo.findFirst({
    where: {
      id,
    },
  });

  if (!todo)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  try {
    const updatedTodo = await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json(updatedTodo);
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}
