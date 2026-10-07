import express from "express";
import { readFileSync, existsSync } from "node:fs";

const products = JSON.parse(
  readFileSync(new URL("../data/products.json", import.meta.url), "utf8")
);

export const app = express();

app.disable("x-powered-by");

app.get("/api/info", (req, res) => {
  res.json({
    app: process.env.SHOP_NAME ?? "Mini Shop",
    message: "Mini Shop backend is running"
  });
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/health", (req, res) => {
  const failureFile = process.env.HEALTH_FAILURE_FILE;
  const unhealthy = Boolean(failureFile && existsSync(failureFile));

  res.set("Cache-Control", "no-store");
  res.status(unhealthy ? 503 : 200).json({
    status: unhealthy ? "unhealthy" : "healthy"
  });
});

app.get("/version", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({
    version: process.env.APP_VERSION ?? "1.0.0"
  });
});

app.use(express.static(
  new URL("../public/", import.meta.url).pathname
));
