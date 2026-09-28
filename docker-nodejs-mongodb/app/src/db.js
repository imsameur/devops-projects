import { MongoClient } from "mongodb";
import { setTimeout as delay } from "node:timers/promises";

let client;
let database;

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB;

  if (!uri || !databaseName) {
    throw new Error("MONGODB_URI and MONGODB_DB are required");
  }

  const maxAttempts = 10;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const candidate = new MongoClient(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      socketTimeoutMS: 5000,
      maxPoolSize: 10
    });

    try {
      await candidate.connect();

      const db = candidate.db(databaseName);
      await db.command({ ping: 1 });

      client = candidate;
      database = db;

      console.log("MongoDB connection established");
      return;
    } catch {
      await candidate.close();

      console.error(
        `MongoDB connection attempt ${attempt}/${maxAttempts} failed`
      );

      if (attempt === maxAttempts) {
        throw new Error("MongoDB connection failed after all retries");
      }

      await delay(3000);
    }
  }
}

export function getDatabase() {
  if (!database) {
    throw new Error("Database connection is not initialized");
  }

  return database;
}

export async function checkDatabaseHealth() {
  try {
    await getDatabase().command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

export async function closeDatabase() {
  if (client) {
    await client.close();
  }

  client = undefined;
  database = undefined;
}