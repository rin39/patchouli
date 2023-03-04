import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { ZodError } from "zod";
import axios from "axios";
import { LibrarySchema as FormSchema } from "../../lib/validation";

type FormErrors = {
  name: string;
  fields: {
    name?: string;
    type?: string;
  }[];
};

export default function NewLibraryForm() {
  return (
    <Formik
      initialValues={{ name: "", fields: [{ name: "", type: "text" }] }}
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
                  name: "Required",
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
            <label htmlFor="name">Name</label>
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
            {({ insert, remove, push }) => (
              <fieldset className="mt-1">
                <legend>Fields</legend>
                {values.fields.length > 0 &&
                  values.fields.map((field, index) => (
                    <div className="mt-2 items-start" key={index}>
                      <div className="flex gap-1">
                        <div className="flex flex-col">
                          <label htmlFor={`fields.${index}.name`}>Name</label>
                          <Field
                            id={`fields.${index}.name`}
                            name={`fields.${index}.name`}
                            type="text"
                            className={
                              touched.fields &&
                              touched.fields[index] &&
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
                        <div className="flex flex-col">
                          <label htmlFor={`fields.${index}.type`}>Type</label>
                          <Field
                            as="select"
                            name={`fields.${index}.type`}
                            id={`fields.${index}.type`}
                            className="bg-white p-1 h-9 border"
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="boolean">Yes/No</option>
                            <option value="date">Date</option>
                          </Field>
                        </div>
                        <button
                          type="button"
                          className="border p-1 h-9 mt-6"
                          onClick={() => remove(index)}
                        >
                          x
                        </button>
                      </div>
                    </div>
                  ))}
                <button
                  type="button"
                  className="secondary"
                  onClick={() => push({ name: "", type: "text" })}
                >
                  Add Field
                </button>
              </fieldset>
            )}
          </FieldArray>
          <button type="submit">OK</button>
        </Form>
      )}
    </Formik>
  );
}
