import { Formik, Form, Field, ErrorMessage } from "formik";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignupForm() {
  const router = useRouter();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (!res?.ok) {
          setStatus(res?.error);
          setSubmitting(false);
        } else {
          return router.replace("/dashboard");
        }
      }}
    >
      {({ isSubmitting, status }) => (
        <Form className="flex flex-col gap-3 mb-3">
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
            Log In
          </button>
          {status && <div className="text-red-600 text-center">{status}</div>}
        </Form>
      )}
    </Formik>
  );
}
