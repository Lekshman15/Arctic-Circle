const prisma = require("../lib/prisma");
const { comparePassword, hashPassword } = require("../utils/password");
const { toPublicUser } = require("./auth.controller");

async function getMe(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json(toPublicUser(user));
}

async function updateMe(req, res) {
  const { name, phone, address } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
    },
  });
  res.json(toPublicUser(user));
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "currentPassword and newPassword are required." });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters." });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!(await comparePassword(currentPassword, user.passwordHash))) {
    return res.status(400).json({ error: "Current password is incorrect." });
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  res.json({ message: "Password updated." });
}

module.exports = { getMe, updateMe, changePassword };
