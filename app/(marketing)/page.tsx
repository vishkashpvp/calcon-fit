"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Flame, Target, Users, Zap, Loader2, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP } from "@/config/constants";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { signIn } from "@/lib/auth-client";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function BentoCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };
    el.addEventListener("mousemove", handler);
    return () => el.removeEventListener("mousemove", handler);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`bento-spotlight group border-border bg-card/80 hover:border-foreground/15 dark:bg-card/70 relative border backdrop-blur-md transition-colors duration-500 ${className}`}
    >
      {children}
    </motion.div>
  );
}

const FLOATING_FOODS = [
  { emoji: "🍎", size: "text-3xl", dur: 80 },
  { emoji: "🥑", size: "text-2xl", dur: 96 },
  { emoji: "🍗", size: "text-2xl", dur: 88 },
  { emoji: "🥦", size: "text-3xl", dur: 104 },
  { emoji: "🥕", size: "text-2xl", dur: 92 },
  { emoji: "🍳", size: "text-xl", dur: 84 },
  { emoji: "🍇", size: "text-xl", dur: 76 },
  { emoji: "🍕", size: "text-3xl", dur: 88 },
  { emoji: "🍣", size: "text-2xl", dur: 96 },
  { emoji: "🥐", size: "text-xl", dur: 84 },
];

