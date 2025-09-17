import { DTOChannel } from "podverse-helpers";
import { SideContent } from "../../../components/SideContent/SideContent";
import { ContentAbout } from "../../../components/Content/About/ContentAbout";
import { ContentPeople } from "../../../components/Content/People/ContentPeople";

type PodcastSideContentProps = {
  channel: DTOChannel;
}

export const PodcastSideContent = ({ channel }: PodcastSideContentProps) => {
  return (
    <SideContent>
      <ContentAbout
        defaultOpen={true}
        description={channel.channel_description?.value} />
      <ContentPeople
        defaultOpen={true}
        channel_persons={channel?.channel_persons}
      />
    </SideContent>
  )
}
