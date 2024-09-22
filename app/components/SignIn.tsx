import { auth, signIn, signOut } from "@/auth";
import Button from "./ui/Button";

function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}>
      <Button text="Sign out" />
    </form>
  );
}

function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}>
      <Button text="Continue with Google" />
    </form>
  );
}

export default async function SignIn() {
  const session = await auth();
  console.log("session :>> ", session);
  const user = session?.user;

  return user ? (
    <>
      <h1 className="mb-5 text-xl">hi bro! {user.name}</h1>
      <SignOutButton />
    </>
  ) : (
    <SignInButton />
  );
}
