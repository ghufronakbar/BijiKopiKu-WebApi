/* eslint-disable */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const seedAdmin = async () => {
  const admin = await prisma.admin.findUnique({
    where: { email: "admin@bijikopiku.com" },
  });
  if (!admin) {
    console.log("Seeding admin...");
    await prisma.admin.create({
      data: {
        name: "Admin",
        email: "admin@bijikopiku.com",
        password: await bcrypt.hash("12345678", 10),
      },
    });
  } else {
    console.log("Admin already exists");
  }
};


seedAdmin()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });