import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { ZodError } from "zod";
import axios from "axios";
import { LibrarySchema as FormSchema } from "@/lib/validation";
import { LibraryField } from "@/types/common";

type FormErrors = {
  name: string;
  fields: {
    name?: string;
    type?: string;
  }[];
};

const emptyField: LibraryField = {
  name: "",
  type: "text",
  required: false,
};

export default function NewLibraryForm() {
  return (
    <Formik
      initialValues={{
        name: "",
        fields: [{ ...emptyField }],
      }}
      validate={(values) => {
        const errors: FormErrors = {
          name: "",
          fields: [],
        };

        try {
          FormSchema.parse(values);
        } catch (e) {
          if (e instanceof ZodError) {
            for (let error of e.errors) {
              if (error.path[0] === "name") {
                errors.name = "Required";
              } else if (error.path[0] === "fields") {
                const index = error.path[1] as number;
                errors.fields[index] = {
                  name: "Field name is required",
                };
              }
            }
          }
        }

        if (!errors.name && errors.fields.length === 0) {
          return {};
        }

        return errors;
      }}
      onSubmit={async (values) => {
        await axios.post("/api/libraries", values);
      }}
    >
      {({ values, touched, errors }) => (
        <Form>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-xl">
              Name
            </label>
            <Field
              name="name"
              id="name"
              className={
                touched.name && errors.name
                  ? "border border-red-600 p-1"
                  : "border p-1"
              }
              placeholder="New Library"
            />
            <ErrorMessage
              name={`name`}
              component="div"
              className="text-red-600 text-xs"
            />
          </div>
          <FieldArray name="fields">
            {({ remove, push }) => (
              <fieldset className="my-3">
                <legend className="mb-1 text-xl">Fields</legend>
                <div className="grid grid-cols-[repeat(auto-fill,_minmax(25rem,_1fr))] gap-x-8 gap-y-2">
                  {values.fields.length > 0 &&
                    values.fields.map((field, index) => (
                      <div className="py-2" key={index}>
                        <div className="flex gap-2">
                          <div className="flex flex-col gap-1">
                            <label htmlFor={`fields.${index}.name`}>Name</label>
                            <Field
                              id={`fields.${index}.name`}
                              name={`fields.${index}.name`}
                              type="text"
                              className={
                                touched.fields &&
                                touched.fields[index]?.name &&
                                errors.fields &&
                                errors.fields[index]
                                  ? "border border-red-600 p-1 h-9"
                                  : "border p-1 h-9"
                              }
                              placeholder="New Field"
                            />
                            <ErrorMessage
                              name={`fields.${index}.name`}
                              component="div"
                              className="text-red-600 text-xs"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label htmlFor={`fields.${index}.type`}>Type</label>
                            <Field
                              as="select"
                              name={`fields.${index}.type`}
                              id={`fields.${index}.type`}
                              className="bg-white border h-9 p-1"
                            >
                              <option value="text">Text</option>
                              <option value="number">Number</option>
                              <option value="boolean">Yes/No</option>
                              <option value="date">Date</option>
                            </Field>
                          </div>
                        </div>
                        <div className="flex gap-8 mt-1">
                          <div className="flex items-center gap-2">
                            <Field
                              id={`fields.${index}.required`}
                              type="checkbox"
                              className="accent-fuchsia-900"
                              name={`fields.${index}.required`}
                            />
                            <label htmlFor={`fields.${index}.required`}>
                              Required Field
                            </label>
                          </div>
                          <button
                            type="button"
                            className="underline underline-offset-3 text-red-900"
                            onClick={() => remove(index)}
                          >
                            Delete Field
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                <button
                  type="button"
                  onClick={() => push({ ...emptyField })}
                  className="bg-fuchsia-900 hover:bg-fuchsia-700 text-white p-0.5 w-32 rounded-md text-center mt-2"
                >
                  Add Field
                </button>
              </fieldset>
            )}
          </FieldArray>
          <button
            type="submit"
            className="bg-fuchsia-900 hover:bg-fuchsia-700 text-white p-0.5 w-32 rounded-md text-center mt-1"
          >
            Create Library
          </button>
        </Form>
      )}
    </Formik>
  );
}
