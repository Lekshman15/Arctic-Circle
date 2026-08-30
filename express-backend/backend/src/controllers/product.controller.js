const prisma = require("../lib/prisma");

// Requirements.docx sort options
const SORTERS = {
  "cost-asc": { price: "asc" },
  "cost-desc": { price: "desc" },
  "rating-desc": { starRating: "desc" },
  tonnage: { tonnage: "asc" },
  brand: { brand: "asc" },
};

async function listProducts(req, res) {
  const { brand, type, sort } = req.query;

  const where = {};
  if (brand) where.brand = { equals: brand, mode: "insensitive" };
  if (type) where.type = type.toUpperCase();

  const orderBy = SORTERS[sort] || { createdAt: "desc" };

  const products = await prisma.product.findMany({ where, orderBy });
  res.json(products);
}

async function getProduct(req, res) {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ error: "Product not found." });
  res.json(product);
}

async function createProduct(req, res) {
  const { brand, modelName, tonnage, starRating, type, price, imageUrl } = req.body;
  if (!brand || !modelName || !tonnage || !starRating || !type || !price) {
    return res.status(400).json({ error: "brand, modelName, tonnage, starRating, type and price are required." });
  }

  const product = await prisma.product.create({
    data: {
      brand,
      modelName,
      tonnage,
      starRating,
      type: type.toUpperCase(),
      price,
      imageUrl,
    },
  });
  res.status(201).json(product);
}

module.exports = { listProducts, getProduct, createProduct };
