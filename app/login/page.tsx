import { LoginUserForm } from "@/components/LoginUserForm";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  console.log("🚀 ~ LoginPage ~ session:", session);
  return (
    <>
      <h1>LoginPage</h1>
      <LoginUserForm />
    </>
  );
}
