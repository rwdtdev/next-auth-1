/* eslint-disable */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
  }
}
