import { Angry, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type TrackerProps = {
  label: string;
  consumed: number;
  goal: number;
  unit?: string;
  Icon: LucideIcon;
};

export function Tracker({ label, consumed, goal, unit, Icon }: TrackerProps) {
  const remaining = goal - consumed;
  const progress = Math.min((consumed / goal) * 100, 100);
  const isOverConsumed = consumed >= goal;

  return (
    <Card className="relative h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl">
          {label}
          {isOverConsumed ? (
            <Angry className="w-5 h-5 text-red-500" />
          ) : (
            <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm sm:text-base">
            <span>consumed</span>
            <span className="font-bold">
              {consumed}
              {unit && unit} / {goal}
              {unit && unit}
            </span>
          </div>
          <Progress value={progress} className={cn(isOverConsumed && "[&>*]:bg-red-600")} />
          <div className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            {remaining}
            {unit && unit} remaining
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
