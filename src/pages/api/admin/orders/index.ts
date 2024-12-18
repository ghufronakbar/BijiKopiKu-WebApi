import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import adminAuth from "@/middleware/adminAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const orders = await GET();
      return res
        .status(200)
        .json({ status: 200, message: "Success", data: orders });
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

async function GET() {
  return await prisma.order.findMany({
    include: {
      user: true,
      orderItems: {
        include: {
          coffee: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default adminAuth(handler);
