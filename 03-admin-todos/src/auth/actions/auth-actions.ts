import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const getUserServerSession = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const signInEmailPassword = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const newUser = await createUser(email, password);
    return newUser;
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password ?? "");
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  return user;
};

const createUser = async (email: string, password: string) => {
  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: bcrypt.hashSync(password, 10),
      name: email.split("@")[0],
    },
  });

  return newUser;
};
