import { app } from "./app.js";
import { connectDatabase, closeDatabase } from "./db.js";

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

try {
  await connectDatabase();
} catch (error) {
  console.error("Application startup failed:", error.message);
  process.exit(1);
}

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Mini Shop is listening on port ${port}`);
});

server.on("error", async (error) => {
  console.error("Server failed to start:", error.message);

  try {
    await closeDatabase();
  } finally {
    process.exit(1);
  }
});

let shuttingDown = false;

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`${signal} received. Shutting down...`);

  const timeout = setTimeout(() => {
    console.error("Shutdown timed out");
    process.exit(1);
  }, 10000);

  timeout.unref();

  server.close(async (error) => {
    try {
      await closeDatabase();
      clearTimeout(timeout);
      process.exit(error ? 1 : 0);
    } catch {
      console.error("Failed to close database connection");
      process.exit(1);
    }
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));