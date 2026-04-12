export class Cart {
  constructor(defaultProductId) {
    this.item = {
      productId: defaultProductId,
      quantity: 1
    };
  }

  setQuantity(rawValue) {
    const next = Number(rawValue);
    const quantity = Number.isFinite(next) ? Math.round(next) : 1;
    this.item.quantity = Math.min(Math.max(quantity, 1), 10);
  }

  getSnapshot() {
    return { ...this.item };
  }
}
