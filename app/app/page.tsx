"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ArrowRight from "@icons/ArrowRight";
import InfoCard from "@ui/InfoCard";
import { getAppName } from "@utils/env";

const widgets = (dailyCalGoal: number) => [
  { t: "Calories Consumed", i: "700", d: "Calories you've consumed today" },
  { t: "Calories Burned", i: "0", d: "Calories burned through exercise or BMR" },
  { t: "Calories Remaining", i: "1300", d: "Calories left to meet your goal" },
  { t: "Daily Goal", i: dailyCalGoal.toString(), d: "Your target calorie intake for the day" },
];

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

  const dailyCalGoal = session.user.dailyCalGoal;

  return (
    <>
      <div className="fixed flex items-center justify-between w-full p-3 px-5 border-b-2">
        <h1 className="text-2xl font-bold md:text-3xl">{getAppName()}</h1>
        <Link href="/app/profile">
          <Image
            src={session.user.image || TEMP_IMG_PATH}
            alt="profile image"
            width={48}
            height={48}
            className="w-10 rounded-3xl"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 p-5 pt-24 md:grid-cols-3">
        {widgets(dailyCalGoal).map((widget) => (
          <InfoCard
            key={widget.t}
            title={widget.t}
            info={widget.i}
            description={widget.d}
            Icon={<ArrowRight />}
          />
        ))}
      </div>
    </>
  );
}
