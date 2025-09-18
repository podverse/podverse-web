import { DTOPodroll } from "podverse-helpers"
import { ContentPodrollAccordion } from "./ContentPodrollAccordion";
import { ContentPodrollRows } from "./ContentPodrollRows";
import styles from "../../../styles/components/Content/Podroll/ContentPodroll.module.scss";

type ContentPodrollProps = {
  podroll?: DTOPodroll | null;
  defaultOpen?: boolean;
  isAccordion?: boolean;
}

export const ContentPodroll = ({ podroll, defaultOpen, isAccordion }: ContentPodrollProps) => {
  if (!podroll) {
    return null;
  }

  if (podroll.podrollChannels.length === 0 && podroll.podrollItems.length === 0) {
    return null;
  }
  
  if (isAccordion) {
    return (
      <ContentPodrollAccordion
        podroll={podroll}
        defaultOpen={defaultOpen}
      />
    )
  } else {
    return (
      <div className={styles.listView}>
        <ContentPodrollRows podroll={podroll} />
      </div>
    );
  }
}
