const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { getSummary, getSalesByProduct, getSalesByBrand } = require("../controllers/sales.controller");

const router = express.Router();

// All sales/revenue reporting is admin-only — customers use /api/orders/me for their own history.
router.get("/summary", requireAuth, requireRole("ADMIN"), getSummary);
router.get("/by-product", requireAuth, requireRole("ADMIN"), getSalesByProduct);
router.get("/by-brand", requireAuth, requireRole("ADMIN"), getSalesByBrand);

module.exports = router;
