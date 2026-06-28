import { AirVent, Refrigerator, WashingMachine, Plug } from "lucide-react";
import type { Product } from "@/lib/mock-data";

const iconFor = (c: Product["category"]) => {
  switch (c) {
    case "AC": return AirVent;
    case "Refrigerator": return Refrigerator;
    case "Washing Machine": return WashingMachine;
    case "Stabilizer": return Plug;
  }
};

const gradFor = (c: Product["category"]) => {
  switch (c) {
    case "AC": return "linear-gradient(135deg, #cfeef2 0%, #5cbdb9 100%)";
    case "Refrigerator": return "linear-gradient(135deg, #e6f0fa 0%, #2d8a9e 100%)";
    case "Washing Machine": return "linear-gradient(135deg, #eaf2f8 0%, #1a4a6e 100%)";
    case "Stabilizer": return "linear-gradient(135deg, #f1f5f9 0%, #0c2340 100%)";
  }
};

export function ProductImage({ product, size = "md" }: { product: Product; size?: "sm" | "md" | "lg" }) {
  const Icon = iconFor(product.category);
  const dim = size === "lg" ? "h-72" : size === "sm" ? "h-32" : "h-48";
  return (
    <div
      className={`relative w-full ${dim} overflow-hidden rounded-lg`}
      style={{ background: gradFor(product.category) }}
    >
      <div className="absolute inset-0 grid place-items-center text-white/85">
        <Icon className={size === "lg" ? "h-28 w-28" : size === "sm" ? "h-12 w-12" : "h-20 w-20"} strokeWidth={1.25} />
      </div>
      <div className="absolute left-3 top-3 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-medium text-foreground">
        {product.category}
      </div>
      {product.energyRating > 0 && (
        <div className="absolute right-3 top-3 rounded-full bg-deep/85 px-2 py-0.5 text-[10px] font-medium text-white">
          {product.energyRating}★ Energy
        </div>
      )}
    </div>
  );
}
