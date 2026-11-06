// Demonstration data for the Việt Du Ký prototype. All products, prices,
// stock and collectors are fictional sample data — not real inventory.
import motcot from "@/assets/p-motcot.jpg";
import hoian from "@/assets/u-hoian2.jpg";
import hue from "@/assets/u-hue2.jpg";
import mekong from "@/assets/u-caitang.jpg";
import saigon from "@/assets/u-benthanh.jpg";
import halong from "@/assets/u-halong2.jpg";
import hoguom from "@/assets/u-hoguom.jpg";
import vanmieu from "@/assets/u-vanmieu.jpg";
import sapa from "@/assets/u-sapa.jpg";
import caurong from "@/assets/u-caurong.jpg";
import myson from "@/assets/u-myson.jpg";
import camau from "@/assets/u-camau.jpg";

export type Region = "bac" | "trung" | "nam";
export const REGIONS: Record<Region, string> = { bac: "Ba Miền", trung: "Miền Trung", nam: "Miền Nam" };

export interface Collection {
  id: string;
  name: string;
  region: Region;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  collectionId: string;
  region: Region;
  price: number;
  originalPrice?: number | undefined;
  stock: number;
  image: string;
  gallery: string[];
  description: string;
  specs: Record<string, string>;
  variants?: string[] | undefined;
  nfc: boolean;
  featured: boolean;
  createdAt: string;
  storySlug?: string | undefined;
}

export interface Story {
  slug: string;
  title: string;
  region: Region;
  image: string;
  intro: string;
  background: string[];
  regionalContext: string;
  connection: string;
  productIds: string[];
}

export interface DigitalCollectible {
  id: string; // e.g. VDK-BAC-0001
  productId: string;
  serial: string;
}

export const collections: Collection[] = [
  { id: "thang-long", name: "Thăng Long Ký Ức", region: "bac", image: hoguom, description: "Kiến trúc nghìn năm và vịnh biển kỳ vĩ của đất Bắc." },
  { id: "co-do", name: "Cố Đô & Phố Hội", region: "trung", image: hoian, description: "Đèn lồng phố cổ và nét trang nghiêm chốn cung đình." },
  { id: "phuong-nam", name: "Sắc Màu Phương Nam", region: "nam", image: mekong, description: "Chợ nổi, sông nước và nhịp sống Sài Gòn rộn rã, mang đậm nét văn hóa miền Nam." },
];

