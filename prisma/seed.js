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

async function main() {
  // Membuat beberapa kopi terlebih dahulu dan menyimpan id-nya
  const coffee1 = await prisma.coffee.create({
    data: {
      name: 'Arabica Classic',
      price: 50000,
      isForCoffeeEnthusiast: true,
      type: "Arabica",
      taste: "Light",
      isItForSweet: false,
      flavor: "Asam",
    }
  });

  const coffee2 = await prisma.coffee.create({
    data: {
      name: 'Robusta Bold',
      price: 70000,
      isForCoffeeEnthusiast: true,
      type: "Robusta",
      taste: "Strong",
      isItForSweet: true,
      flavor: "Karamel",
    }
  });

  // Menyimpan id kopi yang baru dibuat untuk digunakan di order dan order item
  const coffeeIds = {
    coffee1Id: coffee1.id,
    coffee2Id: coffee2.id,
  };

  // Membuat beberapa User
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashed_password1', // Pastikan password ini ter-enkripsi sebelum disimpan
      orders: {
        create: [
          {
            total: 150000,
            orderItems: {
              create: [
                {
                  coffeeId: coffeeIds.coffee1Id, // Menggunakan id kopi dari variabel coffeeIds
                  quantity: 2,
                  total: 100000,
                },
                {
                  coffeeId: coffeeIds.coffee2Id, // Menggunakan id kopi dari variabel coffeeIds
                  quantity: 1,
                  total: 50000,
                }
              ]
            },
          }
        ]
      }
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'hashed_password2', // Pastikan password ini ter-enkripsi sebelum disimpan
    },
  });

  // Membuat Order dan OrderItem untuk user1
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      total: 150000,
      status: "Dipesan",
      orderItems: {
        create: [
          {
            coffeeId: coffeeIds.coffee1Id, // Menggunakan id kopi dari variabel coffeeIds
            quantity: 2,
            total: 100000,
          },
          {
            coffeeId: coffeeIds.coffee2Id, // Menggunakan id kopi dari variabel coffeeIds
            quantity: 1,
            total: 50000,
          }
        ]
      },
    },
  });

  console.log({ user1, user2, coffee1, coffee2, order1 });
}
seedAdmin();
main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });