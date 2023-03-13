import clientPromise from "@/lib/mongo";
import { Db } from "mongodb";
import { getLibrary } from "@/services/libraries";
import { Item } from "@/types/common";
import { createItemValidationObject } from "@/lib/validation";
import { removeEmptyObjectProperties } from "@/lib/util";

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
  userId: string
): Promise<Item[]> {
  const items = await database
    .collection("items")
    .find({ libraryId, userId })
    .toArray();

  return items.map((item) => item.data);
}
