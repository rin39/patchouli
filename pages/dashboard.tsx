import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth/next";
import { useState } from "react";
import Aside from "../components/ui/Aside";
import DataGrid from "../components/ui/DataGrid";
import FetchingPlaceholder from "../components/ui/FetchingPlaceholder";
import Layout from "../components/ui/Layout";
import useLocalStorage from "../hooks/useLocalStorage";
import { getLibraries } from "../services/libraries";
import { Library } from "../types/common";
import { authOptions } from "./api/auth/[...nextauth]";

type DashboardProps = {
  libraries: Library[];
};

export default function Dashboard({ libraries }: DashboardProps) {
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const lastSelectedLibrary = useLocalStorage("dashboard.lastSelectedLibrary");

  const { fetchStatus } = useQuery({
    queryKey: ["lastSelectedLibrary"],
    queryFn: () => {
      return axios.get(`/api/libraries/${lastSelectedLibrary}`);
    },
    enabled: !!lastSelectedLibrary,
    refetchOnWindowFocus: false,
    onSuccess: (data) => setSelectedLibrary(data.data.library),
    onError: () => setSelectedLibrary(null),
  });

  return (
    <Layout title="Dashboard">
      <div className="flex gap-5">
        <Aside
          libraries={libraries}
          selectedLibrary={selectedLibrary}
          setSelectedLibrary={setSelectedLibrary}
        />
        {lastSelectedLibrary !== undefined && (
          <section className="grow">
            {selectedLibrary ? (
              <DataGrid selectedLibrary={selectedLibrary} />
            ) : (
              <>
                {fetchStatus === "fetching" ? (
                  <FetchingPlaceholder />
                ) : (
                  <div>No library selected</div>
                )}
              </>
            )}
          </section>
        )}
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
