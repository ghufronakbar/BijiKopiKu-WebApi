import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import adminAuth from "@/middleware/adminAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const users = await GET();
      return res
        .status(200)
        .json({ status: 200, message: "Success", data: users });
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
  return await prisma.user.findMany({
    include: {
      _count: {
        select: {
          orders: {
            where: {
              status: {
                equals: "Dipesan",
              },
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export default adminAuth(handler);
