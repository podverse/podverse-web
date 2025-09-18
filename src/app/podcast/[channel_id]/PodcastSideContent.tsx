import { DTOChannel, DTOPodroll } from "podverse-helpers";
import { SideContent } from "../../../components/SideContent/SideContent";
import { ContentAbout } from "../../../components/Content/About/ContentAbout";
import { ContentPeople } from "../../../components/Content/People/ContentPeople";
import { ContentPodroll } from "../../../components/Content/Podroll/ContentPodroll";

type PodcastSideContentProps = {
  channel: DTOChannel;
  podroll?: DTOPodroll | null;
}

export const PodcastSideContent = ({ channel, podroll }: PodcastSideContentProps) => {
  return (
    <SideContent>
      <ContentAbout
        defaultOpen={true}
        description={channel.channel_description?.value} />
      <ContentPodroll
        podroll={podroll}
        defaultOpen={true}
      />
      <ContentPeople
        defaultOpen={true}
        channel_persons={channel?.channel_persons}
      />
    </SideContent>
  )
}
