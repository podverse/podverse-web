import { RemoteItemsResponse } from "podverse-helpers"
import { ContentPodrollAccordion } from "./ContentPodrollAccordion";
import { ContentPodrollRows } from "./ContentPodrollRows";
import styles from "../../../styles/components/Content/Podroll/ContentPodroll.module.scss";

type ContentPodrollProps = {
  remoteItemsResponse: RemoteItemsResponse | null;
  defaultOpen?: boolean;
  isAccordion?: boolean;
}

export const ContentPodroll = ({ remoteItemsResponse, defaultOpen, isAccordion }: ContentPodrollProps) => {
  if (!remoteItemsResponse) {
    return null;
  }

  if (
    remoteItemsResponse.channelsAdded.length === 0
    && remoteItemsResponse.channelsUnadded.length === 0
    && remoteItemsResponse.itemsAdded.length === 0
    && remoteItemsResponse.itemsUnadded && remoteItemsResponse.itemsUnadded.length === 0
  ) {
    return null;
  }
  
  if (isAccordion) {
    return (
      <ContentPodrollAccordion
        remoteItemsResponse={remoteItemsResponse}
        defaultOpen={defaultOpen}
      />
    )
  } else {
    return (
      <div className={styles.listView}>
        <ContentPodrollRows remoteItemsResponse={remoteItemsResponse} />
      </div>
    );
  }
}
