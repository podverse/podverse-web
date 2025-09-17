import { DTOChannelPerson, DTOItemPerson } from "podverse-helpers";
import Accordion from "../../Accordian/Accordian";
import styles from "../../../styles/components/Content/People/ContentPeople.module.scss";
import { ContentPeopleHeader } from "./ContentPeopleHeader";
import { ContentPeopleRow } from "./ContentPeopleRow";

type ContentPeople = {
  defaultOpen?: boolean;
  channel_persons?: DTOChannelPerson[];
  item_persons?: DTOItemPerson[];
}

export const ContentPeople = ({ defaultOpen, channel_persons, item_persons }: ContentPeople) => {
  let content = [];
  if (item_persons && item_persons.length > 0) {
    for (const item_person of item_persons) {
      content.push(
        <ContentPeopleRow key={item_person.id} item_person={item_person} />
      );
    }
  } else if (channel_persons && channel_persons.length > 0) {
    for (const channel_person of channel_persons) {
      content.push(
        <ContentPeopleRow key={channel_person.id} channel_person={channel_person} />
      );
    }
  }

  return (
    <Accordion
      header={<ContentPeopleHeader />}
      content={content}
      open={defaultOpen}
      contentClass={styles.content}
    />
  )
}
