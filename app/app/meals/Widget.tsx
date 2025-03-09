import React from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { MealType } from "./DialogAddFood";
import DialogAddFood from "./DialogAddFood";

interface MealItem {
  name: string;
  calories: number;
}

interface MealCardProps {
  title: string;
  items: MealItem[];
  className?: React.HtmlHTMLAttributes<HTMLDivElement>["className"];
}

export default function Widget({ title, items, className }: MealCardProps) {
  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);

  return (
    <Card key={title} className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          {title}
          <span className="text-sm font-semibold">{totalCalories} cals</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground">No meals logged yet</div>
          ) : (
            items.map((item, index) => (
              <div key={`${title}-${item.name}-${index}`} className="flex justify-between">
                <span>{item.name}</span>
                <span>{item.calories} cals</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <DialogAddFood
          mealType={title as MealType}
          onAddFood={(data, quantity, mealType) => {
            console.log("meal added", data);
            const calories = Math.round((data.calories * quantity) / 100);
            console.log(`${mealType} -> ${quantity}g ${data.name} -> ${calories} calories`);
          }}
        />
      </CardFooter>
    </Card>
  );
}
