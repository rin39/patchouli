import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth/next";
import { ZodError } from "zod";
import { createEntry, getEntries } from "../../../services/entries";
import { Entry } from "../../../types/common";
import { authOptions } from "../auth/[...nextauth]";

type Data = {
  message?: string;
  entries?: Entry[];
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
    case "POST":
      try {
        await createEntry(req.body, id as string, session.user.id);
        return res.status(201).json({ message: "Created" });
      } catch (e) {
        if (e instanceof ZodError) {
          return res
            .status(400)
            .json({ message: "Failed to create entry: incorrect schema" });
        }
        return res.status(400).json({ message: "Failed to create entry" });
      }

    case "GET":
      try {
        const entries = await getEntries(id as string, session.user.id);
        return res.status(200).json({ entries });
      } catch {
        return res.status(400).json({ message: "Failed to get entries" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}