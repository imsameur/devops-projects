import test from "node:test";
import assert from "node:assert/strict";
import { calculateTotal } from "../public/cart.js";

const products = [
  { id: "p001", priceInPoisha: 85000 },
  { id: "p002", priceInPoisha: 350000 }
];

test("two mice and one keyboard total 5200 BDT", () => {
  const cart = [
    { id: "p001", quantity: 2 },
    { id: "p002", quantity: 1 }
  ];

  assert.equal(calculateTotal(cart, products), 520000);
});

test("empty cart totals zero", () => {
  assert.equal(calculateTotal([], products), 0);
});

test("unknown product is rejected", () => {
  assert.throws(
    () => calculateTotal([{ id: "unknown", quantity: 1 }], products),
    /Invalid cart item/
  );
});

test("invalid quantities are rejected", () => {
  for (const quantity of [0, -1, 1.5, 100, "2"]) {
    assert.throws(
      () => calculateTotal([{ id: "p001", quantity }], products),
      /Invalid cart item/
    );
  }
});
