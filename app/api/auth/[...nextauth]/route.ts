import { PrismaClient } from "@prisma/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import _ from "lodash";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      // id: "credentials",
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials /* , req */) {
        if (!credentials) return null;

        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        // const res = await fetch("/your/endpoint", {
        //   method: "POST",
        //   body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" },
        // });
        // const user = await res.json();
        // If no error and we have user data, return it
        // if (res.ok && user) {
        //   return user;
        // }
        // // Return null if user data could not be retrieved
        // return null;
        const prisma = new PrismaClient();
        try {
          const user = await prisma.user.findUnique({
            where: {
              username: credentials?.username,
            },
          });
          if (!user) {
            return null;
          } else {
            const isPasswordCorrect = bcrypt.compareSync(
              credentials.password,
              user.passwordHash
            );
            if (!isPasswordCorrect) {
              return null;
            } else {
              return _.omit(user);
              // return user;
            }
          }
        } catch (err) {
          console.error(err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30,
    // You can define your own encode/decode functions for signing and encryption
    // async encode() {},
    // async decode() {},
  },
  callbacks: {
    async jwt({ token, user, account, profile, trigger }) {
      console.log("🚀 ~ jwt ~ trigger:", trigger);
      console.log("🚀 ~ jwt ~ token:", token);
      console.log("🚀 ~ jwt ~ profile:", profile);
      console.log("🚀 ~ jwt ~ account:", account);
      console.log("🚀 ~ jwt ~ user:", user);
      if (user) {
        token.name = user.username;

        console.log("🚀 ~ jwt ~ tokenWithUsername:", token);
      }
      return token;
    },
    // async session({ session, token, user }) {
    //   console.log("🚀 ~ session ~ user:", user);
    //   console.log("🚀 ~ session ~ token:", token);
    //   console.log("🚀 ~ session ~ session:", session);

    //   return session;
    // },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