const BENEFITS = [
  {
    icon: Target,
    stat: "2x",
    heading: "More likely to reach your goals",
    description:
      "People who consistently track meals lose twice as much weight and hit their macro targets more often — awareness is the first step to change.",
  },
  {
    icon: Users,
    stat: "65%",
    heading: "Stronger habits with friends",
    description:
      "When you track alongside others, accountability kicks in. Groups stick to their plans 65% longer than solo trackers — that's the squad effect.",
  },
  {
    icon: TrendingUp,
    stat: "3x",
    heading: "Higher retention through gamification",
    description:
      "XP, levels, and streaks tap into your brain's reward system. Gamified health apps see 3x longer engagement than traditional calorie counters.",
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [foodPositions, setFoodPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    setFoodPositions(
      FLOATING_FOODS.map(() => ({
        x: Math.round(Math.random() * 85 + 5),
        y: Math.round(Math.random() * 85 + 5),
      })),
    );
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const handleSignIn = async () => {
    setSigningIn(true);
    await signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  return (
    <>
      {/* Floating food items — positions randomized on mount */}
      {foodPositions.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {FLOATING_FOODS.map((food, i) => {
            const pos = foodPositions[i];
            const s = pos.x * 100 + pos.y;
            const xPts = [0];
            const yPts = [0];
            const rPts = [0];
            for (let j = 1; j <= 6; j++) {
              xPts.push(((s * 7919 + j * 104729) % 1000) - 500);
              yPts.push(((s * 6271 + j * 85159) % 800) - 400);
              rPts.push(((s * 3571 + j * 7919) % 60) - 30);
            }
            xPts.push(0);
            yPts.push(0);
            rPts.push(0);
            return (
              <motion.span
                key={i}
                className={`absolute ${food.size}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                animate={{ x: xPts, y: yPts, rotate: rPts }}
                transition={{
                  duration: food.dur,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {food.emoji}
              </motion.span>
            );
          })}
        </div>
      )}
      <div className="bg-background relative min-h-screen overflow-hidden">
        {/* Soft ambient blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="animate-aurora absolute -top-1/4 -left-1/4 h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,oklch(0.5_0_0/0.06),transparent_70%)] blur-3xl" />
          <div className="animate-aurora-slow absolute -right-1/4 -bottom-1/4 h-[50vh] w-[50vh] rounded-full bg-[radial-gradient(circle,oklch(0.5_0_0/0.04),transparent_70%)] blur-3xl" />
          <div className="animate-aurora absolute top-1/3 left-1/2 h-[40vh] w-[40vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.5_0_0/0.03),transparent_70%)] blur-3xl" />
        </div>

        {/* Dot grid texture */}
        <div className="dot-grid animate-grid-fade pointer-events-none fixed inset-0" />

        {/* Nav — absolute so hero can center in full viewport */}
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-12 lg:px-20">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold tracking-tight">{APP.NAME}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="border-border gap-2 rounded-full px-5 backdrop-blur-sm"
              onClick={handleSignIn}
              disabled={signingIn}
            >
              {signingIn ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <GoogleIcon className="h-3.5 w-3.5" />
              )}
              Sign In
            </Button>
          </div>
        </header>

        <main className="relative z-10">
          {/* Hero */}
          <motion.section
            ref={heroRef}
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
            className="relative mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="border-foreground/10 bg-foreground/5 text-foreground mb-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="bg-foreground absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                <span className="bg-foreground relative inline-flex h-2 w-2 rounded-full" />
              </span>
              Nutrition tracking, reimagined
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-4xl text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] font-extrabold tracking-tighter"
            >
              Your calories.
              <br />
              <span className="gradient-text">Your quest.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-muted-foreground mt-7 max-w-xl text-base leading-relaxed md:text-lg"
            >
              Stop dreading your food diary. CalConFit makes tracking feel like a game — earn XP,
              unlock levels, compete with friends, and build streaks that stick.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-10 flex flex-col items-center gap-3"
            >
              <Button
                variant="glow"
                size="xl"
                className="gap-3 rounded-full px-8 text-base"
                onClick={handleSignIn}
                disabled={signingIn}
              >
                {signingIn ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <GoogleIcon className="h-5 w-5" />
                )}
                Continue with Google
              </Button>
              <span className="text-muted-foreground text-xs">Free forever. No credit card.</span>
            </motion.div>
          </motion.section>

          {/* Dashboard mockup — between hero and benefits */}
          <section className="relative mx-auto -mt-20 max-w-3xl px-4 sm:px-6">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="relative"
              >
                <div className="border-border bg-card/90 dark:bg-card/80 overflow-hidden border shadow-2xl shadow-black/10 backdrop-blur-xl">
                  <div className="border-border flex items-center gap-1.5 border-b px-4 py-2.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                    <span className="text-muted-foreground ml-3 text-[11px]">
                      CalConFit — Dashboard
                    </span>
                  </div>
                  <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-muted-foreground text-xs">Good afternoon, Winnie</p>
                        <p className="mt-1 text-xl font-bold sm:text-2xl md:text-3xl">
                          1,247{" "}
                          <span className="text-muted-foreground text-sm font-normal sm:text-base">
                            / 2,000 cal
                          </span>
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                        <div className="bg-foreground/10 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-sm">
                          <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4" />7
                        </div>
                        <div className="bg-foreground/10 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-sm">
                          <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Lv 3
                        </div>
                      </div>
                    </div>

                    <div className="bg-foreground/10 mt-4 h-2 overflow-hidden rounded-full sm:mt-5 sm:h-2.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "62%" }}
                        transition={{ duration: 2, delay: 1.2, ease: "easeOut" }}
                        className="bg-bar-fill/50 h-full rounded-full"
                      />
                    </div>

                    <div className="mt-4 flex gap-1.5 sm:mt-5 sm:gap-3">
                      {[
                        { label: "Protein", val: "82g", shade: "bg-bar-fill/50" },
                        { label: "Carbs", val: "156g", shade: "bg-bar-fill/35" },
                        { label: "Fat", val: "47g", shade: "bg-bar-fill/22" },
                      ].map((m) => (
                        <div
                          key={m.label}
                          className="border-border flex flex-1 items-center gap-1.5 border px-2 py-2 sm:gap-2.5 sm:px-3 sm:py-2.5"
                        >
                          <div className={`h-2 w-2 shrink-0 rounded-full ${m.shade}`} />
                          <div className="min-w-0">
                            <p className="text-muted-foreground truncate text-[10px] sm:text-[11px]">
                              {m.label}
                            </p>
                            <p className="text-xs font-semibold sm:text-sm">{m.val}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating XP toast */}
                <motion.div
                  initial={{ opacity: 0, x: 40, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.8 }}
                  className="animate-float border-border bg-card shadow-foreground/5 absolute top-1/4 -right-4 hidden border px-4 py-3 shadow-xl backdrop-blur-lg md:block"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="bg-foreground/10 flex h-8 w-8 items-center justify-center">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">+10 XP earned</p>
                      <p className="text-muted-foreground text-[10px]">Lunch logged</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating streak badge */}
                <motion.div
                  initial={{ opacity: 0, x: -40, y: -20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.6, delay: 2.1 }}
                  className="animate-float-delay border-border bg-card shadow-foreground/5 absolute bottom-1/4 -left-4 hidden border px-4 py-3 shadow-xl backdrop-blur-lg md:block"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="bg-warning/15 flex h-8 w-8 items-center justify-center">
                      <Flame className="text-warning h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">7-day streak!</p>
                      <p className="text-muted-foreground text-[10px]">Keep it going</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t to-transparent" />
            </div>
          </section>

          {/* Why Track — real-world benefits */}
          <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mb-4 text-center"
            >
              <span className="text-muted-foreground text-sm font-semibold tracking-widest uppercase">
                Why it works
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mx-auto max-w-2xl text-center text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl"
            >
              Science-backed.
              <br />
              <span className="text-muted-foreground">Results-driven.</span>
            </motion.h2>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {BENEFITS.map((benefit, i) => (
                <BentoCard key={benefit.heading} className="p-5 sm:p-8" delay={i * 0.08}>
                  <div className="flex h-full flex-col">
                    <div className="bg-foreground/10 mb-4 flex h-10 w-10 items-center justify-center">
                      <benefit.icon className="h-5 w-5" />
                    </div>
                    <p className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
                      {benefit.stat}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold">{benefit.heading}</h3>
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </BentoCard>
              ))}
            </div>
          </section>

          {/* Bento Features */}
          <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="mb-4 text-center"
            >
              <span className="text-muted-foreground text-sm font-semibold tracking-widest uppercase">
                Features
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mx-auto max-w-2xl text-center text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl"
            >
              Everything you need.
              <br />
              <span className="text-muted-foreground">Nothing you don&apos;t.</span>
            </motion.h2>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 sm:auto-rows-[minmax(180px,auto)] sm:grid-cols-2 lg:grid-cols-3">
              {/* Calorie Tracking */}
              <BentoCard className="p-5 sm:col-span-2 sm:p-8" delay={0}>
                <div className="flex h-full flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div className="max-w-sm">
                    <div className="bg-foreground/10 mb-3 flex h-10 w-10 items-center justify-center">
                      <Target className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold">Smart Calorie Tracking</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      Log any meal in under 10 seconds. Our food database auto-fills macros so you
                      know exactly where your protein, carbs, and fat stand — no manual math.
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1.5 sm:gap-2">
                    {[
                      { label: "Protein", val: "82g", shade: "bg-bar-fill/50" },
                      { label: "Carbs", val: "156g", shade: "bg-bar-fill/35" },
                      { label: "Fat", val: "47g", shade: "bg-bar-fill/22" },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="bg-foreground/5 flex w-16 flex-col items-center px-2 py-3 sm:w-20 sm:px-3 sm:py-4"
                      >
                        <span className="text-muted-foreground text-[10px]">{m.label}</span>
                        <div className={`my-1 h-1 w-6 rounded-full ${m.shade}`} />
                        <span className="text-lg font-bold">{m.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </BentoCard>

              {/* XP System */}
              <BentoCard className="p-5 sm:row-span-2 sm:p-8" delay={0.08}>
                <div className="flex h-full flex-col">
                  <div className="bg-foreground/10 mb-4 flex h-10 w-10 items-center justify-center">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold">XP & Levels</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    Every meal logged, every goal hit, every streak day — it all counts. Climb from
                    Rookie to MOMA across six ranks that reward consistency.
                  </p>
                  <div className="mt-auto space-y-3 pt-8">
                    {[
                      { level: "Rookie", xp: "0", w: "w-[15%]", opacity: "bg-bar-fill/12" },
                      { level: "Explorer", xp: "100", w: "w-[35%]", opacity: "bg-bar-fill/22" },
                      { level: "Warrior", xp: "300", w: "w-[55%]", opacity: "bg-bar-fill/32" },
                      { level: "Champion", xp: "600", w: "w-[75%]", opacity: "bg-bar-fill/42" },
                      { level: "Legend", xp: "1000", w: "w-[85%]", opacity: "bg-bar-fill/52" },
                      { level: "MOMA", xp: "2000", w: "w-full", opacity: "bg-bar-fill/65" },
                    ].map((l) => (
                      <div key={l.level} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">{l.level}</span>
                          <span className="text-muted-foreground">{l.xp} XP</span>
                        </div>
                        <div className="bg-foreground/10 h-1.5 rounded-full">
                          <div
                            className={`h-full rounded-full ${l.opacity} ${l.w} transition-all duration-1000`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </BentoCard>

              {/* Streaks */}
              <BentoCard className="p-5 sm:p-8" delay={0.16}>
                <div className="flex h-full flex-col">
                  <div className="bg-foreground/10 mb-3 flex h-10 w-10 items-center justify-center">
                    <Flame className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold">Daily Streaks</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    Miss a day and the chain breaks. Keep going and the XP multiplier grows. Simple
                    psychology, powerful results.
                  </p>
                  <div className="mt-auto flex items-end gap-1 pt-6">
                    {[3, 5, 4, 6, 7, 5, 8, 6, 7, 9, 8, 10, 9, 11].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h * 4}px` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.04 }}
                        className="bg-bar-fill/15 flex-1"
                      />
                    ))}
                  </div>
                </div>
              </BentoCard>

              {/* Squads */}
              <BentoCard className="p-5 sm:p-8" delay={0.24}>
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <div className="bg-foreground/10 flex h-10 w-10 items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="border-foreground/15 bg-foreground/5 rounded-full border px-2 py-0.5 text-[10px] font-semibold">
                      SOON
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold">Squad Goals</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    Create a squad, invite your gym crew, and race to the top of the leaderboard.
                    Because nutrition is a team sport.
                  </p>
                  <div className="mt-auto flex items-center -space-x-2 pt-6">
                    {["/20", "/15", "/10", "/6"].map((opacity, i) => (
                      <div
                        key={i}
                        className={`border-card flex h-8 w-8 items-center justify-center rounded-full border-2 bg-foreground${opacity} text-[10px] font-bold`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    <div className="border-card bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full border-2 text-[10px] font-bold">
                      +12
                    </div>
                  </div>
                </div>
              </BentoCard>
            </div>
          </section>

          {/* CTA */}
          <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="border-border bg-card/80 dark:bg-card/70 relative overflow-hidden border px-5 py-12 text-center backdrop-blur-xl sm:px-8 sm:py-16 md:px-16 md:py-24"
            >
              <div className="animate-pulse-glow pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,oklch(0.5_0_0/0.08),transparent_70%)] blur-2xl" />
              <div className="animate-pulse-glow pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,oklch(0.5_0_0/0.06),transparent_70%)] blur-2xl" />

              <h2 className="relative text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl">
                Ready to play?
              </h2>
              <p className="text-muted-foreground relative mx-auto mt-4 max-w-md">
                Your next meal could be your first XP. Start tracking today — it's free, forever.
              </p>
              <div className="relative mt-8">
                <Button
                  variant="glow"
                  size="xl"
                  className="gap-2.5 rounded-full px-6 text-sm sm:gap-3 sm:px-10 sm:text-base"
                  onClick={handleSignIn}
                  disabled={signingIn}
                >
                  {signingIn ? (
                    <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                  ) : (
                    <GoogleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                  Get Started with Google
                </Button>
              </div>
            </motion.div>
          </section>
        </main>

        <footer className="border-border relative z-10 border-t py-8 text-center">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} {APP.NAME}. Built for gains.
          </p>
        </footer>
      </div>
    </>
  );
}
