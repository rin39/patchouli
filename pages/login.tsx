import Link from "next/link";
import LoginForm from "../components/form/LoginForm";
import AppHead from "../components/util/AppHead";

export default function Login() {
  return (
    <>
      <AppHead title="Log In" />
      <main className="grid h-screen place-items-center">
        <section>
          <LoginForm />
          <div className="text-center">
            Do not have an account?{" "}
            <Link
              href="/signup"
              className="text-fuchsia-900 underline text-center"
            >
              Sign Up
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
