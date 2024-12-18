import { JWT_SECRET } from "@/constants";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default function adminAuth(
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
    }

    try {
      const token = authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized",
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET!) as {
        id: string;
        role: "ADMIN" | "USER";
      };

      if (!decoded) {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized",
        });
      }
      if (!decoded.id) {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized",
        });
      }
      if (decoded && decoded.role !== "ADMIN") {
        return res.status(401).json({
          status: 401,
          message: "Unauthorized",
        });
      }

      req.decoded = decoded;
      return handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
    }
  };
}
