import { buildLabeledItemEnclosures, DTOItem, getSelectedLabeledItemEnclosureAndSource } from "podverse-helpers";
import { ModalSourceSelector } from "../../contexts/Modals";

type DownloadTrackWithModalParams = {
  item: DTOItem;
  setModalSourceSelector: (val: ModalSourceSelector) => void;
  showToastPromiseWithLoading: (promise: Promise<any>, messages: {
    loading: string;
    success: string;
    error: string;
  }) => void;
  downloadAndSaveFile: (url: string, filename: string) => Promise<void>;
  tFeatures: (key: string) => string;
};

export const downloadTrackWithModal = async ({
  item,
  setModalSourceSelector,
  showToastPromiseWithLoading,
  downloadAndSaveFile,
  tFeatures
}: DownloadTrackWithModalParams) => {
  const labeledItemEnclosures = buildLabeledItemEnclosures(item.item_enclosures);
  const hasMultipleEnclosures = labeledItemEnclosures && labeledItemEnclosures.length > 1;

  if (hasMultipleEnclosures) {
    setModalSourceSelector({
      labeledItemEnclosures: labeledItemEnclosures,
      actionType: 'download-track',
      itemTitle: item.title || null
    });
    return;
  } else {
    const selected = getSelectedLabeledItemEnclosureAndSource({
      labeledItemEnclosures: labeledItemEnclosures,
      type: "default",
      enclosureRowIndex: null,
      sourceRowIndex: null
    });
    if (selected?.source?.uri) {
      showToastPromiseWithLoading(
        downloadAndSaveFile(selected.source.uri, item.title || 'track.mp3'),
        {
          loading: tFeatures("download.downloading_track"),
          success: tFeatures("download.track_downloaded"),
          error: tFeatures("download.track_download_error")
        }
      )
    }
  }
}
