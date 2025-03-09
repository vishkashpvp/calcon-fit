import type { Metadata } from "next";
import MealsPage from "./MealsPage";

export const metadata: Metadata = { title: "Meals", description: "Logged meals of the day" };

export default function Page() {
  return <MealsPage />;
}
