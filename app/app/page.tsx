"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ArrowRight from "@icons/ArrowRight";
import InfoCard from "@ui/InfoCard";
import { getAppName } from "@utils/env";

const widgets = [
  { t: "Calories Consumed", i: "700", d: "Calories you've consumed today" },
  { t: "Calories Burned", i: "0", d: "Calories burned through exercise or BMR" },
  { t: "Calories Remaining", i: "1300", d: "Calories left to meet your goal" },
  { t: "Daily Goal", i: "2000", d: "Your target calorie intake for the day" },
];

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
      <h1 className="text-2xl md:text-3xl">
        welcome to {getAppName()} <br />
        <span className="text-4xl md:text-5xl">{session.user.name}</span>
      </h1>

      <div className="p-3 mt-5 bg-red-600">
        <p>Your email: {session.user.email}</p>
        <p>Current Weight: {session.user.currentWeight}</p>
        <p>Target Weight: {session.user.targetWeight}</p>
        <p>Height: {session.user.height}</p>
        <p>Gender: {session.user.gender}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-5 md:grid-cols-3">
        {widgets.map((widget) => (
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
