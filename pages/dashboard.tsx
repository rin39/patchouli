import UserInfo from "../components/ui/UserInfo";
import AppHead from "../components/util/AppHead";

export default function Dashboard() {
  return (
    <>
      <AppHead title="Dashboard" />
      <header className="flex justify-between items-center p-3 ">
        <div className="text-xl text-fuchsia-900">Patchouli</div>
        <UserInfo />
      </header>
      <main className="p-3">
        <aside>
          <div>Libraries</div>
          <button className="bg-fuchsia-900 hover:bg-fuchsia-700 text-white p-1 rounded-md w-24">
            Add New
          </button>
        </aside>
        <section></section>
      </main>
    </>
  );
}
