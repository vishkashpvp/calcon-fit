import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type CalorieTrackerProps = {
  consumed: number;
  goal: number;
};

export function CalorieTracker({ consumed, goal }: CalorieTrackerProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-2xl">Calorie Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm sm:text-base">
            <span>Calories Consumed</span>
            <span className="font-bold">
              {consumed} / {goal}
            </span>
          </div>
          <Progress value={(consumed / goal) * 100} />
          <div className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            {goal - consumed} calories remaining
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
