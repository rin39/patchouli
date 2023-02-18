import clientPromise from "../lib/mongo";
import { Db } from "mongodb";
import { librarySchema, Library } from "../types/validation";

let database: Db;

(async () => {
  const client = await clientPromise;
  database = client.db();
})();

export async function getLibraries(userId: string): Promise<Library[]> {
  const libraries = await database
    .collection("libraries")
    .find({ userId })
    .toArray();

  return libraries.map((library) => ({
    _id: library._id.toString(),
    userId: library.userId,
    name: library.name,
    fields: library.fields,
  }));
}

export async function createLibrary(requestBody: unknown, userId: string) {
  const libraryEntryRaw = librarySchema.parse(requestBody);
  const libraryEntry = { ...libraryEntryRaw, userId };
  await database.collection("libraries").insertOne(libraryEntry);
}
