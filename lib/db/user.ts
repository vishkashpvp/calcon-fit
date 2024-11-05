import { ObjectId } from "mongodb";
import { getUsersCollection } from "@lib/mongodb";

type TempUserProfile = { currentWeight: number; targetWeight: number; height: number };

export const updateUserProfile = async (
  id: string,
  { currentWeight, targetWeight, height }: TempUserProfile
) => {
  const usersCollection = getUsersCollection();
  return usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { currentWeight, targetWeight, height } }
  );
};
