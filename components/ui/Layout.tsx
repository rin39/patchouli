import Link from "next/link";
import AppHead from "@/components/util/AppHead";
import UserInfo from "@/components/ui/UserInfo";

type LayoutProps = {
  title?: string;
} & React.PropsWithChildren;

export default function Layout({ children, title }: LayoutProps) {
  return (
    <>
      <AppHead title={title} />
      <header className="flex justify-between items-center p-3 ">
        <Link href="/dashboard" className="text-xl text-fuchsia-900">
          Patchouli
        </Link>
        <UserInfo />
      </header>
      <main className="p-3">{children}</main>
    </>
  );
}
