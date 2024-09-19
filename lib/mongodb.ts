import { MongoClient } from "mongodb";
import { getMongoDbUri } from "@utils/env";

const uri = getMongoDbUri();
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (!clientPromise) {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
