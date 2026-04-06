import { cn } from "@/lib/utils";

export interface PageModuleHeaderProps {
  /** Small uppercase label (e.g. module name, greeting) */
  category: string;
  /** Main heading */
  title: React.ReactNode;
  /** One-line description under the title */
  description?: string;
  /** Extra row between title and description (e.g. streak / level line) */
  meta?: React.ReactNode;
  /** Right side (buttons) */
  actions?: React.ReactNode;
  /** Optional avatar or icon before text block */
  leading?: React.ReactNode;
  className?: string;
  /** Layout: default stack; `row` for avatar + text like profile */
  variant?: "default" | "row";
  /** Center on small screens (e.g. profile hero) */
  align?: "start" | "center";
}

export function PageModuleHeader({
  category,
  title,
  description,
  meta,
  actions,
  leading,
  className,
  variant = "default",
  align = "start",
}: PageModuleHeaderProps) {
  const textBlock = (
    <div className="min-w-0 flex-1">
      <p className="text-muted-foreground text-xs font-medium tracking-[0.3em] uppercase sm:text-sm">
        {category}
      </p>
      <h1 className="mt-1 text-2xl font-black tracking-wide sm:text-3xl md:text-4xl">{title}</h1>
      {meta && <div className="text-foreground mt-2 text-sm tracking-wide">{meta}</div>}
      {description && (
        <p className="text-muted-foreground mt-2 text-[11px] font-medium tracking-[0.18em] uppercase">
          {description}
        </p>
      )}
    </div>
  );

  if (variant === "row") {
    const centered = align === "center";
    return (
      <div
        className={cn(
          "flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between",
          centered && "items-center text-center sm:items-start sm:text-left",
          className,
        )}
      >
        <div
          className={cn(
            "flex w-full min-w-0 flex-col gap-5 sm:flex-row sm:items-center",
            centered && "items-center sm:items-center",
          )}
        >
          {leading}
          {textBlock}
        </div>
        {actions && (
          <div className={cn("shrink-0 sm:pt-1", centered && "sm:self-start")}>{actions}</div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4">
        {leading}
        {textBlock}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
