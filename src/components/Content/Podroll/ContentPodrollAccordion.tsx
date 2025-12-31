import { RemoteItemsResponse } from "podverse-helpers"
import Accordion from "../../Accordian/Accordian";
import { ContentPodrollHeader } from "./ContentPodrollHeader";
import { ContentPodrollRows } from "./ContentPodrollRows";
import styles from "../../../styles/components/Content/Podroll/ContentPodrollAccordion.module.scss";

type ContentPodrollAccordionProps = {
  remoteItemsResponse: RemoteItemsResponse;
  defaultOpen?: boolean;
}

export const ContentPodrollAccordion: React.FC<ContentPodrollAccordionProps> = ({
  remoteItemsResponse, defaultOpen }) => {
  return (
    <Accordion
      contentClass={styles.accordion}
      header={<ContentPodrollHeader />}
      content={<ContentPodrollRows remoteItemsResponse={remoteItemsResponse} />}
      open={defaultOpen}
    />
  )
}
