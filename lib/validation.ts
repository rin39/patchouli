import { FieldType, Library } from "@/types/common";
import { AnyZodObject, z, ZodTypeAny } from "zod";

export function createZodPrimitive(type: FieldType, isRequired: boolean) {
  let primitive;

  switch (type) {
    case "text":
      primitive = z.string().trim().min(1);
      break;

    case "number":
      primitive = z.number();
      break;

    case "date":
      primitive = z.coerce.date();
      break;

    case "boolean":
      primitive = z.boolean();
      break;

    default:
      throw new Error("Unknown type");
  }

  if (!isRequired) primitive = primitive.optional();

  return primitive;
}

export function createItemValidationObject(library: Library): AnyZodObject {
  const fields = library.fields.reduce(
    (a: { [x: string]: ZodTypeAny }, field) => {
      const fieldName = field.name;
      const fieldType = field.type;
      const fieldRequired = field.required;
      a[fieldName] = createZodPrimitive(fieldType, fieldRequired);
      return a;
    },
    {}
  );

  return z.object(fields);
}

export const FieldTypeEnum = z.enum(["text", "number", "boolean", "date"]);
export const FieldSchema = z.object({
  name: z.string().trim().min(1, "Field name should not be empty"),
  type: FieldTypeEnum,
  required: z.boolean(),
});
export const LibrarySchema = z.object({
  name: z.string().trim().min(1, "Library name should not be empty"),
  fields: FieldSchema.array()
    .nonempty("Library should have at least one field")
    .refine((fields) => fields.some((field) => field.required), {
      message: "At least one field should be required",
    })
    .refine(
      (fields) => {
        const fieldNamesArray = fields
          .map((field) => field.name)
          .filter((fieldName) => fieldName);
        const fieldNamesSet = new Set(fieldNamesArray);
        return fieldNamesArray.length === fieldNamesSet.size;
      },
      { message: "Field names should be unique" }
    ),
});
