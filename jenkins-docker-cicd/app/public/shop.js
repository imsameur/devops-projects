import { calculateTotal } from "./cart.js";

const productGrid = document.querySelector("#products");
const productStatus = document.querySelector("#product-status");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");

const money = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT"
});

let products = [];
let cart = [];

const CART_STORAGE_KEY = "mini-shop-cart-v1";

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn("Cart could not be saved:", error);
  }
}

function restoreCart() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(CART_STORAGE_KEY) ?? "[]"
    );

    if (!Array.isArray(saved)) {
      return [];
    }

    const seen = new Set();

    return saved.filter((item) => {
      if (
        !item ||
        typeof item.id !== "string" ||
        !products.some((product) => product.id === item.id) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99 ||
        seen.has(item.id)
      ) {
        return false;
      }

      seen.add(item.id);
      return true;
    }).map((item) => ({
      id: item.id,
      quantity: item.quantity
    }));
  } catch (error) {
    console.warn("Saved cart could not be restored:", error);
    return [];
  }
}

function makeButton(text, label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = text;
  button.setAttribute("aria-label", label);
  button.addEventListener("click", onClick);
  return button;
}

function changeQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.quantity = Math.min(99, item.quantity + change);
  cart = cart.filter(item => item.quantity > 0);
  renderCart();
}

function addToCart(id) {
  const item = cart.find(item => item.id === id);

  if (item) {
    item.quantity = Math.min(99, item.quantity + 1);
  } else {
    cart.push({ id, quantity: 1 });
  }

  renderCart();
}

function renderCart() {
  saveCart();
  cartItems.replaceChildren();

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "Your cart is empty.";
    cartItems.append(empty);
  }

  for (const item of cart) {
    const product = products.find(p => p.id === item.id);
    const row = document.createElement("div");
    row.className = "cart-item";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const subtotal = document.createElement("p");
    subtotal.textContent =
      money.format(product.priceInPoisha * item.quantity / 100);

    const controls = document.createElement("div");
    controls.className = "cart-controls";

    const minus = makeButton(
      "−", `Decrease ${product.name} quantity`,
      () => changeQuantity(item.id, -1)
    );

    const quantity = document.createElement("span");
    quantity.textContent = String(item.quantity);
    quantity.setAttribute("aria-label", "Quantity");

    const plus = makeButton(
      "+", `Increase ${product.name} quantity`,
      () => changeQuantity(item.id, 1)
    );
    plus.disabled = item.quantity >= 99;

    const remove = makeButton(
      "Remove", `Remove ${product.name}`,
      () => {
        cart = cart.filter(entry => entry.id !== item.id);
        renderCart();
      }
    );
    remove.className = "remove-item";

    controls.append(minus, quantity, plus, remove);
    row.append(name, subtotal, controls);
    cartItems.append(row);
  }

  cartTotal.textContent =
    money.format(calculateTotal(cart, products) / 100);
}

async function loadProducts() {
  productStatus.textContent = "Loading products...";

  try {
    const response = await fetch("/api/products");

    if (!response.ok) {
      throw new Error(`Product API returned HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid product response");
    }

    products = data;
    cart = restoreCart();
    productGrid.replaceChildren();

    for (const product of products) {
      const card = document.createElement("article");
      card.className = "product-card";

      const name = document.createElement("h3");
      name.textContent = product.name;

      const description = document.createElement("p");
      description.className = "product-description";
      description.textContent = product.description;

      const price = document.createElement("strong");
      price.className = "product-price";
      price.textContent = money.format(product.priceInPoisha / 100);

      const button = makeButton(
        "Add to cart", `Add ${product.name} to cart`,
        () => addToCart(product.id)
      );
      button.className = "add-to-cart";

      card.append(name, description, price, button);
      productGrid.append(card);
    }

    productStatus.textContent = products.length
      ? `${products.length} products available`
      : "No products available.";

    renderCart();
  } catch (error) {
    productGrid.replaceChildren();
    productStatus.textContent =
      "Unable to load products. Please refresh and try again.";
    console.error("Product loading failed:", error);
  }
}

loadProducts();
