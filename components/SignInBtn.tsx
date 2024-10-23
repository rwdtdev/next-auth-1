"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export function SignInBtn() {
  return (
    <Button
      onClick={async () =>
        await signIn("credentials", {
          username: "user11",
          password: "password111",
          redirect: false,
        })
      }
    >
      Sign in
    </Button>
  );
}
