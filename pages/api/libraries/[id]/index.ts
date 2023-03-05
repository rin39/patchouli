import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth/next";
import { getLibrary } from "../../../../services/libraries";
import { Library } from "../../../../types/common";
import { authOptions } from "../../auth/[...nextauth]";

type Data = {
  message?: string;
  library?: Library;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "No id provided" });
  }

  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (req.method) {
    case "GET":
      try {
        const library = await getLibrary(id as string);
        return res.status(200).json({ library });
      } catch {
        return res.status(400).json({ message: "Failed to get library" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
