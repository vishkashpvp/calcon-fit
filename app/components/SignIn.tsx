import { auth, signIn, signOut } from "@/auth";

function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}>
      <div className="bg-black dark:bg-blue-200 w-fit relative">
        <div className="h-full elevate-btn elevate-4 border-5 border-black bg-white flex flex-col gap-6 transform hover:translate-x-1 hover:-translate-y-1">
          <button
            className="text-xl p-2 px-4 text-black bg-blue-400"
            type="submit">
            Sign out
          </button>
        </div>
      </div>
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
      <div className="bg-black dark:bg-blue-200 w-fit relative">
        <div className="h-full elevate-btn elevate-4 border-5 border-black bg-white flex flex-col gap-6 transform hover:translate-x-1 hover:-translate-y-1">
          <button
            className="text-xl p-2 text-black bg-blue-400"
            type="submit">
            Continue with Google
          </button>
        </div>
      </div>
    </form>
  );
}

export default async function SignIn() {
  const session = await auth();
  console.log("session :>> ", session);
  const user = session?.user;

  return user ? (
    <>
      <h1 className="text-xl mb-5">hi bro! {user.name}</h1>
      <SignOutButton />
    </>
  ) : (
    <SignInButton />
  );
}
