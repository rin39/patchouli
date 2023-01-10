import { Formik, Form, Field, ErrorMessage } from "formik";

export default function SignupForm() {
  return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-3 mb-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <Field
              id="username"
              type="text"
              name="username"
              className="border p-1"
            />
            <ErrorMessage name="email" component="div" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <Field
              id="email"
              type="email"
              name="email"
              className="border p-1"
            />
            <ErrorMessage name="email" component="div" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <Field
              id="password"
              type="password"
              name="password"
              className="border p-1"
            />
            <ErrorMessage name="password" component="div" />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-fuchsia-900 hover:bg-fuchsia-700 text-white p-2 rounded-md w-32 mx-auto"
          >
            Sign Up
          </button>
        </Form>
      )}
    </Formik>
  );
}
