import { AirVent, ShieldCheck, Zap } from "lucide-react";
import type { Product } from "@/lib/api";

// Product visuals are keyed off the catalog type. Stabilizers use a dedicated protection icon.
const gradFor = (t: Product["type"]) =>
  t === "STABILIZER"
    ? "linear-gradient(135deg, #e9f7ff 0%, #259cfa 100%)"
    : t === "WINDOW"
      ? "linear-gradient(135deg, #e6f0fa 0%, #145a94 100%)"
      : "linear-gradient(135deg, #cfeef2 0%, #012257 100%)";

const labelFor = (t: Product["type"]) =>
  t === "STABILIZER" ? "Stabilizer" : t === "WINDOW" ? "Window AC" : "Split AC";

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
        <div className="absolute inset-0 grid place-items-center text-white/90">
          {product.type === "STABILIZER" ? (
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className={size === "lg" ? "h-24 w-24" : size === "sm" ? "h-11 w-11" : "h-16 w-16"} strokeWidth={1.25} />
              <Zap className={size === "lg" ? "h-7 w-7" : size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
            </div>
          ) : (
            <AirVent className={size === "lg" ? "h-28 w-28" : size === "sm" ? "h-12 w-12" : "h-20 w-20"} strokeWidth={1.25} />
          )}
        </div>
      )}
      <div className="absolute left-3 top-3 whitespace-nowrap rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-medium text-foreground">
        {labelFor(product.type)}
      </div>
      {(product.starRating > 0 || product.type === "STABILIZER") && (
        <div className="absolute right-3 top-3 whitespace-nowrap rounded-full bg-deep/85 px-2 py-0.5 text-[10px] font-medium text-white">
          {product.type === "STABILIZER" ? "Protected" : `${product.starRating}★ Energy`}
        </div>
      )}
    </div>
  );
}