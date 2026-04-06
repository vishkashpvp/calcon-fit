"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ArrowRight,
  ArrowLeft,
  Weight,
  Ruler,
  Calendar,
  Target,
  Zap,
  Dumbbell,
} from "lucide-react";
import { ACTIVITY_LEVELS } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    key: "weight",
    label: "Current Weight",
    icon: Weight,
    unit: "kg",
    field: "currentWeight",
    min: 30,
    max: 250,
    step: 0.5,
  },
  {
    key: "target",
    label: "Target Weight",
    icon: Target,
    unit: "kg",
    field: "targetWeight",
    min: 30,
    max: 250,
    step: 0.5,
  },
  {
    key: "height",
    label: "Height",
    icon: Ruler,
    unit: "cm",
    field: "height",
    min: 100,
    max: 250,
    step: 1,
  },
  {
    key: "age",
    label: "Age",
    icon: Calendar,
    unit: "years",
    field: "age",
    min: 10,
    max: 100,
    step: 1,
  },
  {
    key: "gender",
    label: "Gender",
    icon: Dumbbell,
    unit: "",
    field: "gender",
    min: 0,
    max: 0,
    step: 0,
  },
  {
    key: "activity",
    label: "Activity Level",
    icon: Zap,
    unit: "",
    field: "activityLevel",
    min: 0,
    max: 0,
    step: 0,
  },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

export default function ProfileSetupPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [form, setForm] = useState({
    currentWeight: 70,
    targetWeight: 65,
    height: 170,
    age: 25,
    gender: "male" as "male" | "female" | "other",
    activityLevel: 1.55,
  });

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;
  const isFirst = currentStep === 0;

  const goNext = useCallback(() => {
    if (isLast) return;
    setDirection(1);
    setCurrentStep((s) => s + 1);
  }, [isLast]);

  const goPrev = useCallback(() => {
    if (isFirst) return;
    setDirection(-1);
    setCurrentStep((s) => s - 1);
  }, [isFirst]);

  const updateNumeric = (field: string, value: number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentWeight: form.currentWeight,
          targetWeight: form.targetWeight,
          height: form.height,
          age: form.age,
          gender: form.gender,
          activityLevel: form.activityLevel,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const numVal = form[step.field as keyof typeof form] as number;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center px-4">
      {/* Progress dots */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === currentStep
                ? "bg-foreground w-6"
                : i < currentStep
                  ? "bg-foreground/40 w-3"
                  : "bg-foreground/10 w-3",
            )}
          />
        ))}
      </div>

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step.key}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon */}
            <div className="bg-foreground/5 mb-6 flex h-16 w-16 items-center justify-center">
              <step.icon className="text-foreground/70 h-7 w-7" />
            </div>

            {/* Label */}
            <h1 className="mb-2 text-xl font-bold tracking-tight">{step.label}</h1>

            {/* Numeric slider steps */}
            {(step.key === "weight" ||
              step.key === "target" ||
              step.key === "height" ||
              step.key === "age") && (
              <div className="mt-6 flex flex-col items-center gap-6">
                <div className="flex items-end gap-1">
                  <span className="text-6xl font-black tracking-tighter tabular-nums">
                    {typeof numVal === "number" && numVal % 1 !== 0 ? numVal.toFixed(1) : numVal}
                  </span>
                  <span className="text-muted-foreground mb-2 text-lg font-medium">
                    {step.unit}
                  </span>
                </div>

                {/* Slider */}
                <div className="w-full max-w-xs">
                  <input
                    type="range"
                    min={step.min}
                    max={step.max}
                    step={step.step}
                    value={numVal}
                    onChange={(e) => updateNumeric(step.field, parseFloat(e.target.value))}
                    className="slider-input w-full"
                  />
                  <div className="text-muted-foreground mt-2 flex justify-between text-xs tabular-nums">
                    <span>
                      {step.min}
                      {step.unit}
                    </span>
                    <span>
                      {step.max}
                      {step.unit}
                    </span>
                  </div>
                </div>

                {/* Fine tuning buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      updateNumeric(step.field, Math.max(step.min, numVal - step.step))
                    }
                    className="border-border hover:bg-muted/50 flex h-10 w-10 items-center justify-center border transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="text-muted-foreground text-xs">Fine tune</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateNumeric(step.field, Math.min(step.max, numVal + step.step))
                    }
                    className="border-border hover:bg-muted/50 flex h-10 w-10 items-center justify-center border transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Gender cards */}
            {step.key === "gender" && (
              <div className="mt-6 grid w-full grid-cols-3 gap-3">
                {(["male", "female", "other"] as const).map((g) => {
                  const active = form.gender === g;
                  const emoji = g === "male" ? "🙋‍♂️" : g === "female" ? "🙋‍♀️" : "🧑";
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, gender: g }))}
                      className={cn(
                        "flex flex-col items-center gap-2 border-2 py-6 transition-all",
                        active
                          ? "border-foreground bg-foreground/5 scale-[1.02]"
                          : "border-border/50 hover:border-border",
                      )}
                    >
                      <span className="text-3xl">{emoji}</span>
                      <span
                        className={cn(
                          "text-sm font-semibold capitalize",
                          active && "text-foreground",
                        )}
                      >
                        {g}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Activity level */}
            {step.key === "activity" && (
              <div className="mt-6 w-full space-y-2">
                {ACTIVITY_LEVELS.map((level) => {
                  const active = form.activityLevel === level.value;
                  return (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => updateNumeric("activityLevel", level.value)}
                      className={cn(
                        "flex w-full items-center gap-3 border-2 px-4 py-3.5 text-left transition-all",
                        active
                          ? "border-foreground bg-foreground/5"
                          : "border-border/50 hover:border-border",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center text-sm font-black",
                          active
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {ACTIVITY_LEVELS.indexOf(level) + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{level.label}</p>
                        <p className="text-muted-foreground text-xs">{level.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex w-full max-w-md items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={goPrev}
          disabled={isFirst}
          className={cn("gap-2", isFirst && "invisible")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {error && <p className="text-destructive text-xs">{error}</p>}

        {isLast ? (
          <Button variant="glow" onClick={handleSubmit} disabled={saving} className="gap-2">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            Calculate & Go
          </Button>
        ) : (
          <Button variant="glow" onClick={goNext} className="gap-2">
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
