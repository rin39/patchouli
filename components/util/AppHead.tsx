import Head from "next/head";

type AppHeadProps = {
  title?: string;
};

export default function AppHead({ title }: AppHeadProps) {
  let pageTitle = "Patchouli";
  if (title) pageTitle = `Patchouli - ${title}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content="Library management application" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
