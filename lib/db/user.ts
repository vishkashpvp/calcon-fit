import { ObjectId } from "mongodb";
import { getUsersCollection } from "@lib/db/mongodb";
import { calculateDailyCalGoal } from "@utils/calc";

type TempUserProfile = { age: number; currentWeight: number; targetWeight: number; height: number };

export const updateUserProfile = async (
  id: string,
  { currentWeight, targetWeight, height, age }: TempUserProfile
) => {
  const usersCollection = getUsersCollection();
  const dailyCalGoal = calculateDailyCalGoal({ weight: currentWeight, height, age });
  return usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { currentWeight, targetWeight, height, age, dailyCalGoal } }
  );
};
