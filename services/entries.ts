import clientPromise from "../lib/mongo";
import { Db } from "mongodb";
import { getLibrary } from "./libraries";
import { Entry } from "../types/common";
import { createEntryValidationObject } from "../lib/validation";

let database: Db;

(async () => {
  const client = await clientPromise;
  database = client.db();
})();

export async function createEntry(
  requestBody: any,
  libraryId: string,
  userId: string
) {
  const library = await getLibrary(libraryId);

  if (!library) {
    throw new Error("Library with such id does not exist");
  }

  const validationObject = createEntryValidationObject(library);
  const data = validationObject.parse(requestBody);

  const entry = { userId, libraryId, data };

  await database.collection("entries").insertOne(entry);
}

export async function getEntries(
  libraryId: string,
  userId: string
): Promise<Entry[]> {
  const entries = await database
    .collection("entries")
    .find({ libraryId, userId })
    .toArray();

  return entries.map((entry) => entry.data);
}
