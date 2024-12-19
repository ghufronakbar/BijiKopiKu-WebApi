import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import adminAuth from "@/middleware/adminAuth";
import { $Enums } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as { id: string };

    if (req.method === "GET") {
      const order = await getById(id);
      if (!order)
        return res
          .status(404)
          .json({ status: 404, message: "Pesanan tidak ditemukan" });
      return res
        .status(200)
        .json({ status: 200, message: "Success", data: order });
    } else if (req.method === "PATCH") {
      const confirmed = req.body.confirmed === true;
      const order = await getById(id);
      if (!order) {
        return res
          .status(404)
          .json({ status: 404, message: "Pesanan tidak ditemukan" });
      }
      let status: $Enums.OrderStatus;
      switch (order.status) {
        case "Dibayar":
          status = confirmed ? "Diterima" : "Ditolak";
          break;
        case "Diterima":
          status = "Selesai";
          break;
        default:
          return res
            .status(400)
            .json({ status: 400, message: "Status pesanan tidak valid" });
      }

      const updatedOrder = await updateStatus(id, status);
      return res
        .status(200)
        .json({ status: 200, message: "Success", data: updatedOrder });
    } else {
      return res
        .status(405)
        .json({ status: 405, message: "Method not allowed" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Terjadi kesalahan sistem" });
  }
}

async function getById(id: string) {
  return await prisma.order.findUnique({
    include: {
      user: true,
      orderItems: {
        include: {
          coffee: true,
        },
      },
    },
    where: { id },
  });
}

async function updateStatus(id: string, status: $Enums.OrderStatus) {
  return await prisma.order.update({
    where: { id },
    data: { status },
  });
}

export default adminAuth(handler);
