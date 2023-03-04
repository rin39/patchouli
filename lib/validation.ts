import { FieldType, Library } from "../types/common";
import { AnyZodObject, z, ZodTypeAny } from "zod";

export function createZodPrimitive(type: FieldType) {
  switch (type) {
    case "text":
      return z.string();

    case "number":
      return z.number();

    case "date":
      return z.date();

    case "boolean":
      return z.boolean();

    default:
      throw new Error("Unknown type");
  }
}

export function createEntryValidationObject(library: Library): AnyZodObject {
  const fields = library.fields.reduce(
    (a: { [x: string]: ZodTypeAny }, field) => {
      const fieldName = field.name;
      const fieldType = field.type;
      a[fieldName] = createZodPrimitive(fieldType);
      return a;
    },
    {}
  );

  return z.object(fields);
}

export const FieldTypeEnum = z.enum(["text", "number", "boolean", "date"]);
export const LibrarySchema = z.object({
  name: z.string().min(1),
  fields: z
    .object({
      name: z.string().min(1),
      type: FieldTypeEnum,
    })
    .array()
    .nonempty(),
});