export const products: Product[] = [
  {
    id: "p1", slug: "chua-mot-cot-tieu-tinh", name: "Chùa Một Cột – Tiểu Tịnh", collectionId: "thang-long", region: "bac",
    price: 450000, originalPrice: 520000, stock: 14, image: motcot, gallery: [motcot, halong],
    description: "Mô hình art toy lấy cảm hứng từ ngôi chùa hình đóa sen giữa lòng Hà Nội, đi kèm nhân vật Tiểu Tịnh cầm hoa sen trắng.",
    specs: { "Chất liệu": "Vinyl & nhựa resin", "Kích thước": "12 × 10 × 14 cm", "Phiên bản": "Tiêu chuẩn", "NFC": "Có thẻ NFC gắn đế" },
    variants: ["Tiêu chuẩn", "Phiên bản đêm"], nfc: true, featured: true, createdAt: "2026-09-01", storySlug: "doa-sen-giua-thang-long",
  },
  {
    id: "p2", slug: "ha-long-thuyen-buom", name: "Hạ Long – Thuyền Buồm Nâu", collectionId: "thang-long", region: "bac",
    price: 520000, stock: 3, image: halong, gallery: [halong, motcot],
    description: "Chiếc thuyền buồm nâu nhỏ xinh lướt giữa những đảo đá vôi, gợi nhớ chuyến du ngoạn trên vịnh.",
    specs: { "Chất liệu": "Vinyl", "Kích thước": "14 × 9 × 13 cm", "Phiên bản": "Giới hạn", "NFC": "Có thẻ NFC gắn đế" },
    nfc: true, featured: true, createdAt: "2026-10-05", storySlug: "canh-buom-tren-vinh",
  },
  {
    id: "p3", slug: "hoi-an-co-be-den-long", name: "Hội An – Cô Bé Đèn Lồng", collectionId: "co-do", region: "trung",
    price: 390000, stock: 22, image: hoian, gallery: [hoian, hue],
    description: "Cô bé áo dài vàng mang theo chùm đèn lồng rực rỡ, đứng trước một ngôi nhà cổ tường vàng.",
    specs: { "Chất liệu": "Vinyl", "Kích thước": "9 × 8 × 13 cm", "Phiên bản": "Tiêu chuẩn", "NFC": "Có thẻ NFC gắn đế" },
    variants: ["Áo vàng", "Áo xanh ngọc"], nfc: true, featured: true, createdAt: "2026-08-20", storySlug: "anh-den-pho-hoi",
  },
  {
    id: "p4", slug: "hue-cung-nu", name: "Huế – Cung Nữ Áo Tím", collectionId: "co-do", region: "trung",
    price: 480000, originalPrice: 560000, stock: 0, image: hue, gallery: [hue, hoian],
    description: "Nhân vật trong trang phục tím thêu họa tiết, đứng trước cổng thành mô phỏng phong cách cung đình.",
    specs: { "Chất liệu": "Vinyl & resin", "Kích thước": "11 × 9 × 14 cm", "Phiên bản": "Giới hạn", "NFC": "Có thẻ NFC gắn đế" },
    nfc: true, featured: true, createdAt: "2026-07-10", storySlug: "sac-tim-co-do",
  },
  {
    id: "p5", slug: "cho-noi-mien-tay", name: "Chợ Nổi – Ghe Trái Cây", collectionId: "phuong-nam", region: "nam",
    price: 360000, stock: 30, image: mekong, gallery: [mekong, saigon],
    description: "Cậu bé chèo ghe chở đầy trái cây miệt vườn, tái hiện không khí chợ nổi sông nước.",
    specs: { "Chất liệu": "Vinyl", "Kích thước": "13 × 9 × 11 cm", "Phiên bản": "Tiêu chuẩn", "NFC": "Có thẻ NFC gắn đế" },
    nfc: true, featured: true, createdAt: "2026-09-15", storySlug: "nhip-song-cho-noi",
  },
  {
    id: "p6", slug: "sai-gon-cho-ben-thanh", name: "Sài Gòn – Ly Cà Phê Sáng", collectionId: "phuong-nam", region: "nam",
    price: 420000, originalPrice: 470000, stock: 8, image: saigon, gallery: [saigon, mekong],
    description: "Nhân vật nhỏ cầm ly cà phê sữa đá trước tòa tháp đồng hồ của khu chợ trung tâm.",
    specs: { "Chất liệu": "Vinyl", "Kích thước": "14 × 8 × 12 cm", "Phiên bản": "Tiêu chuẩn", "NFC": "Có thẻ NFC gắn đế" },
    nfc: true, featured: true, createdAt: "2026-10-12", storySlug: "sang-sai-gon",
  },
  {
    id: "p7", slug: "blind-box-ba-mien", name: "Blind Box Ba Miền (hộp ngẫu nhiên)", collectionId: "thang-long", region: "bac",
    price: 250000, stock: 50, image: hoian, gallery: [hoian, motcot, mekong],
    description: "Hộp bí ẩn chứa ngẫu nhiên 1 trong 6 nhân vật mini thuộc ba miền. Mỗi hộp có thẻ NFC riêng.",
    specs: { "Chất liệu": "Vinyl", "Kích thước": "Mini 6 cm", "Phiên bản": "Ngẫu nhiên", "NFC": "Thẻ NFC trong hộp" },
    nfc: true, featured: false, createdAt: "2026-10-20",
  },
  {
    id: "p8", slug: "ho-guom-co-be-rua-vang", name: "Hồ Gươm – Cô Bé Rùa Vàng", collectionId: "thang-long", region: "bac",
    price: 420000, stock: 15, image: hoguom, gallery: [hoguom],
    description: "Cô bé nón lá áo dài đỏ ôm chú rùa nhỏ, phía sau là tháp giữa hồ và cành đào.",
    specs: { "Chất liệu": "Vinyl & acrylic", "Kích thước": "12 × 8 × 15 cm", "Phiên bản": "Tiêu chuẩn", "NFC": "Có thẻ NFC gắn đế" },
    nfc: true, featured: false, createdAt: "2026-10-25",
  },
  {
    id: "p9", slug: "van-mieu-cau-hoc-tro", name: "Văn Miếu – Cậu Học Trò", collectionId: "thang-long", region: "bac",
    price: 420000, stock: 12, image: vanmieu, gallery: [vanmieu],
    description: "Cậu học trò khăn xếp cầm cuốn sách, đứng trước cổng Văn Miếu cùng bia đá rùa.",
    specs: { "Chất liệu": "Vinyl & acrylic", "Kích thước": "12 × 8 × 15 cm", "Phiên bản": "Tiêu chuẩn", "NFC": "Có thẻ NFC gắn đế" },
    nfc: true, featured: false, createdAt: "2026-10-25",
  },
  {
    id: "p10", slug: "sa-pa-co-be-ruong-bac-thang", name: "Sa Pa – Cô Bé Ruộng Bậc Thang", collectionId: "thang-long", region: "bac",
    price: 420000, stock: 10, image: sapa, gallery: [sapa],
    description: "Cô bé trang phục thổ cẩm đeo gùi lúa giữa ruộng bậc thang mù sương.",
    specs: { "Chất liệu": "Vinyl & acrylic", "Kích thước": "12 × 8 × 15 cm", "Phiên bản": "Tiêu chuẩn", "NFC": "Có thẻ NFC gắn đế" },
    nfc: true, featured: false, createdAt: "2026-10-25",
  },
  {
    id: "p11", slug: "cau-rong-da-nang", name: "Đà Nẵng – Cậu Bé Cầu Rồng", collectionId: "co-do", region: "trung",
    price: 420000, stock: 18, image: caurong, gallery: [caurong],
    description: "Cậu bé áo xanh ôm chú rồng nhỏ, phía sau là cây cầu rồng vàng bên sông.",
    specs: { "Chất liệu": "Vinyl & acrylic", "Kích thước": "12 × 8 × 15 cm", "Phiên bản": "Tiêu chuẩn", "NFC": "Có thẻ NFC gắn đế" },
    nfc: true, featured: false, createdAt: "2026-10-25",
  },
  {
    id: "p12", slug: "my-son-vu-nu-thap-cham", name: "Mỹ Sơn – Vũ Nữ Tháp Chăm", collectionId: "co-do", region: "trung",
    price: 450000, stock: 6, image: myson, gallery: [myson],
    description: "Nhân vật đội mũ vàng trang phục cách điệu, đứng giữa quần thể tháp gạch cổ.",
    specs: { "Chất liệu": "Vinyl & acrylic", "Kích thước": "12 × 8 × 15 cm", "Phiên bản": "Tiêu chuẩn", "NFC": "Có thẻ NFC gắn đế" },
    nfc: true, featured: false, createdAt: "2026-10-25",
  },
  {
    id: "p13", slug: "mui-ca-mau-cuc-nam", name: "Mũi Cà Mau – Cô Bé Cực Nam", collectionId: "phuong-nam", region: "nam",
    price: 420000, stock: 20, image: camau, gallery: [camau],
    description: "Cô bé nón lá khăn rằn bên cột cờ và chiếc thuyền nhỏ nơi cực Nam Tổ quốc.",
    specs: { "Chất liệu": "Vinyl & acrylic", "Kích thước": "12 × 8 × 15 cm", "Phiên bản": "Tiêu chuẩn", "NFC": "Có thẻ NFC gắn đế" },
    nfc: true, featured: false, createdAt: "2026-10-25",
  },
];

