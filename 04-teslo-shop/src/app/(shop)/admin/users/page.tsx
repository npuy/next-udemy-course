import { getUsers } from "@/actions";
import { Title } from "@/components";

import { redirect } from "next/navigation";
import { UsersTable } from "./ui/UsersTable";

export default async function UsersPage() {
  const { ok, users = [] } = await getUsers();

  if (!ok) return redirect("/auth/login");

  return (
    <>
      <Title title="Users" />

      <div className="mb-10">
        <UsersTable users={users} />
      </div>
    </>
  );
}
