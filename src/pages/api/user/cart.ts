import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import userAuth from "@/middleware/userAuth";

/*
EXPECTED REQ.BODY:
{
    "carts": [
        {
            "id": "someuuid",
            "quantity": 1
        }
    ]
}
*/

/*
EXPECTED RESPONSE:
filter in id and isDeleted
{
    "status": 200,
    "message": "Success",
    "data": [
        {
            ...coffee,
            "quantity": 1
        }
    ]
}
*/

interface Cart {
  id: string;
  quantity: number;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const carts = req.body.carts as Cart[];
    const coffees = await prisma.coffee.findMany({
      where: {
        AND: [
          {
            id: {
              in: carts.map((cart) => cart.id),
            },
          },
          {
            isDeleted: false,
          },
        ],
      },
    });

    const response = coffees.map((coffee) => {
      const cart = carts.find((cart) => cart.id === coffee.id);
      return { ...coffee, quantity: Number(cart?.quantity) || 0 };
    });

    return res
      .status(200)
      .json({ success: true, message: "Success", data: response });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Terjadi kesalahan sistem" });
  }
}

export default userAuth(handler);
