import clientPromise from "../lib/mongo";
import { Db } from "mongodb";
import { getLibrary } from "./libraries";
import { Item } from "../types/common";
import { createItemValidationObject } from "../lib/validation";

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

  if (!library) {
    throw new Error("Library with such id does not exist");
  }

  const validationObject = createItemValidationObject(library);
  const data = validationObject.parse(requestBody);

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
