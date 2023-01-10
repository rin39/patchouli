import Link from "next/link";
import AppHead from "../components/util/AppHead";

export default function Home() {
  return (
    <>
      <AppHead />
      <main className="grid h-screen place-items-center">
        <div className="text-center">
          <h1 className="text-6xl mb-5 text-fuchsia-900">Patchouli</h1>
          <p className="mb-5">
            Manage your library of{" "}
            <span className="text-fuchsia-900">any content</span> today
          </p>
          <div className="flex justify-evenly">
            <Link
              href="/signup"
              className="bg-fuchsia-900 hover:bg-fuchsia-700 text-white p-2 rounded-md w-32"
            >
              Get Started
            </Link>
            <Link
              className="bg-neutral-100 hover:bg-neutral-50 p-2 rounded-md w-32"
              href="/login"
            >
              Log In
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
