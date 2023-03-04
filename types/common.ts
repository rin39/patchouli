import { z } from "zod";
import { FieldTypeEnum, LibrarySchema } from "../lib/validation";

export type Library = z.infer<typeof LibrarySchema> & {
  _id: string;
  userId: string;
};

export type FieldType = z.infer<typeof FieldTypeEnum>;

export type Entry = {
  [key: string]: string | number | boolean;
};
