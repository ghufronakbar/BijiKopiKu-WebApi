import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import userAuth from "@/middleware/userAuth";
import bcrypt from "bcrypt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const id = req.decoded?.id;
      if (!id)
        return res
          .status(200)
          .json({ success: false, message: "Harap login terlebih dahulu" });
      const user = await GET(id);
      if (!user) {
        return res
          .status(200)
          .json({ success: false, message: "Pengguna tidak ditemukan" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Success", data: user });
    }
    if (req.method === "PUT") {
      const { email, name, phone } = req.body;
      const id = req.decoded?.id;
      if (!id)
        return res
          .status(200)
          .json({ success: false, message: "Harap login terlebih dahulu" });
      if (!email || !name || !phone) {
        return res
          .status(200)
          .json({ success: false, message: "Harap isi semua field" });
      }
      const user = await prisma.user.findUnique({ where: { email } });
      if (user && user.id !== id) {
        return res
          .status(200)
          .json({ success: false, message: "Email sudah terdaftar" });
      }

      const data = { email, name, phone };

      const create = await PUT(id, data);

      return res.status(200).json({
        success: true,
        message: "Berhasil mengedit profil",
        data: create,
      });
    }
    if (req.method === "PATCH") {
      const { newPassword, oldPassword, confirmPassword } = req.body;
      const id = req.decoded?.id;
      if (!id) {
        return res
          .status(200)
          .json({ success: false, message: "Harap login terlebih dahulu" });
      }
      if (!newPassword || !oldPassword || !confirmPassword) {
        return res
          .status(200)
          .json({ success: false, message: "Harap isi semua field" });
      }
      if (newPassword !== confirmPassword) {
        return res
          .status(200)
          .json({ success: false, message: "Konfirmasi password tidak sama" });
      }
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        return res
          .status(200)
          .json({ success: false, message: "Pengguna tidak ditemukan" });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res
          .status(200)
          .json({ success: false, message: "Password lama salah" });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      const edit = await PATCH(id, hashed);
      return res.status(200).json({
        success: true,
        message: "Berhasil mengubah password",
        data: edit,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ success: false, message: "Terjadi kesalahan sistem" });
  }
}

const GET = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};

interface UserDTO {
  email: string;
  name: string;
  phone: string;
}

const PUT = async (id: string, data: UserDTO) => {
  return await prisma.user.update({ data, where: { id } });
};

const PATCH = async (id: string, password: string) => {
  return await prisma.user.update({
    where: { id },
    data: { password },
  });
};

export default userAuth(handler);
