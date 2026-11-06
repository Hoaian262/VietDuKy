// Local-storage backed demo stores. Swap these for server calls when a real
// backend (auth, orders, inventory, NFC verification) is connected.
import { useSyncExternalStore } from "react";
import {
  products as seedProducts, sampleOrders, sampleUnlocked, digitalCollectibles,
  FREE_SHIP_THRESHOLD, SHIPPING_FEE, type Product, type Order,
} from "./data";

function createStore<T>(key: string, initial: T) {
  let state = initial;
  let loaded = false;
  const listeners = new Set<() => void>();
  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = localStorage.getItem(key);
      if (raw) state = JSON.parse(raw);
    } catch { /* ignore */ }
  };
  const get = () => { load(); return state; };
  const set = (next: T | ((p: T) => T)) => {
    load();
    state = typeof next === "function" ? (next as (p: T) => T)(state) : next;
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* ignore */ }
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
  const use = () => useSyncExternalStore(subscribe, get, () => initial);
  return { get, set, use };
}

export interface CartItem { productId: string; qty: number; variant?: string | undefined }
export interface DemoUser { name: string; email: string; phone?: string }

export const cartStore = createStore<CartItem[]>("vdk-cart", []);
export const productStore = createStore<Product[]>("vdk-products-v2", seedProducts);
export const orderStore = createStore<Order[]>("vdk-orders", sampleOrders);
export const userStore = createStore<DemoUser | null>("vdk-user", null);
export const passportStore = createStore<Record<string, string>>("vdk-passport", sampleUnlocked);
export const wishlistStore = createStore<string[]>("vdk-wishlist", []);
export const newsletterStore = createStore<string[]>("vdk-newsletter", []);

export const useProducts = productStore.use;
export const useCart = cartStore.use;

export function cartQtyFor(productId: string, cart = cartStore.get()) {
  return cart.filter((c) => c.productId === productId).reduce((s, c) => s + c.qty, 0);
}

/** Adds to cart, capped at available stock. Returns quantity actually added. */
export function addToCart(productId: string, qty: number, variant?: string): number {
  const p = productStore.get().find((x) => x.id === productId);
  if (!p) return 0;
  const already = cartQtyFor(productId);
  const add = Math.max(0, Math.min(qty, p.stock - already));
  if (add === 0) return 0;
  cartStore.set((c) => {
    const i = c.findIndex((x) => x.productId === productId && x.variant === variant);
    if (i >= 0) return c.map((x, j) => (j === i ? { ...x, qty: x.qty + add } : x));
    return [...c, { productId, qty: add, variant }];
  });
  return add;
}

export function setCartQty(index: number, qty: number) {
  cartStore.set((c) => {
    const item = c[index];
    if (!item) return c;
    const p = productStore.get().find((x) => x.id === item.productId);
    const others = c.reduce((s, x, j) => (j !== index && x.productId === item.productId ? s + x.qty : s), 0);
    const max = Math.max(1, (p?.stock ?? 1) - others);
    return c.map((x, j) => (j === index ? { ...x, qty: Math.max(1, Math.min(qty, max)) } : x));
  });
}

export const shippingFor = (subtotal: number) => (subtotal === 0 || subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE);

export function placeDemoOrder(data: Omit<Order, "id" | "createdAt" | "status" | "demo">): Order {
  const order: Order = {
    ...data,
    id: `VDK-DEMO-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString().slice(0, 10),
    status: "pending",
    demo: true,
  };
  orderStore.set((o) => [order, ...o]);
  productStore.set((ps) => ps.map((p) => {
    const bought = data.items.filter((i) => i.productId === p.id).reduce((s, i) => s + i.qty, 0);
    return bought ? { ...p, stock: Math.max(0, p.stock - bought) } : p;
  }));
  cartStore.set([]);
  return order;
}

/** Prototype only: client-side lookup, NOT a real authenticity check. */
export function simulateVerify(id: string) {
  const c = digitalCollectibles.find((d) => d.id === id.trim().toUpperCase());
  if (!c) return null;
  return { collectible: c, product: productStore.get().find((p) => p.id === c.productId) };
}
