import { LabeledItemEnclosure } from "podverse-helpers";
import { Fragment } from "react";
import { SourceSelectorRow } from "./SourceSelectorRow";
import { Divider } from "../Divider/Divider";
import { useMediaPlayer } from "../../contexts/MediaPlayer";
import { useModals } from "../../contexts/Modals";
import styles from "../../styles/components/SourceSelectors/SourceSelectors.module.scss";

export type SourceSelectorActionType = "load-in-player" | null;

type SourceSelectorsProps = {
  labeledItemEnclosures: LabeledItemEnclosure[];
  actionType: SourceSelectorActionType;
}

export const SourceSelectors = ({ labeledItemEnclosures, actionType }: SourceSelectorsProps ) => {
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
      } else {
        console.log("SourceSelectors onClick with no actionType");
      }
      
      setModalSourceSelector({
        labeledItemEnclosures: [],
        actionType: null
      })
    }
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
