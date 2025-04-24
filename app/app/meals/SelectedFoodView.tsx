import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { FoodItem } from "@/data/food-database";
import { MealType } from "./DialogAddFood";
import { FoodItem } from "./FoodSearchList";

interface SelectedFoodViewProps {
  selectedFood: FoodItem;
  quantity: number;
  setQuantity: (value: number) => void;
  onBack: () => void;
  onConfirm: () => void;
  mealType: MealType;
}

export default function SelectedFoodView({
  selectedFood,
  quantity,
  setQuantity,
  onBack,
  onConfirm,
  mealType,
}: SelectedFoodViewProps) {
  return (
    <div className="h-full space-y-4">
      <div className="p-3 border rounded-md">
        <div className="font-medium">{selectedFood.name}</div>
        <div className="text-sm text-muted-foreground">
          {selectedFood.calories} cal per 100g | P: {selectedFood.macros.protein}g | C:{" "}
          {selectedFood.macros.carbs}g | F: {selectedFood.macros.fat}g
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity (grams)</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 0))}
        />
        <div className="text-sm text-muted-foreground">
          Estimated calories: {Math.round((selectedFood.calories * quantity) / 100)}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onConfirm}>Add to {mealType}</Button>
      </div>
    </div>
  );
}
