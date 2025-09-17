import { DTOChannelPerson, DTOItemPerson } from "podverse-helpers";
import Accordion from "../../Accordian/Accordian";
import styles from "../../../styles/components/Content/People/ContentPeople.module.scss";
import { ContentPeopleHeader } from "./ContentPeopleHeader";

type ContentPeople = {
  defaultOpen?: boolean;
  channel_persons?: DTOChannelPerson[];
  item_persons?: DTOItemPerson[];
}

export const ContentPeople = ({ defaultOpen, channel_persons, item_persons }: ContentPeople) => {

  console.log('channel_persons', channel_persons);
  console.log('item_persons', item_persons);

  return (
    <Accordion
      header={<ContentPeopleHeader />}
      items={<p>hello</p>}
      open={defaultOpen}
    />
  )
}
