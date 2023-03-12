import clientPromise from "@/lib/mongo";
import { Db, ObjectId } from "mongodb";
import { Library } from "@/types/common";
import { LibrarySchema } from "@/lib/validation";

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

export async function getLibrary(id: string) {
  const library = await database
    .collection("libraries")
    .findOne<Library>({ _id: new ObjectId(id) });

  if (!library) {
    throw new Error("Library with such id does not exist");
  }

  library._id = library._id.toString();

  return library;
}

export async function createLibrary(requestBody: unknown, userId: string) {
  const parsedLibrary = LibrarySchema.parse(requestBody);
  const library = { ...parsedLibrary, userId };
  const { insertedId } = await database
    .collection("libraries")
    .insertOne(library);
  return insertedId.toString();
}
