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
      const orders = await GET(id);
      return res
        .status(200)
        .json({ success: true, message: "Success", data: orders });
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

async function GET(userId: string) {
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

export default userAuth(handler);
