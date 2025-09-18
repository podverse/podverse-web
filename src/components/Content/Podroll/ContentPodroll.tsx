import { DTOPodroll } from "podverse-helpers"
import Accordion from "../../Accordian/Accordian";
import { ContentPodrollHeader } from "./ContentPodrollHeader";
import styles from "../../../styles/components/Content/Podroll/ContentPodroll.module.scss";
import { ContentPodrollChannelRow } from "./ContentPodrollChannelRow";
import { ContentPodrollItemRow } from "./ContentPodrollItemRow";

type ContentPodrollProps = {
  defaultOpen: boolean;
  podroll?: DTOPodroll | null;
}

export const ContentPodroll = ({ podroll, defaultOpen }: ContentPodrollProps) => {
  if (!podroll) {
    return null;
  }

  if (podroll.podrollChannels.length === 0 && podroll.podrollItems.length === 0) {
    return null;
  }

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
  
  const content = (
    <>
      {podrollChannelNodes}
      {podrollItemNodes}
    </>
  )

  return (
    <Accordion
      header={<ContentPodrollHeader />}
      content={content}
      open={defaultOpen}
      contentClass={styles.content}
    />
  )
}
