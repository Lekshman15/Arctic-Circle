const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { getMe, updateMe, changePassword } = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);
router.put("/me/password", requireAuth, changePassword);

module.exports = router;
