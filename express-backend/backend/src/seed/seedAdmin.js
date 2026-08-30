require("dotenv").config();
const prisma = require("../lib/prisma");
const { hashPassword } = require("../utils/password");

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Arctic Circle Admin";

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.create({
    data: { name, email, passwordHash, role: "ADMIN" },
  });
  console.log(`Admin created: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
