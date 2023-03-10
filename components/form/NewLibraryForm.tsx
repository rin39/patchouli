import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { ZodError } from "zod";
import axios from "axios";
import { LibrarySchema as FormSchema } from "@/lib/validation";
import { LibraryField } from "@/types/common";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

type FormErrors = {
  name?: string;
  fields?: {
    name?: string;
    type?: string;
    required?: string;
  }[];
  fieldsArray?: string;
};

type ApiResponseData = {
  message: string;
  id: string;
};

const emptyField: LibraryField = {
  name: "",
  type: "text",
  required: false,
};

export default function NewLibraryForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <Formik
      initialValues={{
        name: "",
        fields: [{ ...emptyField, required: true }],
      }}
      validate={(values) => {
        const errors: FormErrors = {};
        errors.fields = [];

        try {
          FormSchema.parse(values);
        } catch (e) {
          if (e instanceof ZodError) {
            for (let error of e.errors) {
              if (error.path[0] === "name") {
                errors.name = error.message;
              } else if (error.path[0] === "fields") {
                if (typeof error.path[1] === "number") {
                  const index = error.path[1];
                  errors.fields[index] = {
                    name: error.message,
                  };
                } else {
                  errors.fieldsArray = error.message;
                }
              }
            }
          }
        }

        if (!errors.fields.length) delete errors.fields;

        return errors;
      }}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        try {
          const { data } = await axios.post<ApiResponseData>(
            "/api/libraries",
            values
          );
          queryClient.invalidateQueries({ queryKey: ["libraries"] });
          router.push(`/libraries/${data.id}`);
        } catch (e) {
          setStatus("Failed to create library");
          setSubmitting(false);
        }
      }}
    >
      {({ values, touched, errors, isSubmitting, status }) => (
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
                          {values.fields.length > 1 && (
                            <button
                              type="button"
                              className="underline underline-offset-3 text-red-900"
                              onClick={() => remove(index)}
                            >
                              Delete Field
                            </button>
                          )}
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
            disabled={isSubmitting}
          >
            Create Library
          </button>
          {(errors as FormErrors).fieldsArray && (
            <div className="text-red-600 mt-2">
              {(errors as FormErrors).fieldsArray}
            </div>
          )}
          {status && <div className="text-red-600 mt-2">{status}</div>}
        </Form>
      )}
    </Formik>
  );
}
