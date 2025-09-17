import { stripAndDecodeHtml } from "podverse-helpers";
import { ContentAboutHeader } from "./ContentAboutHeader";
import Accordion from "../../Accordian/Accordian";
import styles from "../../../styles/components/Content/About/ContentAbout.module.scss";

type ContentAbout = {
  defaultOpen: boolean;
  description?: string;
}

export const ContentAbout = ({ defaultOpen, description }: ContentAbout) => {
  const cleanedDescription = description ? stripAndDecodeHtml(description) : "";

  const contentNode = (
    <p className={styles.description}>{cleanedDescription}</p>
  )

  return (
    <Accordion
      header={<ContentAboutHeader />}
      items={contentNode}
      open={defaultOpen}
    />
  )
}
