import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import userAuth from "@/middleware/userAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as { id: string };
    if (req.method === "GET") {
      const order = await GET(id);
      if (!order)
        return res
          .status(200)
          .json({ success: false, message: "Pesanan tidak ditemukan" });
      return res
        .status(200)
        .json({ status: 200, message: "Success", data: order });
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

async function GET(id: string) {
  return await prisma.order.findUnique({
    include: {
      engineer: true,
    },
    where: { id },
  });
}

export default userAuth(handler);
