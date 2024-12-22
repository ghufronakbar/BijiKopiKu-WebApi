import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import userAuth from "@/middleware/userAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const id = req.decoded?.id;
      if (!id)
        return res
          .status(200)
          .json({ success: false, message: "Pengguna tidak ditemukan" });
      const orders = await getAllHistory(id);
      return res
        .status(200)
        .json({ success: true, message: "Success", data: orders });
    }

    if (req.method === "POST") {
      const id = req.decoded?.id;
      if (!id)
        return res
          .status(200)
          .json({ success: false, message: "Pengguna tidak ditemukan" });
      const data = req.body as CheckoutDTO;

      const coffeeData = await validateCoffeIds(
        data.orderItems.map((item) => item.coffeeId)
      );
      if (!coffeeData) {
        return res
          .status(200)
          .json({ success: false, message: "Produk tidak ditemukan" });
      }

      const checkUser = await validateUser(id);
      if (!checkUser) {
        return res
          .status(200)
          .json({ success: false, message: "Pengguna tidak ditemukan" });
      }

      const orderItems = data.orderItems.map((item) => {
        const coffee = coffeeData.find((c) => c.id === item.coffeeId);
        if (!coffee) throw new Error("Produk tidak valid");
        return {
          coffeeId: item.coffeeId,
          quantity: item.quantity,
          total: coffee.price * item.quantity,
        };
      });

      const order = await createCheckout(id, orderItems);
      return res
        .status(200)
        .json({ success: true, message: "Success", data: order });
    } else {
      return res
        .status(405)
        .json({ status: 405, message: "Method not allowed" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ success: false, message: "Terjadi kesalahan sistem" });
  }
}

async function getAllHistory(userId: string) {
  return await prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          coffee: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      userId,
    },
  });
}

interface CheckoutDTO {
  orderItems: {
    coffeeId: string;
    quantity: number;
  }[];
}

interface OrderItemDTO {
  coffeeId: string;
  quantity: number;
  total: number;
}

async function createCheckout(userId: string, orderItems: OrderItemDTO[]) {
  const total = orderItems.reduce((acc, item) => acc + item.total, 0);
  return await prisma.order.create({
    data: {
      total,
      paymentProof: null,
      status: "Dipesan",
      userId: userId,
      orderItems: {
        createMany: {
          data: orderItems,
        },
      },
    },
    include: {
      orderItems: {
        include: {
          coffee: true,
        },
      },
    },
  });
}

async function validateCoffeIds(ids: string[]) {
  const response = await prisma.coffee.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
      price: true,
    },
  });
  if (response.length !== ids.length) return false;
  return response;
}

async function validateUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  return true;
}

export default userAuth(handler);
