import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth/next";
import { ZodError } from "zod";
import { createItem, getItems, getItemsMetadata } from "@/services/items";
import { Item } from "@/types/common";
import { authOptions } from "@/api/auth/[...nextauth]";

type Data = {
  message?: string;
  items?: Item[];
  metadata?: Awaited<ReturnType<typeof getItemsMetadata>>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(req, res, authOptions);
  const { id, page: pageQuery } = req.query;

  if (!id) {
    return res.status(400).json({ message: "No id provided" });
  }

  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (req.method) {
    case "POST":
      try {
        await createItem(req.body, id as string, session.user.id);
        return res.status(201).json({ message: "Created" });
      } catch (e) {
        if (e instanceof ZodError) {
          return res
            .status(400)
            .json({ message: "Failed to create item: incorrect schema" });
        }
        return res.status(400).json({ message: "Failed to create item" });
      }

    case "GET":
      try {
        let page = pageQuery ? +pageQuery - 1 : 0;
        const items = await getItems(id as string, session.user.id, page);
        const metadata = await getItemsMetadata(
          id as string,
          session.user.id,
          page
        );
        return res.status(200).json({ items, metadata });
      } catch {
        return res.status(400).json({ message: "Failed to get items" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
