export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getUserServerSession } from "@/auth/actions/auth-actions";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { NewTodo, TodosGrid } from "@/todos";

export default async function RestTodosPage() {
  const user = await getUserServerSession();
  if (!user) {
    redirect("/api/auth/signin");
  }

  const todos = await prisma.todo.findMany({
    where: {
      userId: user.id,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        description: "asc",
      },
    ],
  });

  return (
    <div>
      <div className="w-full px-3 mx-5 mb-5">
        <NewTodo />
      </div>
      <TodosGrid todos={todos} />
    </div>
  );
}
