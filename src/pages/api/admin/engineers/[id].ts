import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import adminAuth from "@/middleware/adminAuth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as { id: string };
    if (req.method === "GET") {
      const engineer = await GET(id);
      if (!engineer) {
        return res
          .status(404)
          .json({ status: 404, message: "Teknisi tidak ditemukan" });
      }
      return res
        .status(200)
        .json({ status: 200, message: "Success", data: engineer });
    } else if (req.method === "PUT") {
      const { name, field, phone } = req.body;
      if (!name || !field || !phone)
        return res
          .status(400)
          .json({ status: 400, message: "Harap isi semua field" });
      const engineer = await PUT(id, { name, field, phone });
      return res.status(200).json({
        status: 200,
        message: "Berhasil mengedit teknisi",
        data: engineer,
      });
    } else if (req.method === "DELETE") {
      const check = await prisma.engineer.count({ where: { id } });
      if (!check) {
        return res
          .status(404)
          .json({ status: 404, message: "Teknisi tidak ditemukan" });
      }
      const engineer = await DELETE(id);
      return res.status(200).json({
        status: 200,
        message: "Berhasil menghapus teknisi",
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

async function GET(id: string) {
  return await prisma.engineer.findFirst({
    include: {
      orders: true,
    },
    where: {
      AND: [{ id }, { isDeleted: false }],
    },
  });
}

interface EngineerDTO {
  name: string;
  field: string;
  phone: string;
}

async function PUT(id: string, data: EngineerDTO) {
  return await prisma.engineer.update({ data, where: { id } });
}

async function DELETE(id: string) {
  return await prisma.engineer.update({
    where: { id },
    data: { isDeleted: true },
  });
}

export default adminAuth(handler);
