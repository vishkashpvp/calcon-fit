"use client";

import { Search, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

export interface FoodItem {
  _id: string;
  name: string;
  calories: number;
  isPlantBased: boolean;
  macros: { protein: number; carbs: number; fat: number };
}

interface ApiResponse {
  total: number;
  page: number;
  limit: number;
  items: FoodItem[];
}

interface FoodSearchListProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  // onSelectFood: (food: FoodItem) => void;
  onSelectFood: (food: FoodItem | null) => void;
}

async function fetchFoods(searchTerm: string) {
  if (!searchTerm) return { items: [] };
  const res = await fetch(`/api/foods/list?name=${searchTerm}&page=1&limit=8`);
  if (!res.ok) throw new Error("Failed to fetch foods");
  return res.json();
}

export default function FoodSearchList({
  searchTerm,
  setSearchTerm,
  onSelectFood,
}: FoodSearchListProps) {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ["foods", debouncedSearchTerm],
    queryFn: () => fetchFoods(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm,
    staleTime: 1000 * 60 * 5,
  });

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
        {isLoading && <p className="text-center text-muted-foreground">Loading...</p>}
        {isError && <p className="text-center text-red-500">Failed to fetch foods</p>}

        {data?.items?.length
          ? data.items.map((food) => (
              <Card
                key={food._id}
                className="flex items-center justify-between p-3 hover:bg-muted/50">
                <div>
                  <div className="font-medium">{food.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {food.calories} cal
                    <div className="flex mt-1 text-xs gap-x-2">
                      <span>P: {food.macros.protein}g</span>
                      <span>C: {food.macros.carbs}g</span>
                      <span>F: {food.macros.fat}g</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => onSelectFood(food)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </Card>
            ))
          : !isLoading && <p className="text-center text-muted-foreground">No foods found</p>}
      </div>
    </div>
  );
}
