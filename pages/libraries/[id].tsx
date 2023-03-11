import { GetServerSideProps } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth/next";
import { authOptions } from "@/api/auth/[...nextauth]";
import { getItems } from "@/services/items";
import Layout from "@/components/ui/Layout";
import { InferGetServerSidePropsType } from "next";
import { Item, Library } from "@/types/common";
import { getLibrary } from "@/services/libraries";
import DataGrid from "@/components/ui/DataGrid";

type Data = {
  items: Item[];
  library: Library;
};

export default function LibraryPage({
  items,
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
  const items = await getItems(libraryId as string, session.user.id);
  const library = await getLibrary(libraryId as string);

  return {
    props: {
      items,
      library,
    },
  };
};
