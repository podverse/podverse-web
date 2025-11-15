import { useTranslations } from "next-intl";
import { Modal } from "./Modal";
import { useModals } from "../../contexts/Modals";
import { SourceSelectors } from "../SourceSelectors/SourceSelectors";

export const ModalSourceSelector: React.FC = () => {
  const tMediaPlayer = useTranslations("media_player");
  const { modalSourceSelector, setModalSourceSelector } = useModals();

  const isOpen = modalSourceSelector.labeledItemEnclosures.length > 0;

  return (
    <Modal
      header={tMediaPlayer("source.select_source")}
      isOpen={isOpen}
      onClose={() => setModalSourceSelector({ labeledItemEnclosures: [], actionType: null })}
      ariaLabel={tMediaPlayer("source.select_source")}
      modalContentMaxWidth={500}>
      <SourceSelectors
        labeledItemEnclosures={modalSourceSelector.labeledItemEnclosures}
        actionType={modalSourceSelector.actionType}
      />
    </Modal>
  );
}
