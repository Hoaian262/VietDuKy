import { beforeEach, describe, expect, it } from "vitest";
import { addToCart, cartStore, productStore, shippingFor } from "./store";
import { products } from "./data";

describe("cart rules", () => {
  beforeEach(() => { localStorage.clear(); cartStore.set([]); productStore.set(products); });
  it("never exceeds available stock", () => {
    // p2 has 3 in stock
    expect(addToCart("p2", 5)).toBe(3);
    expect(addToCart("p2", 1)).toBe(0);
  });
  it("cannot add out-of-stock products", () => {
    expect(addToCart("p4", 1)).toBe(0);
  });
  it("ships free from 500.000 ₫, otherwise 30.000 ₫", () => {
    expect(shippingFor(499000)).toBe(30000);
    expect(shippingFor(500000)).toBe(0);
  });
});
