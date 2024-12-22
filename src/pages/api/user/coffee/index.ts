import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import { $Enums } from "@prisma/client";
import userAuth from "@/middleware/userAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const coffees = await GET();
      const response = coffees.map((item) => ({ ...item, matchRate: 0 }));
      return res
        .status(200)
        .json({ success: true, message: "Success", data: response });
    }

    if (req.method === "POST") {
      const { isForCoffeeEnthusiast, type, taste, isItForSweet, flavor } =
        req.body as PreferencesDTO;
      if (!type || !taste || !flavor) {
        return res
          .status(200)
          .json({ success: false, message: "Harap isi semua field" });
      }
      const coffees = await filtered({
        isForCoffeeEnthusiast,
        type,
        taste,
        isItForSweet,
        flavor,
      });
      return res
        .status(200)
        .json({ success: true, message: "Success", data: coffees });
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

async function GET() {
  return await prisma.coffee.findMany({
    orderBy: {
      orderItems: {
        _count: "desc",
      },
    },
    where: {
      isDeleted: false,
    },
  });
}

interface PreferencesDTO {
  isForCoffeeEnthusiast: boolean;
  type: $Enums.CoffeeType;
  taste: $Enums.TasteLevel;
  isItForSweet: boolean;
  flavor: $Enums.Flavor;
}

async function filtered(filter: PreferencesDTO) {
  const coffees = await prisma.coffee.findMany({ where: { isDeleted: false } });

  const scoredCoffees = coffees.map((coffee) => {
    let matchRate = 0;

    if (coffee.type === filter.type) matchRate += 4; // High
    if (coffee.flavor === filter.flavor) matchRate += 4; // High
    if (coffee.taste === filter.taste) matchRate += 3; // Medium
    if (coffee.isForCoffeeEnthusiast === filter.isForCoffeeEnthusiast)
      matchRate += 2; // Low
    if (coffee.isItForSweet === filter.isItForSweet) matchRate += 2; // Low

    return { ...coffee, matchRate };
  });

  return scoredCoffees
    .filter((coffee) => coffee.matchRate > 0)
    .sort((a, b) => b.matchRate - a.matchRate);
}

export default userAuth(handler);
