"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FoodItem } from "@/data/food-database";
import { foodDatabase } from "@/data/food-database";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

type DialogAddFoodProps = {
  onAddFood: (foodItem: FoodItem, quantity: number, mealType: MealType) => void;
  mealType: MealType;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  buttonClassName?: string;
};

export default function DialogAddFood({
  onAddFood,
  mealType,
  buttonVariant = "outline",
  buttonClassName = "w-full",
}: DialogAddFoodProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<number>(100);
  const [open, setOpen] = useState(false);

  const filteredFoodItems = foodDatabase.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFood = (food: FoodItem) => {
    setSelectedFood(food);
  };

  const handleConfirmAdd = () => {
    if (selectedFood && quantity > 0) {
      onAddFood(selectedFood, quantity, mealType);
      setSelectedFood(null);
      setQuantity(100);
      setSearchTerm("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className={buttonClassName}>
          <Plus className="w-4 h-4 mr-2" /> Add Food
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col max-w-md min-w-full h-full md:h-[520px] md:min-w-[50%]">
        <DialogHeader>
          <DialogTitle className="text-start">Add food to {mealType}</DialogTitle>
        </DialogHeader>

        {!selectedFood ? (
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
              {filteredFoodItems.length > 0 ? (
                filteredFoodItems.map((food) => (
                  <Card
                    key={food.id}
                    className="flex items-center justify-between p-3 hover:bg-muted/50">
                    <div>
                      <div className="font-medium">{food.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {food.calories} cal | P: {food.macros.protein}g | C: {food.macros.carbs}g |
                        F: {food.macros.fat}g
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => handleAddFood(food)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </Card>
                ))
              ) : (
                <div className="p-3 text-center text-muted-foreground">No foods found</div>
              )}
            </div>
          </div>
        ) : (
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
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
              />
              <div className="text-sm text-muted-foreground">
                Estimated calories: {Math.round((selectedFood.calories * quantity) / 100)}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setSelectedFood(null)}>
                Back
              </Button>
              <Button onClick={handleConfirmAdd}>Add to {mealType}</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
