require("dotenv").config();
const prisma = require("../lib/prisma");

// Demo catalog for Arctic Circle: ACs from the brands supplied by the business,
// plus sample stabilizers from Vortex and V-Guard. AC tonnage ranges from
// 0.5 to 3 tons; higher tonnage is represented with a higher sample price.
const PRODUCTS = [
  { brand: "O-General", modelName: "Inverter Split AC 0.5 Ton", tonnage: 0.5, starRating: 3, type: "SPLIT", price: 29990 },
  { brand: "O-General", modelName: "Inverter Split AC 1.5 Ton", tonnage: 1.5, starRating: 5, type: "SPLIT", price: 45990 },
  { brand: "Mitsubishi Electric", modelName: "Inverter Split AC 1 Ton", tonnage: 1, starRating: 5, type: "SPLIT", price: 41990 },
  { brand: "Mitsubishi Electric", modelName: "Inverter Split AC 2 Ton", tonnage: 2, starRating: 5, type: "SPLIT", price: 64990 },
  { brand: "Daikin", modelName: "Inverter Split AC 1.5 Ton", tonnage: 1.5, starRating: 5, type: "SPLIT", price: 48990 },
  { brand: "Daikin", modelName: "Window AC 1 Ton", tonnage: 1, starRating: 3, type: "WINDOW", price: 32990 },
  { brand: "Voltas", modelName: "Inverter Split AC 1.5 Ton", tonnage: 1.5, starRating: 5, type: "SPLIT", price: 38990 },
  { brand: "Voltas", modelName: "Window AC 1 Ton", tonnage: 1, starRating: 3, type: "WINDOW", price: 27990 },
  { brand: "Carrier", modelName: "Inverter Split AC 2 Ton", tonnage: 2, starRating: 5, type: "SPLIT", price: 57990 },
  { brand: "Carrier", modelName: "Window AC 1.5 Ton", tonnage: 1.5, starRating: 3, type: "WINDOW", price: 33990 },
  { brand: "Blue Star", modelName: "Inverter Split AC 1 Ton", tonnage: 1, starRating: 5, type: "SPLIT", price: 36990 },
  { brand: "Blue Star", modelName: "Window AC 1.5 Ton", tonnage: 1.5, starRating: 3, type: "WINDOW", price: 34990 },
  { brand: "Panasonic", modelName: "Inverter Split AC 2.5 Ton", tonnage: 2.5, starRating: 5, type: "SPLIT", price: 69990 },
  { brand: "Panasonic", modelName: "Window AC 1 Ton", tonnage: 1, starRating: 3, type: "WINDOW", price: 29990 },
  { brand: "Hitachi", modelName: "Inverter Split AC 3 Ton", tonnage: 3, starRating: 5, type: "SPLIT", price: 79990 },
  { brand: "Hitachi", modelName: "Window AC 1.5 Ton", tonnage: 1.5, starRating: 3, type: "WINDOW", price: 36990 },

  { brand: "Vortex", modelName: "Digital AC Voltage Stabilizer 1.5 Ton", tonnage: 0, starRating: 0, type: "STABILIZER", price: 3490 },
  { brand: "Vortex", modelName: "Digital AC Voltage Stabilizer 2 Ton", tonnage: 0, starRating: 0, type: "STABILIZER", price: 4290 },
  { brand: "V-Guard", modelName: "AC Voltage Stabilizer 1.5 Ton", tonnage: 0, starRating: 0, type: "STABILIZER", price: 3190 },
  { brand: "V-Guard", modelName: "AC Voltage Stabilizer 2 Ton", tonnage: 0, starRating: 0, type: "STABILIZER", price: 3990 },
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
