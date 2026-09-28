const databaseName = process.env.MONGODB_DB;
const username = process.env.MONGO_APP_USERNAME;
const password = process.env.MONGO_APP_PASSWORD;

if (!databaseName || !username || !password) {
  throw new Error("Missing application database configuration");
}

const appDatabase = db.getSiblingDB(databaseName);

appDatabase.createUser({
  user: username,
  pwd: password,
  roles: [
    {
      role: "readWrite",
      db: databaseName
    }
  ]
});

appDatabase.createCollection("notes");

appDatabase.notes.createIndex({
  createdAt: -1,
  _id: -1
});

print("Application database initialization completed");