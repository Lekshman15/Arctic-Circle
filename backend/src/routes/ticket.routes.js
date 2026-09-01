const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  raiseTicket,
  getMyTickets,
  getAllTickets,
  completeTicket,
  submitFeedback,
} = require("../controllers/ticket.controller");

const router = express.Router();

router.post("/", requireAuth, raiseTicket);
router.get("/me", requireAuth, getMyTickets);
router.get("/", requireAuth, requireRole("ADMIN"), getAllTickets);
router.patch("/:id/complete", requireAuth, requireRole("ADMIN"), completeTicket);
router.post("/:id/feedback", requireAuth, submitFeedback);

module.exports = router;
