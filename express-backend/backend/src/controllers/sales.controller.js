const prisma = require("../lib/prisma");

// Sales figures are derived from Orders (an Order = a completed checkout),
// not from the Product catalog — that's what /api/products is for.
// Optional ?from=&to= (ISO dates) narrow everything below to a date range.

function dateRangeWhere(query) {
  const { from, to } = query;
  if (!from && !to) return {};
  const createdAt = {};
  if (from) createdAt.gte = new Date(from);
  if (to) createdAt.lte = new Date(to);
  return { createdAt };
}

async function getSummary(req, res) {
  const where = dateRangeWhere(req.query);
  const orders = await prisma.order.findMany({ where, include: { product: true } });

  const totalSales = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.product.price, 0);
  const byStatus = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  res.json({ totalSales, totalRevenue, byStatus });
}

async function getSalesByProduct(req, res) {
  const where = dateRangeWhere(req.query);
  const orders = await prisma.order.findMany({ where, include: { product: true } });

  const byProduct = new Map();
  for (const o of orders) {
    const key = o.product.id;
    if (!byProduct.has(key)) {
      byProduct.set(key, {
        productId: o.product.id,
        brand: o.product.brand,
        modelName: o.product.modelName,
        unitsSold: 0,
        revenue: 0,
      });
    }
    const entry = byProduct.get(key);
    entry.unitsSold += 1;
    entry.revenue += o.product.price;
  }

  const result = [...byProduct.values()].sort((a, b) => b.revenue - a.revenue);
  res.json(result);
}

async function getSalesByBrand(req, res) {
  const where = dateRangeWhere(req.query);
  const orders = await prisma.order.findMany({ where, include: { product: true } });

  const byBrand = new Map();
  for (const o of orders) {
    const key = o.product.brand;
    if (!byBrand.has(key)) byBrand.set(key, { brand: key, unitsSold: 0, revenue: 0 });
    const entry = byBrand.get(key);
    entry.unitsSold += 1;
    entry.revenue += o.product.price;
  }

  const result = [...byBrand.values()].sort((a, b) => b.revenue - a.revenue);
  res.json(result);
}

module.exports = { getSummary, getSalesByProduct, getSalesByBrand };
