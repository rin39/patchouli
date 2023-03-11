import { z } from "zod";
import { FieldSchema, FieldTypeEnum, LibrarySchema } from "@/lib/validation";

export type Library = z.infer<typeof LibrarySchema> & {
  _id: string;
  userId: string;
};

export type LibraryField = z.infer<typeof FieldSchema>;

export type FieldType = z.infer<typeof FieldTypeEnum>;

export type Item = {
  [key: string]: string | number | boolean;
};
