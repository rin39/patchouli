import { GetServerSideProps } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth/next";
import Link from "next/link";
import { useState } from "react";
import Layout from "../components/ui/Layout";
import { getLibraries } from "../services/libraries";
import { Library } from "../types/validation";
import { authOptions } from "./api/auth/[...nextauth]";

type DashboardProps = {
  libraries: Library[];
};

export default function Dashboard({ libraries }: DashboardProps) {
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);

  return (
    <Layout title="Dashboard">
      <div className="flex">
        <aside className="w-32">
          <ul>
            {libraries.map((library) => (
              <li key={library._id}>
                <button
                  className="w-full text-left"
                  onClick={() => setSelectedLibrary(library)}
                >
                  {library.name}
                </button>
              </li>
            ))}
          </ul>
          <Link
            href="/libraries/new"
            className="bg-fuchsia-900 hover:bg-fuchsia-700 text-white p-0.5 rounded-md w-full block text-center"
          >
            Add New
          </Link>
        </aside>
        <section className="flex grow">
          {selectedLibrary && (
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  {selectedLibrary.fields.map((field, index) => (
                    <th key={index}>{field.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          )}
        </section>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const libraries = await getLibraries(session?.user?.id);

  return {
    props: {
      libraries,
    },
  };
};
