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

export async function loginAction({ username, password }: LoginData) {
  // Store hash in your password DB.
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      return { isLoginSuccessful: false, message: "no such user" };
    } else {
      const isPasswordCorrect = bcrypt.compareSync(password, user.passwordHash);
      if (!isPasswordCorrect) {
        return { isLoginSuccessful: false, message: "password is not correct" };
      } else {
        return { isLoginSuccessful: true, message: "log in successfully" };
      }
    }
  } catch (err) {
    console.error(err);
  }
}
