import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FoodItem } from "@/data/food-database";

interface FoodSearchListProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  foodItems: FoodItem[];
  onSelectFood: (food: FoodItem) => void;
}

export default function FoodSearchList({
  searchTerm,
  setSearchTerm,
  foodItems,
  onSelectFood,
}: FoodSearchListProps) {
  return (
    <div className="h-full mb-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search foods..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col h-full gap-3 pb-20 overflow-y-auto md:pb-0 md:max-h-96">
        {foodItems.length > 0 ? (
          foodItems.map((food) => (
            <Card key={food.id} className="flex items-center justify-between p-3 hover:bg-muted/50">
              <div>
                <div className="font-medium">{food.name}</div>
                <div className="text-sm text-muted-foreground">
                  {food.calories} cal | P: {food.macros.protein}g | C: {food.macros.carbs}g | F:{" "}
                  {food.macros.fat}g
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => onSelectFood(food)}>
                <Plus className="w-4 h-4" />
              </Button>
            </Card>
          ))
        ) : (
          <div className="p-3 text-center text-muted-foreground">No foods found</div>
        )}
      </div>
    </div>
  );
}
