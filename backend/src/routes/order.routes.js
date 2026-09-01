const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { placeOrder, getMyOrders, getAllOrders, markDelivered } = require("../controllers/order.controller");

const router = express.Router();

router.post("/", requireAuth, placeOrder);
router.get("/me", requireAuth, getMyOrders);
router.get("/", requireAuth, requireRole("ADMIN"), getAllOrders);
router.patch("/:id/deliver", requireAuth, requireRole("ADMIN"), markDelivered);

module.exports = router;
