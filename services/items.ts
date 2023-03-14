import clientPromise from "@/lib/mongo";
import { Db } from "mongodb";
import { getLibrary } from "@/services/libraries";
import { Item } from "@/types/common";
import { createItemValidationObject } from "@/lib/validation";
import { removeEmptyObjectProperties } from "@/lib/util";
import { ITEMS_PER_PAGE } from "@/lib/pagination";

let database: Db;

(async () => {
  const client = await clientPromise;
  database = client.db();
})();

export async function createItem(
  requestBody: any,
  libraryId: string,
  userId: string
) {
  const library = await getLibrary(libraryId);
  const validationObject = createItemValidationObject(library);

  const clearedRequestBody = removeEmptyObjectProperties(requestBody);
  const data = validationObject.parse(clearedRequestBody);

  const item = { userId, libraryId, data };

  await database.collection("items").insertOne(item);
}

export async function getItems(
  libraryId: string,
  userId: string,
  page: number = 0
): Promise<Item[]> {
  const items = await database
    .collection("items")
    .find({ libraryId, userId })
    .limit(ITEMS_PER_PAGE)
    .skip(page * ITEMS_PER_PAGE)
    .toArray();

  return items.map((item) => item.data);
}

export async function getItemsMetadata(
  libraryId: string,
  userId: string,
  page: number = 0
) {
  const documentsCount = await database
    .collection("items")
    .countDocuments({ libraryId, userId });

  const pages = Math.ceil(documentsCount / ITEMS_PER_PAGE);
  const nextPage = page + 2;

  if (nextPage > pages) {
    return { pages };
  } else {
    return { pages, nextPage };
  }
}
