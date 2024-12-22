import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import userAuth from "@/middleware/userAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, quantity } = req.query as { id: string; quantity: string };
    if (req.method === "GET") {
      const coffee = await getById(id);
      if (!coffee)
        return res
          .status(200)
          .json({ success: false, message: "Data tidak ditemukan" });

      const { _count, ...response } = coffee;
      const formattedResponse = {
        ...response,
        sold: _count?.orderItems || 0,
        quantity: Number(quantity) || 0,
      };

      return res
        .status(200)
        .json({ success: true, message: "Success", data: formattedResponse });
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
  return await prisma.coffee.findFirst({
    include: {
      _count: {
        select: {
          orderItems: {
            where: {
              NOT: [
                {
                  order: {
                    status: {
                      in: ["Dibatalkan", "Ditolak"],
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
    where: { id },
  });
}

export default userAuth(handler);
