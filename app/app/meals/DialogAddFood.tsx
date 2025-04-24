"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import type { FoodItem } from "@/data/food-database";
import FoodSearchList, { FoodItem } from "./FoodSearchList";
import SelectedFoodView from "./SelectedFoodView";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface DialogAddFoodProps {
  onAddFood: (foodItem: FoodItem, quantity: number, mealType: MealType) => void;
  mealType: MealType;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  buttonClassName?: string;
}

export default function DialogAddFood({
  onAddFood,
  mealType,
  buttonVariant = "outline",
  buttonClassName = "w-full",
}: DialogAddFoodProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(100);
  const [open, setOpen] = useState(false);

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
          <FoodSearchList
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSelectFood={(food) => setSelectedFood(food)}
          />
        ) : (
          <SelectedFoodView
            selectedFood={selectedFood}
            quantity={quantity}
            setQuantity={setQuantity}
            onBack={() => setSelectedFood(null)}
            onConfirm={handleConfirmAdd}
            mealType={mealType}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
