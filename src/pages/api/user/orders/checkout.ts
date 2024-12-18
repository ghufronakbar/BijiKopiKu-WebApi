import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/prisma";
import userAuth from "@/middleware/userAuth";
import { $Enums } from "@prisma/client";
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
  try {
    if (req.method === "POST") {
      const userId = req.decoded?.id as string;

      const form = formidable({ multiples: false });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Formidable Error:", err);
          return res.status(200).json({
            success: false,
            message: "Terjadi kesalahan sistem",
          });
        }
        const { location, latitude, longitude, brand, desc } = fields;
        console.log({ location, latitude, longitude, brand, desc, files });
        console.log({ fields });
        if (!location || !latitude || !longitude || !brand || !desc) {
          return res
            .status(200)
            .json({ success: false, message: "Harap isi semua field" });
        }

        if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
          return res.status(200).json({
            success: false,
            message: "Harap isi latitude dan longitude dengan angka",
          });
        }

        const picture = files.picture;
        if (!picture) {
          return res.status(200).json({
            success: false,
            message: "Harap upload gambar",
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

          const data: CheckoutDTO = {
            brand: String(brand),
            desc: String(desc),
            latitude: Number(latitude),
            longitude: Number(longitude),
            location: String(location),
            picture: uploadResult.url,
            status: "Dipesan",
            userId,
          };

          const checkout = await CHECKOUT(data);
          return res.status(200).json({
            success: true,
            message: "Berhasil melakukan pemesanan",
            data: checkout,
          });
        } catch (error) {
          console.error("Upload Error:", error);
          return res.status(200).json({
            success: false,
            message: "Terjadi kesalahan saat mengupload gambar ke Cloudinary",
          });
        }
      });
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

interface CheckoutDTO {
  userId: string;
  location: string;
  latitude: number;
  longitude: number;
  brand: string;
  desc: string;
  picture: string;
  status: $Enums.OrderStatus;
}

const CHECKOUT = async (data: CheckoutDTO) => {
  return await prisma.order.create({ data });
};

export default userAuth(handler);
