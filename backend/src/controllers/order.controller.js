const prisma = require("../lib/prisma");

function toOrderSummary(order) {
  return {
    id: order.id,
    status: order.status,
    createdAt: order.createdAt,
    customer: { name: order.user.name, phone: order.user.phone },
    product: { id: order.product.id, brand: order.product.brand, modelName: order.product.modelName, price: order.product.price },
  };
}

async function placeOrder(req, res) {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: "productId is required." });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ error: "Product not found." });

  const order = await prisma.order.create({
    data: { userId: req.user.id, productId },
    include: { user: true, product: true },
  });

  res.status(201).json(toOrderSummary(order));
}

async function getMyOrders(req, res) {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { user: true, product: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders.map(toOrderSummary));
}

async function getAllOrders(req, res) {
  const orders = await prisma.order.findMany({
    include: { user: true, product: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders.map(toOrderSummary));
}

async function markDelivered(req, res) {
  const existing = await prisma.order.findUnique({
    where: { id: req.params.id },
  });

  if (!existing) {
    return res.status(404).json({
      error: "Order not found.",
    });
  }

  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status: "DELIVERED" },
    include: { user: true, product: true },
  });

  res.json(toOrderSummary(order));
}

module.exports = { placeOrder, getMyOrders, getAllOrders, markDelivered };
