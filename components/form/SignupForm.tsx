import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/router";
import { z, ZodError } from "zod";
import { Data as ResponseData } from "../../pages/api/auth/signup";

const SignupBody = z.object({
  username: z
    .string()
    .trim()
    .min(2, "Username must contain at least 2 characters"),
  email: z.string().trim().email(),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export default function SignupForm() {
  const router = useRouter();

  return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      validate={(values) => {
        try {
          SignupBody.parse(values);
        } catch (e) {
          if (e instanceof ZodError) {
            return e.formErrors.fieldErrors;
          }
        }
      }}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        setStatus(null);
        try {
          await axios.post<ResponseData>("/api/auth/signup", {
            username: values.username,
            email: values.email,
            password: values.password,
          });
          setSubmitting(false);
          // return router.replace("/login");
        } catch (e) {
          if (axios.isAxiosError(e)) {
            setStatus(e.response?.data.message);
          }
        }
      }}
    >
      {({ isSubmitting, errors, status, touched }) => (
        <Form className="flex flex-col gap-3 mb-3" noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="username">Username</label>
            <Field
              id="username"
              type="text"
              name="username"
              className={
                touched.username && errors.username
                  ? "border border-red-600 p-1"
                  : "border p-1"
              }
            />
            <ErrorMessage
              name="username"
              component="div"
              className="text-red-600 text-xs"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <Field
              id="email"
              type="email"
              name="email"
              className={
                touched.email && errors.email
                  ? "border border-red-600 p-1"
                  : "border p-1"
              }
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-600 text-xs"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <Field
              id="password"
              type="password"
              name="password"
              className={
                touched.password && errors.password
                  ? "border border-red-600 p-1"
                  : "border p-1"
              }
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-600 text-xs"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-fuchsia-900 hover:bg-fuchsia-700 text-white p-2 rounded-md w-32 mx-auto"
          >
            Sign Up
          </button>
          {status && <div className="text-red-600">{status}</div>}
        </Form>
      )}
    </Formik>
  );
}
