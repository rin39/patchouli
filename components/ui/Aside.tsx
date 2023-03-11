import Link from "next/link";
import { SetStateAction } from "react";
import { Library } from "@/types/common";

type AsideProps = {
  libraries: Library[];
  selectedLibrary: Library | null;
  setSelectedLibrary: (value: SetStateAction<Library | null>) => void;
};

export default function Aside({
  libraries,
  selectedLibrary,
  setSelectedLibrary,
}: AsideProps) {
  const onLibraryClick = (library: Library) => {
    setSelectedLibrary(library);
    localStorage.setItem("dashboard.lastSelectedLibrary", library._id);
  };

  return (
    <aside className="w-32">
      <ul>
        {libraries.map((library) => (
          <li
            key={library._id}
            className={`hover:text-fuchsia-700 mb-1 ${
              selectedLibrary?._id === library._id && "text-fuchsia-900"
            }`}
          >
            <button
              className="w-full text-left"
              onClick={() => onLibraryClick(library)}
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
  );
}
