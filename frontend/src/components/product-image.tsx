import { AirVent } from "lucide-react";
import type { Product } from "@/lib/api";

// The backend only sells air conditioners (Split / Window), so the visual
// treatment is keyed off `type` instead of the old multi-category system.
const gradFor = (t: Product["type"]) =>
  t === "WINDOW"
    ? "linear-gradient(135deg, #e6f0fa 0%, #2d8a9e 100%)"
    : "linear-gradient(135deg, #cfeef2 0%, #5cbdb9 100%)";

const labelFor = (t: Product["type"]) => (t === "WINDOW" ? "Window AC" : "Split AC");

export function ProductImage({ product, size = "md" }: { product: Product; size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "h-72" : size === "sm" ? "h-32" : "h-48";
  return (
    <div
      className={`relative w-full ${dim} overflow-hidden rounded-lg`}
      style={{ background: gradFor(product.type) }}
    >
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={`${product.brand} ${product.modelName}`} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-white/85">
          <AirVent className={size === "lg" ? "h-28 w-28" : size === "sm" ? "h-12 w-12" : "h-20 w-20"} strokeWidth={1.25} />
        </div>
      )}
      <div className="absolute left-3 top-3 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-medium text-foreground">
        {labelFor(product.type)}
      </div>
      {product.starRating > 0 && (
        <div className="absolute right-3 top-3 rounded-full bg-deep/85 px-2 py-0.5 text-[10px] font-medium text-white">
          {product.starRating}★ Energy
        </div>
      )}
    </div>
  );
}
