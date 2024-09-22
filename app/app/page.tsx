import { auth } from "@/auth";
import { getAppName } from "@utils/env";

export default async function Page() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <h1 className="text-2xl md:text-3xl">
        welcome to {getAppName()} <br />
        <span className="text-4xl md:text-5xl">{user?.name}</span>
      </h1>
    </>
  );
}
