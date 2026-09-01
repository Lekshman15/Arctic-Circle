const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { listProducts, getProduct, createProduct } = require("../controllers/product.controller");

const router = express.Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", requireAuth, requireRole("ADMIN"), createProduct);

module.exports = router;
