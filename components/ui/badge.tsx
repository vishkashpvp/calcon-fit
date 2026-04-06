import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-primary/25 bg-primary text-primary-foreground shadow-sm dark:border-primary/35",
        secondary:
          "border border-border/80 bg-secondary text-secondary-foreground shadow-sm dark:border-white/12",
        destructive:
          "border border-destructive/30 bg-destructive text-destructive-foreground shadow-sm",
        outline:
          "border border-border bg-background/80 text-foreground shadow-sm dark:border-white/12 dark:bg-white/5",
        neon: "border border-foreground/25 bg-foreground/5 text-foreground shadow-sm dark:border-white/15",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
