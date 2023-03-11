import Link from "next/link";
import SignupForm from "@/components/form/SignupForm";
import AppHead from "@/components/util/AppHead";

export default function Signup() {
  return (
    <>
      <AppHead title="Sign Up" />
      <main className="grid h-screen place-items-center">
        <section>
          <SignupForm />
          <div className="text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-fuchsia-900 underline text-center"
            >
              Log In
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
