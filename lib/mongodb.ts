import { MongoClient, ServerApiVersion } from "mongodb";
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

export default client;
