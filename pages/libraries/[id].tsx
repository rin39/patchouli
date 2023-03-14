import { GetServerSideProps } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth/next";
import { authOptions } from "@/api/auth/[...nextauth]";
import Layout from "@/components/ui/Layout";
import { InferGetServerSidePropsType } from "next";
import { Library } from "@/types/common";
import { getLibrary } from "@/services/libraries";
import DataGrid from "@/components/ui/DataGrid";

type Data = {
  library: Library;
};

export default function LibraryPage({
  library,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout title={library.name}>
      <DataGrid selectedLibrary={library} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Data> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const libraryId = context.query.id;
  const library = await getLibrary(libraryId as string);

  return {
    props: {
      library,
    },
  };
};
