import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ZodError } from "zod";
import { createItemValidationObject } from "../../lib/validation";
import { NewItemModalProps } from "../ui/NewItemModal";

type NewItemFormProps = NewItemModalProps;

export default function NewItemForm({ library, hideModal }: NewItemFormProps) {
  const queryClient = useQueryClient();

  const initial = library.fields.reduce((a: { [x: string]: string }, c) => {
    const field = c.name;
    a[field] = "";
    return a;
  }, {});

  return (
    <Formik
      initialValues={initial}
      validate={(values) => {
        const validationObject = createItemValidationObject(library);

        try {
          validationObject.parse(values);
        } catch (e) {
          if (e instanceof ZodError) {
            return e.formErrors.fieldErrors;
          }
        }
      }}
      onSubmit={async (values, { setSubmitting }) => {
        await axios.post(`/api/libraries/${library._id}/items`, values);
        setSubmitting(false);
        queryClient.invalidateQueries({ queryKey: ["items", library._id] });
        hideModal();
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-3">
          {library.fields.map((field) => {
            return (
              <div key={field.name} className="flex flex-col">
                <label htmlFor={field.name}>{field.name}</label>
                <Field
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  className="bg-white p-1 h-9 border"
                />
                <ErrorMessage name={field.name} component="div" />
              </div>
            );
          })}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-fuchsia-900 hover:bg-fuchsia-700 text-white p-0.5 rounded-md block text-center px-3"
            >
              Add
            </button>
            <button
              type="button"
              className="bg-fuchsia-900 hover:bg-fuchsia-700 text-white p-0.5 rounded-md block text-center px-3"
              onClick={() => hideModal()}
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
