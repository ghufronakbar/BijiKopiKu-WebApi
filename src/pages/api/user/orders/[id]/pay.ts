import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import userAuth from "@/middleware/userAuth";
import formidable from "formidable";
import cloudinary from "@/config/cloudinary";
import fs from "fs";
import { UploadApiResponse } from "cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  const check = await prisma.order.count({ where: { id } });
  if (!check) {
    return res
      .status(200)
      .json({ success: false, message: "Pesanan tidak ditemukan" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable Error:", err);
      return res.status(200).json({
        success: false,
        message: "Terjadi kesalahan sistem",
      });
    }

    const picture = files.picture;
    if (!picture) {
      return res.status(200).json({
        success: false,
        message: "Harap upload bukti pembayaran",
      });
    }

    const uploadToCloudinary = (): Promise<UploadApiResponse> => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "telekvis/order" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Error:", error);
              reject(error);
            } else {
              if (result) {
                resolve(result);
              }
            }
          }
        );

        const stream = fs.createReadStream(picture[0].filepath);
        stream.pipe(uploadStream);
      });
    };

    try {
      const uploadResult = await uploadToCloudinary();

      const checkout = await PICTURE(id, uploadResult.secure_url);
      return res.status(200).json({
        success: true,
        message: "Berhasil melakukan pemesanan",
        data: checkout,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      return res.status(200).json({
        success: false,
        message: "Terjadi kesalahan saat mengupload gambar",
      });
    }
  });
}

const PICTURE = async (id: string, picture: string) => {
  return await prisma.order.update({
    where: { id },
    data: { paymentProof: picture, status: "Dibayar" },
  });
};

export default userAuth(handler);
