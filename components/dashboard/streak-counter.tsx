"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  streak: number;
  longestStreak: number;
  showHint?: boolean;
}

export function StreakCounter({ streak, longestStreak, showHint }: StreakCounterProps) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <motion.div
          animate={streak > 0 ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className={cn(
            "flex h-10 w-10 items-center justify-center",
            streak > 0 ? "bg-accent-violet/15" : "bg-muted",
          )}
        >
          <Flame
            className={cn(
              "h-5 w-5",
              streak >= 7
                ? "text-accent-violet"
                : streak > 0
                  ? "text-accent-violet/70"
                  : "text-muted-foreground",
            )}
          />
        </motion.div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold tabular-nums">{streak}</span>
            <span className="text-muted-foreground text-sm">day{streak !== 1 ? "s" : ""}</span>
          </div>
          <p className="text-muted-foreground text-xs">Best: {longestStreak}d</p>
        </div>
      </div>
      {showHint && (
        <p className="text-muted-foreground mt-2 text-xs">
          Log at least one meal every day to keep your streak going.
        </p>
      )}
    </div>
  );
}
