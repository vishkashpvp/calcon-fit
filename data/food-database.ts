export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  macros: { protein: number; carbs: number; fat: number };
};

export const foodDatabase: FoodItem[] = [
  { id: "1", name: "Plant Protein", calories: 165, macros: { protein: 25, carbs: 3, fat: 1 } },
  { id: "2", name: "Brown Rice", calories: 112, macros: { protein: 2.6, carbs: 23, fat: 1 } },
  { id: "3", name: "Broccoli", calories: 34, macros: { protein: 2.8, carbs: 7, fat: 0.4 } },
  { id: "4", name: "Sweet Potato", calories: 86, macros: { protein: 1.6, carbs: 20, fat: 0.1 } },
  { id: "5", name: "Avocado", calories: 160, macros: { protein: 2, carbs: 8.5, fat: 14.7 } },
  { id: "6", name: "Greek Yogurt", calories: 59, macros: { protein: 10, carbs: 3.6, fat: 0.4 } },
  { id: "7", name: "Banana", calories: 89, macros: { protein: 1.1, carbs: 22.8, fat: 0.3 } },
  { id: "8", name: "Protein Shake", calories: 150, macros: { protein: 25, carbs: 3, fat: 2 } },
  { id: "9", name: "Almonds", calories: 579, macros: { protein: 21.2, carbs: 21.7, fat: 49.9 } },
  { id: "10", name: "Paneer", calories: 265, macros: { protein: 18, carbs: 1.2, fat: 20 } },
  { id: "11", name: "Tofu", calories: 144, macros: { protein: 15, carbs: 3, fat: 9 } },
  { id: "12", name: "Spinach", calories: 23, macros: { protein: 2.9, carbs: 3.6, fat: 0.4 } },
  { id: "13", name: "Chickpeas", calories: 164, macros: { protein: 8.9, carbs: 27.4, fat: 2.6 } },
  { id: "14", name: "Kidney Beans", calories: 127, macros: { protein: 8.7, carbs: 23, fat: 0.5 } },
  { id: "15", name: "Quinoa", calories: 120, macros: { protein: 4.1, carbs: 21.3, fat: 1.9 } },
  { id: "16", name: "Peanuts", calories: 567, macros: { protein: 25.8, carbs: 16.1, fat: 49.2 } },
  { id: "17", name: "Cottage Cheese", calories: 98, macros: { protein: 11, carbs: 3.4, fat: 4.3 } },
  { id: "18", name: "Mushrooms", calories: 22, macros: { protein: 3.1, carbs: 3.3, fat: 0.3 } },
  { id: "19", name: "Flaxseeds", calories: 534, macros: { protein: 18.3, carbs: 28.9, fat: 42.2 } },
  { id: "20", name: "Pumpkin Seeds", calories: 559, macros: { protein: 30, carbs: 10.7, fat: 49 } },
];
