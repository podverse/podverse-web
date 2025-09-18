import { DTOPodroll } from "podverse-helpers"
import Accordion from "../../Accordian/Accordian";
import { ContentPodrollHeader } from "./ContentPodrollHeader";
import styles from "../../../styles/components/Content/Podroll/ContentPodroll.module.scss";
import { ContentPodrollChannelRow } from "./ContentPodrollChannelRow";
import { ContentPodrollItemRow } from "./ContentPodrollItemRow";

type ContentPodrollProps = {
  podroll: DTOPodroll;
}

export const ContentPodrollRows = ({ podroll }: ContentPodrollProps) => {
  const podrollChannelNodes = podroll.podrollChannels?.map((podrollChannel) => {
    return (
      <ContentPodrollChannelRow key={podrollChannel.id} channel={podrollChannel} />
    )
  })

  const podrollItemNodes = podroll.podrollItems?.map((podrollItem) => {
    return (
      <ContentPodrollItemRow key={podrollItem.id} item={podrollItem} />
    )
  })
  
  return (
    <div className={styles.rows}>
      {podrollChannelNodes}
      {podrollItemNodes}
    </div>
  );
}
