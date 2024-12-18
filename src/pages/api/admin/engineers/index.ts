import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import adminAuth from "@/middleware/adminAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const engineers = await GET();
      return res
        .status(200)
        .json({ status: 200, message: "Success", data: engineers });
    } else if (req.method === "POST") {
      const { name, field, phone } = req.body;
      if (!name || !field || !phone)
        return res
          .status(400)
          .json({ status: 400, message: "Harap isi semua field" });
      const engineer = await POST({ name, field, phone });
      return res.status(200).json({
        status: 200,
        message: "Berhasil menambahkan teknisi",
        data: engineer,
      });
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
  return await prisma.engineer.findMany({
    include: {
      _count: { select: { orders: true } },
    },
    orderBy: {
      name: "asc",
    },
    where: {
      isDeleted: false,
    },
  });
}

interface EngineerDTO {
  name: string;
  field: string;
  phone: string;
}

async function POST(data: EngineerDTO) {
  return await prisma.engineer.create({ data });
}

export default adminAuth(handler);
