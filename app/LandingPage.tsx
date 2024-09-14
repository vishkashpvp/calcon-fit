import Image from "next/image";

const HEADLINE = "united calories";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100dvh-160px)] md:min-h-[calc(100dvh-120px)] flex flex-col">
      <main className="flex-grow px-5 md:flex md:flex-row-reverse items-center">
        <Image
          className="mt-10 md:mt-0 w-full md:w-1/2"
          src="/images/kitchen-scale.png"
          alt="kitchen scale"
          width={750}
          height={750}
          priority
        />
        <div className="mt-5 w-full md:w-1/2">
          <h1 className="text-left text-gray-400">CalConFit - calorie consicous fitness</h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-red-600 dark:text-blue-400">
            {HEADLINE}
          </h2>
          <p className="text-lg mb-8">
            track your friends&#39; group calories effortlessly & boost motivation together! <br />
            subscribe for latest updates
          </p>
        </div>
      </main>
    </div>
  );
}
