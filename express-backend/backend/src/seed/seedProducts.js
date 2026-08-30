require("dotenv").config();
const prisma = require("../lib/prisma");

// Sample AC catalog so the storefront isn't empty on first run.
// Add more via POST /api/products (admin only) once the app is live.
const PRODUCTS = [
  { brand: "Voltas", modelName: "FrostLine 5-Star Inverter Split AC", tonnage: 1.5, starRating: 5, type: "SPLIT", price: 38990 },
  { brand: "LG", modelName: "ChillBox 3-Star Window AC", tonnage: 1.0, starRating: 3, type: "WINDOW", price: 27490 },
  { brand: "Daikin", modelName: "PolarPro 5-Star Inverter Split AC", tonnage: 2.0, starRating: 5, type: "SPLIT", price: 56990 },
  { brand: "Samsung", modelName: "WindFree 4-Star Inverter Split AC", tonnage: 1.5, starRating: 4, type: "SPLIT", price: 41990 },
  { brand: "Haier", modelName: "CoolSecure 2-Star Window AC", tonnage: 1.5, starRating: 2, type: "WINDOW", price: 29990 },
  { brand: "Hitachi", modelName: "Kaze Plus 5-Star Inverter Split AC", tonnage: 1.0, starRating: 5, type: "SPLIT", price: 34990 },
];

async function main() {
  for (const p of PRODUCTS) {
    const existing = await prisma.product.findFirst({ where: { brand: p.brand, modelName: p.modelName } });
    if (existing) {
      console.log(`Skipping (already exists): ${p.brand} ${p.modelName}`);
      continue;
    }
    await prisma.product.create({ data: p });
    console.log(`Created: ${p.brand} ${p.modelName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
