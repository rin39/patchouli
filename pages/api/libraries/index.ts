import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth/next";
import { authOptions } from "@/api/auth/[...nextauth]";

import { createLibrary, getLibraries } from "@/services/libraries";
import { ZodError } from "zod";
import { Library } from "@/types/common";

type Data = {
  message?: string;
  libraries?: Library[];
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
        return res.status(201).json({ message: "Created" });
      } catch (e) {
        if (e instanceof ZodError) {
          return res
            .status(400)
            .json({ message: "Failed to create library: incorrect schema" });
        }
        return res.status(400).json({ message: "Failed to create library" });
      }

    case "GET":
      try {
        const libraries = await getLibraries(session.user.id);
        return res.status(200).json({ libraries });
      } catch {
        return res.status(400).json({ message: "Failed to get libraries" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
