import { JWT_SECRET } from "@/constants";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default function userAuth(
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { authorization } = req.headers;

    try {
      const token = authorization?.split(" ")?.[1];

      const decoded = token
        ? (jwt.verify(token, JWT_SECRET!) as Decoded)
        : { id: "", role: "USER" };

      req.decoded = decoded;
      return handler(req, res);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      req.decoded = { id: "", role: "USER" };
      return handler(req, res);
    }
  };
}

interface Decoded {
  id: string;
  role: "ADMIN" | "USER";
}
