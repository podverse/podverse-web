import { getSelectedLabeledItemEnclosureAndSource, LabeledItemEnclosure } from "podverse-helpers";
import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { SourceSelectorRow } from "./SourceSelectorRow";
import { Divider } from "../Divider/Divider";
import { useMediaPlayer } from "../../contexts/MediaPlayer";
import { useModals } from "../../contexts/Modals";
import { showToastPromiseWithLoading } from "../Toast/Toast";
import { downloadAndSaveFile } from "../../utils/fileDownloader";
import styles from "../../styles/components/SourceSelectors/SourceSelectors.module.scss";

export type SourceSelectorActionType = "load-in-player" | "download-episode" | null;

type SourceSelectorsProps = {
  labeledItemEnclosures: LabeledItemEnclosure[];
  actionType: SourceSelectorActionType;
  itemTitle: string | null;
}

export const SourceSelectors = ({ labeledItemEnclosures, actionType, itemTitle }: SourceSelectorsProps ) => {
  const tFeatures = useTranslations("features");
  const { setMPEnclosureSelectedParams } = useMediaPlayer();
  const { setModalSourceSelector } = useModals();

  const onClick = (enclosureIndex: number, sourceIndex: number) => {
    const labeledItemEnclosure = labeledItemEnclosures[enclosureIndex];
    const source = labeledItemEnclosure.enclosure.item_enclosure_sources[sourceIndex];
    if (labeledItemEnclosure && source) {
      const mediaType = labeledItemEnclosure.mediaType;
      if (actionType === "load-in-player") {
        setMPEnclosureSelectedParams({
          type: mediaType,
          enclosureRowSelected: enclosureIndex,
          sourceRowSelected: sourceIndex
        });
      } else if (actionType === "download-episode") {
        const selectedItemEnclosureAndSource = getSelectedLabeledItemEnclosureAndSource({
          labeledItemEnclosures: labeledItemEnclosures,
          type: null,
          enclosureRowIndex: enclosureIndex,
          sourceRowIndex: sourceIndex
        });

        const selectedItemEnclosureUrl = selectedItemEnclosureAndSource.source?.uri;

        showToastPromiseWithLoading(
          downloadAndSaveFile(selectedItemEnclosureUrl, itemTitle || 'episode.mp3'),
          {
            loading: tFeatures("download.downloading_episode"),
            success: tFeatures("download.episode_downloaded"),
            error: tFeatures("download.download_error")
          }
        )
      }
    }

    setModalSourceSelector({
      labeledItemEnclosures: [],
      actionType: null,
      itemTitle: null
    });
  }

  return (
    <div className={styles.sourceSelectors}>
      {labeledItemEnclosures.map((labeledItemEnclosure, idx) => (
        <Fragment key={idx}>
          <SourceSelectorRow
            labeledItemEnclosure={labeledItemEnclosure}
            labeledItemEnclosureIndex={idx}
            onClick={onClick}
          />
          {idx < labeledItemEnclosures.length - 1 && <Divider className={styles.divider} />}
        </Fragment>
      ))}
    </div>
  )
}
