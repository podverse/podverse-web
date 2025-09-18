import { DTOPodroll } from "podverse-helpers"
import Accordion from "../../Accordian/Accordian";
import { ContentPodrollHeader } from "./ContentPodrollHeader";
import { ContentPodrollRows } from "./ContentPodrollRows";
import styles from "../../../styles/components/Content/Podroll/ContentPodrollAccordion.module.scss";

type ContentPodrollAccordionProps = {
  podroll: DTOPodroll;
  defaultOpen?: boolean;
}

export const ContentPodrollAccordion: React.FC<ContentPodrollAccordionProps> = ({ podroll, defaultOpen }) => {
  return (
    <Accordion
      contentClass={styles.accordion}
      header={<ContentPodrollHeader />}
      content={<ContentPodrollRows podroll={podroll} />}
      open={defaultOpen}
    />
  )
}
