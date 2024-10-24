"use server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

type LoginData = {
  username: string;
  password: string;
};

const prisma = new PrismaClient();

export async function addUserAction({ username, password }: LoginData) {
  // const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, 10);
  // Store hash in your password DB.
  try {
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
      },
    });
    console.log("🚀 ~ addUserAction ~ user:", user);
  } catch (err) {
    console.error(err);
  }
}
