import { auth } from "@/auth";
import ArrowRight from "@icons/ArrowRight";
import InfoCard from "@ui/InfoCard";
import { getAppName } from "@utils/env";

const widgets = [
  { t: "Calories Consumed", i: "700", d: "Calories you've consumed today" },
  { t: "Calories Burned", i: "0", d: "Calories burned through exercise or BMR" },
  { t: "Calories Remaining", i: "1300", d: "Calories left to meet your goal" },
  { t: "Daily Goal", i: "2000", d: "Your target calorie intake for the day" },
];

export default async function Page() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <h1 className="text-2xl md:text-3xl">
        welcome to {getAppName()} <br />
        <span className="text-4xl md:text-5xl">{user?.name}</span>
      </h1>

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
