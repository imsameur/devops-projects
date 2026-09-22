export function calculateTotal(cart, products) {
  return cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.id);

    if (!product || !Number.isInteger(item.quantity) ||
        item.quantity < 1 || item.quantity > 99) {
      throw new Error("Invalid cart item");
    }

    return total + product.priceInPoisha * item.quantity;
  }, 0);
}
