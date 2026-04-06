"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { getLevelInfo } from "@/lib/gamification";
import { cn } from "@/lib/utils";

interface XpBarProps {
  xp: number;
  showHint?: boolean;
}

export function XpBar({ xp, showHint }: XpBarProps) {
  const info = getLevelInfo(xp);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-accent-violet/15 flex h-7 w-7 items-center justify-center">
            <Star className="text-accent-violet h-3.5 w-3.5" />
          </div>
          <div>
            <span className={cn("text-sm font-bold", info.color)}>Lv {info.level}</span>
            <span className="text-muted-foreground ml-1.5 text-xs">{info.name}</span>
          </div>
        </div>
        <span className="text-muted-foreground text-xs tabular-nums">
          {xp} / {info.xpForNextLevel} XP
        </span>
      </div>
      <div className="bg-bar-fill/8 relative h-2 overflow-hidden rounded-full">
        <motion.div
          className="bg-bar-fill/50 absolute inset-y-0 left-0 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${info.xpProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      {showHint && (
        <div className="border-accent-violet/40 bg-accent-violet/10 border-l-2 px-3 py-1.5">
          <p className="text-muted-foreground text-xs">
            Earn XP by logging meals, hitting calorie goals, and keeping streaks alive.
          </p>
        </div>
      )}
    </div>
  );
}
