export type Product = {
  id: string;
  name: string;
  brand: string;
  category: "AC" | "Washing Machine" | "Refrigerator" | "Stabilizer";
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  tags: string[];
  capacity: string;
  energyRating: number; // 1-5 stars
  image: string; // gradient seed; rendered as CSS
  description: string;
  features: string[];
};

const img = (seed: string) => seed; // we render visuals via CSS, seed reserved

export const PRODUCTS: Product[] = [
  {
    id: "ac-split-1-5-inv-5s",
    name: "FrostLine 1.5 Ton 5-Star Inverter Split AC",
    brand: "Voltas",
    category: "AC",
    price: 38990,
    mrp: 52990,
    rating: 4.4,
    reviews: 1284,
    tags: ["Inverter", "Copper", "WiFi"],
    capacity: "1.5 Ton",
    energyRating: 5,
    image: img("ac-1"),
    description:
      "Inverter split AC engineered for Indian summers. 4-way swing, anti-dust filter, turbo cool, and a 100% copper condenser for long life.",
    features: [
      "1.5 Ton — ideal for 130–170 sq ft rooms",
      "5-Star BEE 2024 energy rating",
      "Inverter compressor, 10-year warranty",
      "Self-clean, anti-bacterial filter",
      "Wi-Fi enabled — works with Alexa",
    ],
  },
  {
    id: "ac-window-1-ton-3s",
    name: "ChillBox 1 Ton 3-Star Window AC",
    brand: "LG",
    category: "AC",
    price: 27490,
    mrp: 33990,
    rating: 4.2,
    reviews: 612,
    tags: ["Window", "Copper"],
    capacity: "1 Ton",
    energyRating: 3,
    image: img("ac-2"),
    description: "Compact window AC with high-density filter and dual-protection condenser.",
    features: ["1 Ton capacity", "3-Star energy rating", "Auto-restart", "Anti-corrosion coating"],
  },
  {
    id: "ac-split-2t-inv-5s",
    name: "PolarPro 2 Ton 5-Star Inverter Split AC",
    brand: "Daikin",
    category: "AC",
    price: 56990,
    mrp: 71990,
    rating: 4.6,
    reviews: 884,
    tags: ["Inverter", "Premium", "PM 2.5"],
    capacity: "2 Ton",
    energyRating: 5,
    image: img("ac-3"),
    description: "Premium 2 Ton inverter AC built for large rooms and harsh summers.",
    features: ["2 Ton — up to 220 sq ft", "PM 2.5 filtration", "Neo Swing compressor", "Coanda airflow"],
  },
  {
    id: "wm-front-7kg",
    name: "AquaSpin 7 kg Front-Load Washing Machine",
    brand: "Bosch",
    category: "Washing Machine",
    price: 32490,
    mrp: 41990,
    rating: 4.5,
    reviews: 920,
    tags: ["Front Load", "Inverter"],
    capacity: "7 kg",
    energyRating: 5,
    image: img("wm-1"),
    description: "Fully automatic front-load washer with VarioDrum and 15 wash programs.",
    features: ["7 kg drum, ideal for 4–5 people", "1400 RPM spin", "Allergy+ wash", "Child lock"],
  },
  {
    id: "wm-top-8kg",
    name: "TurboWash 8 kg Top-Load Fully Automatic",
    brand: "Samsung",
    category: "Washing Machine",
    price: 21990,
    mrp: 28990,
    rating: 4.3,
    reviews: 1450,
    tags: ["Top Load", "Diamond Drum"],
    capacity: "8 kg",
    energyRating: 4,
    image: img("wm-2"),
    description: "Top-load washer with Diamond Drum and Wobble pulsator for gentle care.",
    features: ["8 kg capacity", "Magic filter", "10 wash programs", "Eco-tub clean"],
  },
  {
    id: "fr-double-265",
    name: "ArcticFresh 265 L Double-Door Refrigerator",
    brand: "Whirlpool",
    category: "Refrigerator",
    price: 24490,
    mrp: 31990,
    rating: 4.4,
    reviews: 730,
    tags: ["Frost Free", "Convertible"],
    capacity: "265 L",
    energyRating: 3,
    image: img("fr-1"),
    description: "Frost-free double-door fridge with IntelliFresh and convertible freezer.",
    features: ["265 L — 3–4 member family", "Convertible modes", "Toughened glass shelves", "Stabilizer-free"],
  },
  {
    id: "fr-side-side-580",
    name: "PolarVault 580 L Side-by-Side Refrigerator",
    brand: "LG",
    category: "Refrigerator",
    price: 78990,
    mrp: 99990,
    rating: 4.6,
    reviews: 312,
    tags: ["Side-by-Side", "Inverter"],
    capacity: "580 L",
    energyRating: 4,
    image: img("fr-2"),
    description: "Spacious side-by-side fridge with linear inverter and DoorCooling+.",
    features: ["580 L — large families", "Linear inverter, 10-yr warranty", "Hygiene fresh+", "Smart diagnosis"],
  },
  {
    id: "fr-single-190",
    name: "MiniCool 190 L Single-Door Refrigerator",
    brand: "Haier",
    category: "Refrigerator",
    price: 13990,
    mrp: 17490,
    rating: 4.1,
    reviews: 540,
    tags: ["Single Door", "Direct Cool"],
    capacity: "190 L",
    energyRating: 4,
    image: img("fr-3"),
    description: "Compact single-door fridge perfect for bachelors and small kitchens.",
    features: ["190 L", "Toughened glass shelves", "Stabilizer-free up to 300V", "10-yr compressor warranty"],
  },
  {
    id: "st-ac-4kva",
    name: "VoltGuard 4 kVA AC Stabilizer (90V–290V)",
    brand: "V-Guard",
    category: "Stabilizer",
    price: 3290,
    mrp: 4490,
    rating: 4.5,
    reviews: 2100,
    tags: ["For AC up to 1.5T", "Wide Range"],
    capacity: "4 kVA",
    energyRating: 0,
    image: img("st-1"),
    description: "Wide-range voltage stabilizer designed for split & window ACs up to 1.5 Ton.",
    features: ["90V–290V working range", "Thermal overload protection", "Wall-mountable", "5-yr warranty"],
  },
  {
    id: "st-fridge-1kva",
    name: "SteadyPower 1 kVA Refrigerator Stabilizer",
    brand: "Microtek",
    category: "Stabilizer",
    price: 1490,
    mrp: 1990,
    rating: 4.3,
    reviews: 980,
    tags: ["For Fridge up to 300L"],
    capacity: "1 kVA",
    energyRating: 0,
    image: img("st-2"),
    description: "Compact stabilizer ideal for refrigerators up to 300 L.",
    features: ["140V–280V range", "Time-delay system", "LED indicators", "3-yr warranty"],
  },
];

