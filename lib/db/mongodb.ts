import { MongoClient, ServerApiVersion } from "mongodb";
import { CONSTANTS } from "@config/constants";
import { getMongoDbUri } from "@utils/env";

const uri = getMongoDbUri();
const options = {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & { _mongoClient?: MongoClient };
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri, options);
}

const getCollection = (name: string) => {
  return client.db(CONSTANTS.MONGODB.DATABASES.CALCONFIT).collection(name);
};

export const getUsersCollection = () => getCollection(CONSTANTS.MONGODB.COLLECTIONS.USERS);
export const getAccountsCollection = () => getCollection(CONSTANTS.MONGODB.COLLECTIONS.ACCOUNTS);
export const getConfigurationsCollection = () =>
  getCollection(CONSTANTS.MONGODB.COLLECTIONS.CONFIGURATIONS);
export const getNutritionInfoCollection = () =>
  getCollection(CONSTANTS.MONGODB.COLLECTIONS.NUTRITION_INFO);
export const getMealLogsCollection = () => getCollection(CONSTANTS.MONGODB.COLLECTIONS.MEAL_LOGS);

export default client;
