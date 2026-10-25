export const vnd = (n: number) => `${new Intl.NumberFormat("vi-VN").format(n)} ₫`;
export const discountPct = (price: number, original?: number) =>
  original && original > price ? Math.round((1 - price / original) * 100) : 0;
export const formatDate = (d: string) => new Date(d).toLocaleDateString("vi-VN");