export const stories: Story[] = [
  {
    slug: "doa-sen-giua-thang-long", title: "Đóa sen giữa Thăng Long", region: "bac", image: motcot,
    intro: "Ngôi chùa nhỏ dựng trên một cột đá, gợi hình bông sen vươn lên từ mặt hồ.",
    background: [
      "Chùa Một Cột là một trong những công trình biểu tượng của Hà Nội, thường được nhắc đến với hình dáng như đóa sen nở trên mặt nước.",
      "Theo nhiều tài liệu phổ biến, ngôi chùa gắn với thời Lý và đã trải qua nhiều lần trùng tu. Phần mô tả ở đây chỉ mang tính giới thiệu, bạn nên tham khảo thêm nguồn sử liệu chính thống.",
    ],
    regionalContext: "Miền Bắc lưu giữ nhiều kiến trúc tôn giáo cổ, nơi hoa sen thường xuất hiện như biểu tượng của sự thanh tịnh.",
    connection: "Nhân vật Tiểu Tịnh cầm hoa sen trắng được thiết kế như người kể chuyện nhỏ, mời bạn ghé thăm ngôi chùa.",
    productIds: ["p1", "p2"],
  },
  {
    slug: "canh-buom-tren-vinh", title: "Cánh buồm trên vịnh", region: "bac", image: halong,
    intro: "Những cánh buồm nâu giữa hàng nghìn đảo đá — một hình ảnh quen thuộc của vùng vịnh.",
    background: ["Vịnh Hạ Long nổi tiếng với hệ thống đảo đá vôi. Hình ảnh thuyền buồm nâu được chọn làm cảm hứng thiết kế, không mô phỏng chính xác một con thuyền cụ thể."],
    regionalContext: "Vùng duyên hải Đông Bắc gắn với đời sống biển và nghề chài lưới.",
    connection: "Thiết kế thuyền buồm thu nhỏ đặt trên đế sóng nước, kèm nhân vật đội nón lá ngắm vịnh.",
    productIds: ["p2", "p1"],
  },
  {
    slug: "anh-den-pho-hoi", title: "Ánh đèn phố Hội", region: "trung", image: hoian,
    intro: "Khi chiều buông, những chiếc đèn lồng thắp sáng các con phố cổ tường vàng.",
    background: ["Phố cổ Hội An được biết đến với những ngôi nhà cổ và đèn lồng nhiều màu sắc. Bộ sưu tập lấy cảm hứng từ không khí ấy, theo cách diễn giải sáng tạo của đội ngũ thiết kế."],
    regionalContext: "Miền Trung là nơi giao thoa của nhiều lớp văn hóa thương cảng.",
    connection: "Cô Bé Đèn Lồng mang theo năm chiếc đèn, mỗi màu tượng trưng cho một lời chúc trong câu chuyện của Việt Du Ký.",
    productIds: ["p3", "p4"],
  },
  {
    slug: "sac-tim-co-do", title: "Sắc tím cố đô", region: "trung", image: hue,
    intro: "Màu tím trầm mặc thường được nhắc tới như sắc màu đặc trưng của xứ Huế.",
    background: ["Huế từng là kinh đô và còn lưu giữ quần thể di tích cung đình. Trang phục nhân vật là thiết kế cách điệu, không phải bản sao trang phục lịch sử."],
    regionalContext: "Văn hóa Huế gắn với nhã nhạc, ẩm thực cung đình và kiến trúc thành quách.",
    connection: "Nhân vật Cung Nữ Áo Tím đứng trước cổng thành thu nhỏ, gợi nét trang nghiêm và dịu dàng.",
    productIds: ["p4", "p3"],
  },
  {
    slug: "nhip-song-cho-noi", title: "Nhịp sống chợ nổi", region: "nam", image: mekong,
    intro: "Ghe xuồng chở đầy trái cây, buôn bán ngay trên mặt sông từ tờ mờ sáng.",
    background: ["Chợ nổi là nét sinh hoạt quen thuộc của vùng đồng bằng sông nước miền Tây. Nhân vật được thiết kế để tôn vinh sự hiếu khách của người miệt vườn."],
    regionalContext: "Đồng bằng sông Cửu Long có mạng lưới kênh rạch dày đặc, gắn đời sống với sông nước.",
    connection: "Ghe Trái Cây là món đồ mở đầu cho dòng Sắc Màu Phương Nam.",
    productIds: ["p5", "p6"],
  },
  {
    slug: "sang-sai-gon", title: "Buổi sáng Sài Gòn", region: "nam", image: saigon,
    intro: "Một ly cà phê sữa đá, tiếng xe và nhịp phố bắt đầu ngày mới.",
    background: ["Khu chợ trung tâm với tháp đồng hồ là hình ảnh quen thuộc của Sài Gòn. Mô hình được giản lược theo phong cách art toy."],
    regionalContext: "Sài Gòn năng động, cởi mở, nơi văn hóa cà phê vỉa hè trở thành một phần đời sống.",
    connection: "Nhân vật cầm ly cà phê là lời chào buổi sáng của Việt Du Ký gửi tới những người con phương Nam.",
    productIds: ["p6", "p5"],
  },
];

