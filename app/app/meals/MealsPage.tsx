"use client";

import Widget from "./Widget";

// TODO: get data from api & remove me
const data = {
  breakfast: [{ name: "Oatmeal with Berries", calories: 320 }],
  lunch: [{ name: "Vegetable Salad", calories: 80 }],
  dinner: [{ name: "Protein Shake", calories: 150 }],
  snacks: [{ name: "Coffee with Milk", calories: 250 }],
  random: [{ name: "Chai", calories: 80 }],
};

export default function MealsPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center h-16 px-6 border-b">
        <h1 className="text-xl font-semibold">Meals</h1>
      </header>
      <main className="flex-1 p-6 overflow-auto">
        <div className="gap-5 columns-1 sm:columns-2 lg:columns-3 2xl:columns-5">
          {Object.entries(data).map(([mealType, items]) => (
            <Widget
              key={mealType}
              className="mb-5 break-inside-avoid"
              title={mealType}
              items={items}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
