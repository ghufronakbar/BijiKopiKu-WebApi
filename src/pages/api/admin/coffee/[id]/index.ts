import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import adminAuth from "@/middleware/adminAuth";
import { $Enums } from "@prisma/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as { id: string };
    if (req.method === "GET") {
      const coffee = await getById(id);
      if (!coffee || coffee?.isDeleted)
        return res
          .status(404)
          .json({ status: 404, message: "Data tidak ditemukan" });
      return res
        .status(200)
        .json({ status: 200, message: "Success", data: coffee });
    } else if (req.method === "DELETE") {
      const check = await getById(id);
      if (!check)
        return res
          .status(404)
          .json({ status: 404, message: "Data tidak ditemukan" });
      const deleted = await deleteById(id);
      return res
        .status(200)
        .json({ status: 200, message: "Success", data: deleted });
    } else if (req.method === "PUT") {
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
      const order = await edit(id, {
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

async function getById(id: string) {
  return await prisma.coffee.findUnique({
    include: {
      orderItems: {
        include: {
          order: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    where: { id },
  });
}

async function deleteById(id: string) {
  return await prisma.coffee.update({
    where: { id },
    data: { isDeleted: true },
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

async function edit(id: string, data: CoffeeDTO) {
  return await prisma.coffee.update({ data, where: { id } });
}

export default adminAuth(handler);