// Demonstration collectible IDs that can be "verified" in the NFC simulation.
export const digitalCollectibles: DigitalCollectible[] = [
  { id: "VDK-BAC-0001", productId: "p1", serial: "#0001/1000" },
  { id: "VDK-BAC-0002", productId: "p2", serial: "#0042/500" },
  { id: "VDK-TRU-0001", productId: "p3", serial: "#0107/1000" },
  { id: "VDK-TRU-0002", productId: "p4", serial: "#0019/500" },
  { id: "VDK-NAM-0001", productId: "p5", serial: "#0233/1000" },
  { id: "VDK-NAM-0002", productId: "p6", serial: "#0088/1000" },
];

// Sample collector initially owns two collectibles.
export const sampleUnlocked: Record<string, string> = {
  "VDK-BAC-0001": "2026-09-12",
  "VDK-NAM-0001": "2026-10-03",
};

export interface OrderItem { productId: string; name: string; price: number; qty: number; variant?: string | undefined; image: string }
export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
export const ORDER_STATUS: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận", confirmed: "Đã xác nhận", shipping: "Đang giao", delivered: "Đã giao", cancelled: "Đã hủy",
};
export interface Order {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; email: string; address: string; city: string; district: string; ward: string; note?: string | undefined };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: "cod" | "bank";
  status: OrderStatus;
  demo: true;
}

