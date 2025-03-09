"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Carrot, Flame, HeartCrack, Salad } from "lucide-react";
import { getAppName } from "@utils/env";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tracker } from "./Tracker";

// TODO: replace `TEMP_IMG_PATH` with some proper icon/image
const TEMP_IMG_PATH = "/images/kitchen-scale.png";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      session &&
      (!session.user.currentWeight ||
        !session.user.targetWeight ||
        !session.user.height ||
        !session.user.gender)
    ) {
      router.push("/setup");
    }
  }, [router, session]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in.</p>;

  return (
    <>
      <div className="flex items-center justify-between w-full p-3 px-5 border-b-2">
        <h1 className="text-2xl font-bold md:text-3xl">{getAppName()}</h1>
        <div className="flex items-center gap-5">
          <ThemeToggle />
          <Link href="/app/profile">
            <Avatar>
              <AvatarImage src={session.user.image || TEMP_IMG_PATH} alt="profile image" />
              <AvatarFallback>CCF</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between m-5 mb-0">
        <h1 className="text-xl">dashboard</h1>
        <Button asChild>
          <Link href="/app/meals">
            Add Meal <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 lg:grid-cols-4">
        <Tracker label="calories" consumed={1200} goal={session.user.dailyCalGoal} Icon={Flame} />
        <Tracker label="protein" consumed={42} unit="g" goal={120} Icon={Salad} />
        <Tracker label="carbs" consumed={350} unit="g" goal={250} Icon={Carrot} />
        <Tracker label="fat" consumed={22} unit="g" goal={50} Icon={HeartCrack} />
      </div>
    </>
  );
}
