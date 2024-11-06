"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Input from "@ui/Input";

// TODO: replace `TEMP_IMG_PATH` with some proper icon/image
const TEMP_IMG_PATH = "/images/kitchen-scale.png";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in.</p>;

  return (
    <>
      <h1 className="mb-5 text-3xl">profile</h1>

      <div className="max-w-md p-4 text-blue-900 bg-blue-100 border-l-4 border-blue-500 rounded-md shadow-sm dark:text-blue-100 dark:bg-blue-950/50">
        <p className="mb-1 text-xs font-semibold text-blue-600 uppercase">Note</p>
        <p>currently, the profile cannot be edited</p>
      </div>

      <div className="flex gap-5 my-5">
        <div className="mt-5">
          <Image
            src={session.user.image || TEMP_IMG_PATH}
            alt="profile image"
            width={64}
            height={64}
            className="w-16 md:w-12 rounded-3xl"
          />
        </div>
        <div className="flex flex-col gap-5 w-96">
          <Input
            readOnly
            label="name"
            value={session.user.name || ""}
          />
          <Input
            readOnly
            label="email"
            value={session.user.email || ""}
          />
          <div className="flex gap-5">
            <Input
              readOnly
              label="current weight"
              value={session.user.currentWeight}
            />
            <Input
              readOnly
              label="target weight"
              value={session.user.targetWeight}
            />
          </div>
          <Input
            readOnly
            label="daily calorie goal"
            value={session.user.dailyCalGoal}
          />
          <Input
            readOnly
            label="height"
            value={session.user.height}
          />
        </div>
      </div>
    </>
  );
}
