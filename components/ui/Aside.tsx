import Link from "next/link";
import { Library } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";

type ApiResponse = {
  libraries: Library[];
};

export default function Aside() {
  const router = useRouter();
  const isDashboard = router.pathname === "/dashboard";
  const isLibrary = router.pathname === "/libraries/[id]";

  const { data: libraries, isSuccess } = useQuery({
    queryKey: ["libraries"],
    queryFn: async () => {
      return axios
        .get<ApiResponse>("/api/libraries")
        .then((res) => res.data.libraries);
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return (
    <aside className="w-32">
      <ul>
        <li
          className={`hover:text-fuchsia-700 mb-1 ${
            isDashboard && "text-fuchsia-900"
          }`}
        >
          <Link href="/dashboard" className="inline-block w-full text-left">
            Dashboard
          </Link>
        </li>
        {isSuccess &&
          libraries.map((library) => (
            <li
              key={library._id}
              className={`hover:text-fuchsia-700 mb-1 ${
                isLibrary &&
                router.query.id === library._id &&
                "text-fuchsia-900"
              }`}
            >
              <Link
                href={`/libraries/${library._id}`}
                className="inline-block w-full text-left"
              >
                {library.name}
              </Link>
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
  );
}
