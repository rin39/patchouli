import { z } from "zod";

export type Library = z.infer<typeof librarySchema> & {
  _id: string;
  userId: string;
};

export const librarySchema = z.object({
  name: z.string().min(1),
  fields: z
    .object({
      name: z.string().min(1),
      type: z.enum(["text", "number", "boolean", "date"]),
    })
    .array()
    .nonempty(),
});
