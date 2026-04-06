"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Flame, Target, Users, Zap, ArrowRight, TrendingUp, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP } from "@/config/constants";
import { ThemeToggle } from "@/components/layout/theme-toggle";

function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const step = target / (duration * 60);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 1000 / 60);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
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
      className={`bento-spotlight group border-border/40 bg-card/60 hover:border-foreground/10 relative rounded-3xl border backdrop-blur-md transition-colors duration-500 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      {/* Soft ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-aurora absolute -top-1/4 -left-1/4 h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,oklch(0.5_0_0/0.06),transparent_70%)] blur-3xl" />
        <div className="animate-aurora-slow absolute -right-1/4 -bottom-1/4 h-[50vh] w-[50vh] rounded-full bg-[radial-gradient(circle,oklch(0.5_0_0/0.04),transparent_70%)] blur-3xl" />
        <div className="animate-aurora absolute top-1/3 left-1/2 h-[40vh] w-[40vh] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.5_0_0/0.03),transparent_70%)] blur-3xl" />
      </div>

      {/* Dot grid texture */}
      <div className="dot-grid animate-grid-fade pointer-events-none fixed inset-0" />

      {/* Nav */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 md:px-12 lg:px-20">
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-bold tracking-tight">{APP.NAME}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/sign-in">
            <Button
              variant="outline"
              size="sm"
              className="border-border/60 rounded-full px-5 backdrop-blur-sm"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <motion.section
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative mx-auto flex min-h-[90vh] max-w-6xl flex-col items-center justify-center px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-foreground/10 bg-foreground/3 text-foreground mb-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
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
            CalConFit turns nutrition into a game. Earn XP for every meal, build daily streaks,
            level up from Rookie to Legend — and actually enjoy tracking what you eat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex items-center gap-4"
          >
            <Link href="/sign-in">
              <Button variant="glow" size="xl" className="group rounded-full px-8 text-base">
                Start Free
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <span className="text-muted-foreground text-xs">No credit card. Ever.</span>
          </motion.div>

          {/* Dashboard mockup */}
          <div className="relative mt-20 w-full max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="relative"
            >
              <div className="border-border/30 bg-card/70 overflow-hidden rounded-2xl border shadow-2xl shadow-black/10 backdrop-blur-xl">
                <div className="border-border/30 flex items-center gap-1.5 border-b px-4 py-2.5">
                  <div className="bg-foreground/20 h-2.5 w-2.5 rounded-full" />
                  <div className="bg-foreground/15 h-2.5 w-2.5 rounded-full" />
                  <div className="bg-foreground/10 h-2.5 w-2.5 rounded-full" />
                  <span className="text-muted-foreground ml-3 text-[11px]">
                    CalConFit — Dashboard
                  </span>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs">Good afternoon, Alex</p>
                      <p className="mt-1 text-2xl font-bold md:text-3xl">
                        1,247{" "}
                        <span className="text-muted-foreground text-base font-normal">
                          / 2,000 cal
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-foreground/5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold">
                        <Flame className="text-accent-amber h-4 w-4" />7
                      </div>
                      <div className="bg-foreground/5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold">
                        <Star className="h-4 w-4" />
                        Lv 3
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/10 mt-5 h-2.5 overflow-hidden rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "62%" }}
                      transition={{ duration: 2, delay: 1.2, ease: "easeOut" }}
                      className="bg-accent-blue/70 h-full rounded-full"
                    />
                  </div>

                  <div className="mt-5 flex gap-3">
                    {[
                      { label: "Protein", val: "82g", shade: "bg-accent-blue" },
                      { label: "Carbs", val: "156g", shade: "bg-accent-blue/70" },
                      { label: "Fat", val: "47g", shade: "bg-accent-blue/45" },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="border-border/30 flex flex-1 items-center gap-2.5 rounded-xl border px-3 py-2.5"
                      >
                        <div className={`h-2 w-2 rounded-full ${m.shade}`} />
                        <div className="min-w-0">
                          <p className="text-muted-foreground truncate text-[11px]">{m.label}</p>
                          <p className="text-sm font-semibold">{m.val}</p>
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
                className="animate-float border-border/30 bg-card/90 shadow-foreground/5 absolute top-1/4 -right-4 hidden rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-lg md:block"
              >
                <div className="flex items-center gap-2.5">
                  <div className="bg-foreground/10 flex h-8 w-8 items-center justify-center rounded-lg">
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
                className="animate-float-delay border-border/30 bg-card/90 shadow-foreground/5 absolute bottom-1/4 -left-4 hidden rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-lg md:block"
              >
                <div className="flex items-center gap-2.5">
                  <div className="bg-warning/15 flex h-8 w-8 items-center justify-center rounded-lg">
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
        </motion.section>

        {/* Social proof strip */}
        <section className="relative mx-auto max-w-4xl px-6 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-center"
          >
            {[
              { value: 2400, suffix: "+", label: "Meals logged" },
              { value: 180, suffix: "+", label: "Active users" },
              { value: 97, suffix: "%", label: "Streak retention" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold tabular-nums">
                  <AnimatedCounter target={stat.value} />
                  {stat.suffix}
                </p>
                <p className="text-muted-foreground text-xs">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Bento Features */}
        <section className="relative mx-auto max-w-6xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-center"
          >
            <span className="text-muted-foreground text-sm font-medium">Features</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight md:text-5xl"
          >
            Everything you need.{" "}
            <span className="text-muted-foreground">Nothing you don&apos;t.</span>
          </motion.h2>

          <div className="mt-16 grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Calorie Tracking */}
            <BentoCard className="p-8 sm:col-span-2" delay={0}>
              <div className="flex h-full flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-sm">
                  <div className="bg-foreground/6 mb-3 flex h-10 w-10 items-center justify-center rounded-xl">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold">Smart Calorie Tracking</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    Search our food database, log meals in seconds, and watch your macros
                    auto-calculate. Protein, carbs, fat — all accounted for.
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {[
                    { label: "Protein", val: "82g", shade: "bg-accent-blue" },
                    { label: "Carbs", val: "156g", shade: "bg-accent-blue/70" },
                    { label: "Fat", val: "47g", shade: "bg-accent-blue/45" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="bg-foreground/3 flex w-20 flex-col items-center rounded-2xl px-3 py-4"
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
            <BentoCard className="row-span-2 p-8" delay={0.08}>
              <div className="flex h-full flex-col">
                <div className="bg-foreground/6 mb-4 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">XP & Levels</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Every action earns experience points. Level up through five ranks as you build
                  healthier habits.
                </p>
                <div className="mt-auto space-y-3 pt-8">
                  {[
                    { level: "Rookie", xp: "0", w: "w-[15%]", opacity: "bg-accent-blue/20" },
                    { level: "Explorer", xp: "100", w: "w-[35%]", opacity: "bg-accent-blue/35" },
                    { level: "Warrior", xp: "300", w: "w-[55%]", opacity: "bg-accent-blue/50" },
                    { level: "Champion", xp: "600", w: "w-[75%]", opacity: "bg-accent-blue/65" },
                    { level: "Legend", xp: "1000", w: "w-[85%]", opacity: "bg-accent-blue/75" },
                    { level: "MOMA", xp: "2000", w: "w-full", opacity: "bg-accent-blue/90" },
                  ].map((l) => (
                    <div key={l.level} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{l.level}</span>
                        <span className="text-muted-foreground">{l.xp} XP</span>
                      </div>
                      <div className="bg-primary/10 h-1.5 rounded-full">
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
            <BentoCard className="p-8" delay={0.16}>
              <div className="flex h-full flex-col">
                <div className="bg-accent-amber/10 mb-3 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Flame className="text-accent-amber h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">Daily Streaks</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Log every day to build your streak. The longer the chain, the more XP you earn.
                </p>
                <div className="mt-auto flex items-end gap-1 pt-6">
                  {[3, 5, 4, 6, 7, 5, 8, 6, 7, 9, 8, 10, 9, 11].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h * 4}px` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.04 }}
                      className="bg-accent-blue/25 flex-1 rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
            </BentoCard>

            {/* Squads */}
            <BentoCard className="p-8" delay={0.24}>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <div className="bg-accent-violet/10 flex h-10 w-10 items-center justify-center rounded-xl">
                    <Users className="text-accent-violet h-5 w-5" />
                  </div>
                  <span className="border-foreground/15 bg-foreground/5 rounded-full border px-2 py-0.5 text-[10px] font-semibold">
                    SOON
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-bold">Squad Goals</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Create squads, invite friends, and compete on shared leaderboards. Accountability
                  meets fun.
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
        <section className="relative mx-auto max-w-6xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="border-border/30 bg-card/50 relative overflow-hidden rounded-3xl border px-8 py-16 text-center backdrop-blur-xl md:px-16 md:py-24"
          >
            <div className="animate-pulse-glow pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,oklch(0.5_0_0/0.08),transparent_70%)] blur-2xl" />
            <div className="animate-pulse-glow pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,oklch(0.5_0_0/0.06),transparent_70%)] blur-2xl" />

            <h2 className="relative text-3xl font-bold tracking-tight md:text-5xl">
              Ready to play?
            </h2>
            <p className="text-muted-foreground relative mx-auto mt-4 max-w-md">
              Join CalConFit and start earning XP for every healthy choice. Free forever.
            </p>
            <div className="relative mt-8">
              <Link href="/sign-in">
                <Button variant="glow" size="xl" className="group rounded-full px-10 text-base">
                  Create Account
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-border/30 relative z-10 border-t py-8 text-center">
        <p className="text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} {APP.NAME}. Built for gains.
        </p>
      </footer>
    </div>
  );
}
