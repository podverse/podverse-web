import { DTOChannelPerson, DTOItemPerson } from "podverse-helpers";
import { ContentAboutDescription } from "./ContentAboutDescription";
import { ContentAboutHeader } from "./ContentAboutHeader";
import Accordion from "../../Accordian/Accordian";
import { ContentPeopleRows } from "./ContentPeopleRows";
import styles from "../../../styles/components/Content/About/ContentAboutAccordion.module.scss";

type ContentAboutAccordion = {
  defaultOpen?: boolean;
  description?: string;
  channel_persons?: DTOChannelPerson[];
  item_persons?: DTOItemPerson[];
}

export const ContentAboutAccordion = ({ defaultOpen, description, channel_persons, item_persons }: ContentAboutAccordion) => {
  const content = (
    <div className={styles.wrapper}>
      <ContentAboutDescription description={description} />
      <ContentPeopleRows channel_persons={channel_persons} item_persons={item_persons} />
    </div>
  )

  return (
    <Accordion
      header={<ContentAboutHeader />}
      content={content}
      open={defaultOpen}
      contentClass={styles.content}
    />
  )
}
