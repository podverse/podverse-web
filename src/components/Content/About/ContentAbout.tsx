import { DTOChannelPerson, DTOItemPerson } from "podverse-helpers";
import { ContentAboutAccordion } from "./ContentAboutAccordion";
import { ContentAboutDescription } from "./ContentAboutDescription";
import { ContentPeopleRows } from "./ContentPeopleRows";
import styles from "../../../styles/components/Content/About/ContentAbout.module.scss";

type ContentAbout = {
  description?: string;
  channel_persons?: DTOChannelPerson[];
  item_persons?: DTOItemPerson[];
  defaultOpen?: boolean;
  isAccordion?: boolean;
}

export const ContentAbout = ({ description, channel_persons, item_persons, defaultOpen, isAccordion }: ContentAbout) => {
  if (isAccordion) {
    return (
      <ContentAboutAccordion
        description={description}
        channel_persons={channel_persons}
        item_persons={item_persons}
        defaultOpen={defaultOpen}
      />
    )
  } else {
    return (
      <div className={styles.listView}>
        <ContentAboutDescription description={description} />
        <ContentPeopleRows
          channel_persons={channel_persons}
          item_persons={item_persons}
        />
      </div>
    )
  }
}
