import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ZodError } from "zod";
import { createItemValidationObject } from "@/lib/validation";
import { NewItemModalProps } from "@/components/ui/NewItemModal";
import { removeEmptyObjectProperties } from "@/lib/util";
import { Item } from "@/types/common";

type NewItemFormProps = NewItemModalProps;

export default function NewItemForm({ library, hideModal }: NewItemFormProps) {
  const queryClient = useQueryClient();

  const initial = library.fields.reduce((a: Item, field) => {
    if (field.type === "boolean") {
      a[field.name] = false;
    } else {
      a[field.name] = "";
    }
    return a;
  }, {});

  return (
    <Formik
      initialValues={initial}
      validate={(values) => {
        const validationObject = createItemValidationObject(library);
        const newItem = removeEmptyObjectProperties(values);

        try {
          validationObject.parse(newItem);
        } catch (e) {
          if (e instanceof ZodError) {
            return e.formErrors.fieldErrors;
          }
        }
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const newItem = removeEmptyObjectProperties(values);
        await axios.post(`/api/libraries/${library._id}/items`, newItem);

        queryClient.invalidateQueries({ queryKey: ["items", library._id] });

        setSubmitting(false);
        hideModal();
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="flex flex-col gap-3">
          {library.fields.map((field) => {
            return (
              <div key={field.name} className="flex flex-col gap-1">
                <label htmlFor={field.name}>{field.name}</label>
                <Field
                  type={field.type === "boolean" ? "checkbox" : field.type}
                  name={field.name}
                  id={field.name}
                  className={
                    touched[field.name] && errors[field.name]
                      ? "border border-red-600 p-1"
                      : "border p-1"
                  }
                />
                <ErrorMessage
                  name={field.name}
                  className="text-red-600 text-xs"
                  component="div"
                />
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