const P = (i: number) => products[i]!;
const sc = (n: string) => ({ name: n, phone: "09xx xxx xxx", email: "mau@vidu.vn", address: "Địa chỉ mẫu", city: "TP. Hồ Chí Minh", district: "Quận mẫu", ward: "Phường mẫu" });
export const sampleOrders: Order[] = [
  { id: "VDK-DEMO-1001", createdAt: "2026-10-02", customer: sc("Khách mẫu A"), items: [{ productId: "p1", name: P(0).name, price: 450000, qty: 1, image: motcot }], subtotal: 450000, shipping: 30000, total: 480000, payment: "cod", status: "delivered", demo: true },
  { id: "VDK-DEMO-1002", createdAt: "2026-10-09", customer: sc("Khách mẫu B"), items: [{ productId: "p5", name: P(4).name, price: 360000, qty: 2, image: mekong }], subtotal: 720000, shipping: 0, total: 720000, payment: "bank", status: "shipping", demo: true },
  { id: "VDK-DEMO-1003", createdAt: "2026-10-16", customer: sc("Khách mẫu C"), items: [{ productId: "p3", name: P(2).name, price: 390000, qty: 1, image: hoian }, { productId: "p7", name: P(6).name, price: 250000, qty: 3, image: hoian }], subtotal: 1140000, shipping: 0, total: 1140000, payment: "cod", status: "confirmed", demo: true },
  { id: "VDK-DEMO-1004", createdAt: "2026-10-22", customer: sc("Khách mẫu D"), items: [{ productId: "p6", name: P(5).name, price: 420000, qty: 1, image: saigon }], subtotal: 420000, shipping: 30000, total: 450000, payment: "cod", status: "pending", demo: true },
];

export const FREE_SHIP_THRESHOLD = 500000;
export const SHIPPING_FEE = 30000;
export const LOW_STOCK = 5;
