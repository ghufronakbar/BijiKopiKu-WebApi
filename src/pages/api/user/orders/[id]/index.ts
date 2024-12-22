import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import userAuth from "@/middleware/userAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as { id: string };
    if (req.method === "GET") {
      const order = await byId(id);
      if (!order)
        return res
          .status(200)
          .json({ success: false, message: "Pesanan tidak ditemukan" });
      return res
        .status(200)
        .json({ success: true, message: "Success", data: order });
    }
    if (req.method === "PATCH") {
      const check = await byId(id);
      if (!check)
        return res
          .status(200)
          .json({ success: false, message: "Pesanan tidak ditemukan" });
      const order = await cancelOrder(id);
      return res
        .status(200)
        .json({
          success: true,
          message: "Berhasil membatalkan pesanan",
          data: order,
        });
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

async function byId(id: string) {
  return await prisma.order.findUnique({
    include: {
      orderItems: {
        include: {
          coffee: true,
        },
      },
    },
    where: { id },
  });
}

async function cancelOrder(id: string) {
  return await prisma.order.update({
    where: { id },
    data: { status: "Dibatalkan" },
  });
}

export default userAuth(handler);
