import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import { createLibrary } from "../../../services/libraries";
import { ZodError } from "zod";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (req.method) {
    case "POST":
      try {
        await createLibrary(req.body, session.user.id);
        res.status(201).json({ message: "Created" });
      } catch (e) {
        if (e instanceof ZodError) {
          return res
            .status(400)
            .json({ message: "Failed to create library: incorrect schema" });
        }
        return res.status(400).json({ message: "Failed to create library" });
      }

      break;

    case "GET":
      res.status(501).json({ message: "Not Implemented" });
      break;

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
