import { DTOChannelPerson, DTOItemPerson } from "podverse-helpers";
import { ContentPeopleRow } from "./ContentPeopleRow";
import styles from '../../../styles/components/Content/About/ContentPeopleRows.module.scss';

type ContentPeopleRowsProps = {
  channel_persons?: DTOChannelPerson[];
  item_persons?: DTOItemPerson[];
}

export const ContentPeopleRows = ({ channel_persons, item_persons }: ContentPeopleRowsProps) => {
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
    <div className={styles.rows}>
      {content}
    </div>
  );
}
