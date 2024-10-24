"use client";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogOut } from "lucide-react";

export function EntryBtnsBlock() {
  const session = useSession();
  console.log("🚀 ~ EntryBtnsBlock ~ session:", session);

  if (session.status === "unauthenticated") {
    return (
      <ul className="flex space-x-2">
        <li>
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
        </li>
        <li>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </li>
      </ul>
    );
  } else if (session.status === "authenticated") {
    return (
      <div className="flex space-x-2 align-bottom">
        <span>{session.data.user?.name}</span>
        <LogOut
          size={20}
          onClick={() => {
            signOut();
          }}
        />
      </div>
    );
  } else if (session.status === "loading") {
    return <div>loading...</div>;
  }
}
