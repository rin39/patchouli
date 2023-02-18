import NewLibraryForm from "../../../components/form/NewLibraryForm";
import Layout from "../../../components/ui/Layout";

export default function NewLibraryPage() {
  return (
    <Layout title="New Library">
      <div className="flex flex-col items-center">
        <NewLibraryForm />
      </div>
    </Layout>
  );
}
