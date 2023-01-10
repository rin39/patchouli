import Head from "next/head";

type AppHeadProps = {
  title?: string;
};

export default function AppHead({ title }: AppHeadProps) {
  return (
    <Head>
      {title ? <title>Patchouli - {title}</title> : <title>Patchouli</title>}
      <meta name="description" content="Library management application" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
