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
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(200)
        .json({ success: false, message: "Harap isi email dan password" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, message: "Pengguna tidak ditemukan" });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res
        .status(200)
        .json({ success: false, message: "Password salah" });
    }
    const payload = { id: user.id, role: "USER" };

    const accessToken = jwt.sign(payload, JWT_SECRET!);
    return res.status(200).json({
      success: true,
      message: "Berhasil melakukan login",
      data: { ...user, accessToken },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ success: false, message: "Terjadi kesalahan sistem" });
  }
}
