import { LabeledItemEnclosure } from "podverse-helpers";
import { useEnclosureLabel } from "../../utils/itemEnclosure";
import Link from "../Link/Link";
import styles from "../../styles/components/SourceSelectors/SourceSelectorRow.module.scss";

type SourceSelectorRowProps = {
  labeledItemEnclosure: LabeledItemEnclosure
  labeledItemEnclosureIndex: number;
  onClick: (enclosureIndex: number, sourceIndex: number) => void
}

export const SourceSelectorRow = ({ labeledItemEnclosure,
  labeledItemEnclosureIndex, onClick }: SourceSelectorRowProps) => {
  const enclosureLabel = useEnclosureLabel(labeledItemEnclosure);

  if (!labeledItemEnclosure) {
    return null;
  }

  const sources = labeledItemEnclosure.enclosure.item_enclosure_sources || [];
  const nodes = [];

  for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
    const source = sources[sourceIndex];
    nodes.push(
      <Link
        key={`source-${sourceIndex}`}
        className={styles.sourceSelectorRow}
        onClick={() => onClick(labeledItemEnclosureIndex, sourceIndex)}
      >
        <div className={styles.textWrapper}>
          {
            labeledItemEnclosure.enclosure.title && (
              <div className={styles.enclosureLabel}>
                {labeledItemEnclosure.enclosure.title}
              </div>
            )
          }
          <div className={styles.enclosureLabel}>
            {
              !labeledItemEnclosure.enclosure.title && (
                enclosureLabel
              )
            }
          </div>
          <div className={styles.sourceUri}>
            {source.uri}
          </div>
        </div>
      </Link>
    );
  }

  return nodes;
}
