import express from "express";
import { readFileSync, existsSync } from "node:fs";
import { getDatabase, checkDatabaseHealth } from "./db.js";

const products = JSON.parse(
  readFileSync(new URL("../data/products.json", import.meta.url), "utf8")
);

export const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));

app.get("/api/info", (req, res) => {
  res.json({
    app: process.env.SHOP_NAME ?? "Mini Shop",
    message: "Mini Shop backend is running"
  });
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/notes", async (req, res) => {
  const text = req.body?.text;

  if (
    typeof text !== "string" ||
    text.trim().length === 0 ||
    text.trim().length > 500
  ) {
    return res.status(400).json({
      error: "text must be a non-empty string of at most 500 characters"
    });
  }

  const note = {
    text: text.trim(),
    createdAt: new Date()
  };

  try {
    const result = await getDatabase()
      .collection("notes")
      .insertOne(note);

    return res.status(201).json({
      _id: result.insertedId,
      text: note.text,
      createdAt: note.createdAt
    });
  } catch {
    console.error("Failed to create note");

    return res.status(503).json({
      error: "Unable to save note. Please try again later."
    });
  }
});

app.get("/api/notes", async (req, res) => {
  res.set("Cache-Control", "no-store");

  try {
    const notes = await getDatabase()
      .collection("notes")
      .find({})
      .sort({ createdAt: -1, _id: -1 })
      .limit(100)
      .toArray();

    return res.json({ notes });
  } catch {
    console.error("Failed to list notes");

    return res.status(503).json({
      error: "Unable to load notes. Please try again later."
    });
  }
});

app.get("/health", async (req, res) => {
  const failureFile = process.env.HEALTH_FAILURE_FILE;
  const forcedFailure = Boolean(
    failureFile && existsSync(failureFile)
  );

  const databaseHealthy = await checkDatabaseHealth();
  const healthy = !forcedFailure && databaseHealthy;

  res.set("Cache-Control", "no-store");

  res.status(healthy ? 200 : 503).json({
    status: healthy ? "healthy" : "unhealthy",
    database: databaseHealthy ? "up" : "down"
  });
});

app.get("/version", (req, res) => {
  res.set("Cache-Control", "no-store");

  res.json({
    version: process.env.APP_VERSION ?? "1.0.0"
  });
});

app.use(
  express.static(new URL("../public/", import.meta.url).pathname)
);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON request body"
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      error: "Request body is too large"
    });
  }

  console.error("Unhandled request error");

  return res.status(500).json({
    error: "Internal server error"
  });
});