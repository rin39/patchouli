import { Library } from "../../types/common";
import NewEntryForm from "../form/NewEntryForm";

export type NewEntryModalProps = {
  library: Library;
  hideModal: () => void;
};

export default function NewEntryModal({
  library,
  hideModal,
}: NewEntryModalProps) {
  return (
    <div
      className="fixed top-0 left-0 bg-black/30 min-h-screen w-screen grid place-content-center"
      onClick={() => hideModal()}
    >
      <div className="bg-white w-72 p-5" onClick={(e) => e.stopPropagation()}>
        <NewEntryForm library={library} hideModal={hideModal} />
      </div>
    </div>
  );
}