export const CATEGORIES = ["AC", "Washing Machine", "Refrigerator", "Stabilizer"] as const;
export const BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();

export type Order = {
  id: string;
  customer: string;
  product: string;
  qty: number;
  total: number;
  status: "Placed" | "Packed" | "Out for delivery" | "Completed";
  placedAt: string;
};

export const ORDERS: Order[] = [
  { id: "AC-10241", customer: "Ravi Kumar", product: "FrostLine 1.5T 5S Inverter Split AC", qty: 1, total: 38990, status: "Out for delivery", placedAt: "2026-06-12" },
  { id: "AC-10240", customer: "Priya Shah", product: "AquaSpin 7 kg Front-Load", qty: 1, total: 32490, status: "Packed", placedAt: "2026-06-12" },
  { id: "AC-10239", customer: "Mohammed Irfan", product: "VoltGuard 4 kVA Stabilizer", qty: 2, total: 6580, status: "Placed", placedAt: "2026-06-11" },
  { id: "AC-10238", customer: "Sneha Reddy", product: "ArcticFresh 265 L Double-Door", qty: 1, total: 24490, status: "Completed", placedAt: "2026-06-09" },
  { id: "AC-10237", customer: "Arjun Mehta", product: "PolarPro 2T 5S Inverter Split", qty: 1, total: 56990, status: "Completed", placedAt: "2026-06-08" },
];

export type Ticket = {
  id: string;
  customer: string;
  phone: string;
  machine: "AC" | "Refrigerator" | "Washing Machine" | "Stabilizer";
  issue: string;
  status: "Open" | "Scheduled" | "In progress" | "Completed";
  raisedAt: string;
  address: string;
};

export const TICKETS: Ticket[] = [
  { id: "SR-2041", customer: "Anita Pillai", phone: "+91 98xxx 11234", machine: "AC", issue: "Cooling weak after monsoon — suspect gas leak.", status: "Scheduled", raisedAt: "2026-06-13", address: "Banjara Hills, Hyderabad" },
  { id: "SR-2040", customer: "Karthik N.", phone: "+91 90xxx 22987", machine: "Washing Machine", issue: "Drum not spinning, makes loud noise.", status: "In progress", raisedAt: "2026-06-12", address: "Madhapur, Hyderabad" },
  { id: "SR-2039", customer: "Lakshmi Devi", phone: "+91 95xxx 33012", machine: "Refrigerator", issue: "Freezer working but lower chamber not cooling.", status: "Open", raisedAt: "2026-06-12", address: "Kondapur, Hyderabad" },
  { id: "SR-2038", customer: "Rahul Verma", phone: "+91 88xxx 44321", machine: "Stabilizer", issue: "Output light flickering, AC trips.", status: "Completed", raisedAt: "2026-06-10", address: "Gachibowli, Hyderabad" },
];
