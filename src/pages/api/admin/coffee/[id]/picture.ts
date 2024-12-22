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

  const check = await prisma.coffee.count({ where: { id } });
  if (!check) {
    return res
      .status(404)
      .json({ status: 404, message: "Data tidak ditemukan" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable Error:", err);
      return res.status(500).json({
        status: 500,
        message: "Terjadi kesalahan sistem",
      });
    }

    const picture = files.picture;
    if (!picture) {
      return res.status(400).json({
        status: 400,
        message: "Harap upload bukti pembayaran",
      });
    }

    const uploadToCloudinary = (): Promise<UploadApiResponse> => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "bijikopiku/coffee" },
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
        status: 200,
        message: "Berhasil mengganti gambar",
        data: checkout,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      return res.status(400).json({
        status: 500,
        message: "Terjadi kesalahan saat mengupload gambar",
      });
    }
  });
}

const PICTURE = async (id: string, picture: string) => {
  return await prisma.coffee.update({
    where: { id },
    data: { picture },
  });
};

export default userAuth(handler);
