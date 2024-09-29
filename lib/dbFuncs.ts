import { ObjectId } from "mongodb";
import { CONSTANTS } from "@config/constants";
import client from "./mongodb";

export async function getAccountByUser(userId: string) {
  try {
    const db = (await client.connect()).db();
    const account = await db
      .collection(CONSTANTS.MONGODB.COLLECTIONS.ACCOUNTS)
      .findOne({ userId: new ObjectId(userId) });
    return account;
  } catch (error) {
    console.error("Error retrieving accounts:", error);
    return null;
  }
}
