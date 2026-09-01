const prisma = require("../lib/prisma");

// Requirements.docx sort options
const ALLOWED_AC_BRANDS = ["O-General", "Mitsubishi Electric", "Daikin", "Voltas", "Carrier", "Blue Star", "Panasonic", "Hitachi"];
const ALLOWED_STABILIZER_BRANDS = ["Vortex", "V-Guard"];
const ALLOWED_BRANDS = [...ALLOWED_AC_BRANDS, ...ALLOWED_STABILIZER_BRANDS];

const SORTERS = {
  "cost-asc": { price: "asc" },
  "cost-desc": { price: "desc" },
  "rating-desc": { starRating: "desc" },
  tonnage: { tonnage: "asc" },
  "tonnage-asc": { tonnage: "asc" },
  "tonnage-desc": { tonnage: "desc" },
  brand: { brand: "asc" },
};

async function listProducts(req, res) {
  const { brand, type, sort } = req.query;

  const where = { brand: { in: ALLOWED_BRANDS } };
  if (brand) where.brand = { equals: brand, mode: "insensitive" };
  if (type) where.type = type.toUpperCase();

  const orderBy = SORTERS[sort] || { createdAt: "desc" };

  const products = await prisma.product.findMany({ where, orderBy });
  res.json(products);
}

async function getProduct(req, res) {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product || !ALLOWED_BRANDS.includes(product.brand)) return res.status(404).json({ error: "Product not found." });
  res.json(product);
}

async function createProduct(req, res) {
  const { brand, modelName, tonnage, starRating, type, price, imageUrl } = req.body;
  const normalizedType = String(type || "").toUpperCase();
  if (!brand || !modelName || !type || price == null || !["SPLIT", "WINDOW", "STABILIZER"].includes(normalizedType)) {
    return res.status(400).json({ error: "brand, modelName, type and price are required. Type must be SPLIT, WINDOW or STABILIZER." });
  }
  if (!ALLOWED_BRANDS.some((allowed) => allowed.toLowerCase() === String(brand).toLowerCase())) {
    return res.status(400).json({ error: "Brand is not part of the Arctic Circle catalog." });
  }

  const normalizedTonnage = normalizedType === "STABILIZER" ? 0 : Number(tonnage);
  const normalizedStarRating = normalizedType === "STABILIZER" ? 0 : Number(starRating);

  if (normalizedType !== "STABILIZER" && (![0.5, 1, 1.5, 2, 2.5, 3].includes(normalizedTonnage) || !normalizedStarRating)) {
    return res.status(400).json({ error: "AC tonnage must be one of 0.5, 1, 1.5, 2, 2.5 or 3 tons and star rating is required." });
  }

  const product = await prisma.product.create({
    data: {
      brand,
      modelName,
      tonnage: normalizedTonnage,
      starRating: normalizedStarRating,
      type: normalizedType,
      price: Number(price),
      imageUrl,
    },
  });
  res.status(201).json(product);
}

module.exports = { listProducts, getProduct, createProduct };
