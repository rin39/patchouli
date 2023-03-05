import { Library } from "../../types/common";
import NewItemForm from "../form/NewItemForm";

export type NewItemModalProps = {
  library: Library;
  hideModal: () => void;
};

export default function NewItemModal({
  library,
  hideModal,
}: NewItemModalProps) {
  return (
    <div
      className="fixed top-0 left-0 bg-black/30 min-h-screen w-screen grid place-content-center"
      onClick={() => hideModal()}
    >
      <div className="bg-white w-72 p-5" onClick={(e) => e.stopPropagation()}>
        <NewItemForm library={library} hideModal={hideModal} />
      </div>
    </div>
  );
}
