import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import adminAuth from "@/middleware/adminAuth";
import { $Enums } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const orders = await GET();
      return res
        .status(200)
        .json({ status: 200, message: "Success", data: orders });
    } else if (req.method === "POST") {
      const {
        name,
        price,
        isForCoffeeEnthusiast,
        type,
        taste,
        isItForSweet,
        flavor,
        desc,
      } = req.body as CoffeeDTO;
      console.log(req.body);
      if (!name || !price || !type || !taste || !flavor) {
        return res
          .status(400)
          .json({ status: 400, message: "Harap isi semua field" });
      }
      const order = await create({
        name,
        price,
        isForCoffeeEnthusiast,
        type,
        taste,
        isItForSweet,
        flavor,
        desc,
      });
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
      .status(500)
      .json({ status: 500, message: "Terjadi kesalahan sistem" });
  }
}

async function GET() {
  return await prisma.coffee.findMany({
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
    orderBy: {
      createdAt: "desc",
    },
    where: {
      isDeleted: false,
    },
  });
}

interface CoffeeDTO {
  name: string;
  price: number;
  isForCoffeeEnthusiast: boolean;
  type: $Enums.CoffeeType;
  taste: $Enums.TasteLevel;
  isItForSweet: boolean;
  flavor: $Enums.Flavor;
  desc: string;
}

async function create(data: CoffeeDTO) {
  return await prisma.coffee.create({ data });
}

export default adminAuth(handler);
