import Image from "next/image";
import ArrowRight from "@icons/ArrowRight";
import Button from "@ui/Button";
import { getAppName } from "@utils/env";

const APP_NAME = getAppName();
const HEADLINE = "united calories";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100dvh-160px)] md:min-h-[calc(100dvh-120px)] flex flex-col">
      <main className="items-center flex-grow px-5 md:flex md:flex-row-reverse">
        <Image
          className="w-full mt-10 md:mt-0 md:w-1/2"
          src="/images/kitchen-scale.png"
          alt="kitchen scale"
          width={750}
          height={750}
          priority
        />
        <div className="w-full mt-5 md:w-1/2">
          <h1 className="text-left text-gray-400">{APP_NAME} - calorie consicous fitness</h1>
          <h2 className="mb-4 text-4xl font-bold text-red-600 md:text-5xl dark:text-blue-400">
            {HEADLINE}
          </h2>
          <p className="mb-8 text-lg">
            track your friends&#39; group calories effortlessly & boost motivation together! <br />
            subscribe for latest updates
          </p>
          <Button
            text={"Get Started"}
            icon={<ArrowRight />}
            iconAlign="end"
          />
        </div>
      </main>
    </div>
  );
}
