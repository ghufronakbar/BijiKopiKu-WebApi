import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "@/db/prisma";
import { JWT_SECRET } from "@/constants";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") return res.status(405).end();
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name || !phone) {
      return res
        .status(200)
        .json({ success: false, message: "Harap isi semua field" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res
        .status(200)
        .json({ success: false, message: "Email sudah terdaftar" });
    }

    const create = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        name,
        phone,
      },
    });

    const payload = { id: create.id, role: "USER" };

    const accessToken = jwt.sign(payload, JWT_SECRET!);
    return res.status(200).json({
      success: true,
      message: "Berhasil melakukan registrasi",
      data: { ...create, accessToken },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ success: false, message: "Terjadi kesalahan sistem" });
  }
}
