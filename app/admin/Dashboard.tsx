"use client";

import { useState } from "react";

export default function Dashboard() {
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    sugar: "",
    isPlantBased: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const newFood = {
        name: form.name,
        calories: parseFloat(form.calories),
        protein: parseFloat(form.protein),
        carbs: parseFloat(form.carbs),
        fat: parseFloat(form.fat),
        fiber: parseFloat(form.fiber),
        sugar: parseFloat(form.sugar),
        isPlantBased: form.isPlantBased,
      };
      const res = await fetch("/api/admin/foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFood),
      });
      if (!res.ok) throw new Error("Failed to add food item");
      setForm({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        fiber: "",
        sugar: "",
        isPlantBased: true,
      });
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  return (
    <div className="max-w-xl p-4 mx-auto text-black bg-white dark:bg-black dark:text-white">
      <h1 className="mb-4 text-xl font-bold">Admin Dashboard</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-4">
        <div className="mb-2">
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            className="w-full px-2 py-1 text-black bg-white border border-black dark:bg-black dark:border-white dark:text-white"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Calories</label>
          <input
            type="number"
            name="calories"
            value={form.calories}
            onChange={handleInputChange}
            className="w-full px-2 py-1 text-black bg-white border border-black dark:bg-black dark:border-white dark:text-white"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Protein (g)</label>
          <input
            type="number"
            name="protein"
            value={form.protein}
            onChange={handleInputChange}
            className="w-full px-2 py-1 text-black bg-white border border-black dark:bg-black dark:border-white dark:text-white"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Carbs (g)</label>
          <input
            type="number"
            name="carbs"
            value={form.carbs}
            onChange={handleInputChange}
            className="w-full px-2 py-1 text-black bg-white border border-black dark:bg-black dark:border-white dark:text-white"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Fat (g)</label>
          <input
            type="number"
            name="fat"
            value={form.fat}
            onChange={handleInputChange}
            className="w-full px-2 py-1 text-black bg-white border border-black dark:bg-black dark:border-white dark:text-white"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Fiber (g)</label>
          <input
            type="number"
            name="fiber"
            value={form.fiber}
            onChange={handleInputChange}
            className="w-full px-2 py-1 text-black bg-white border border-black dark:bg-black dark:border-white dark:text-white"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Sugar (g)</label>
          <input
            type="number"
            name="sugar"
            value={form.sugar}
            onChange={handleInputChange}
            className="w-full px-2 py-1 text-black bg-white border border-black dark:bg-black dark:border-white dark:text-white"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">
            <input
              type="checkbox"
              name="isPlantBased"
              checked={form.isPlantBased}
              onChange={handleInputChange}
              className="mr-2"
            />
            Is Plant-Based
          </label>
        </div>
        <button
          type="submit"
          className="px-4 py-2 mt-2 text-white bg-black dark:bg-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-200">
          Add Food Item
        </button>
      </form>
    </div>
  );
}
