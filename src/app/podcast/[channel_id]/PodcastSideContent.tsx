import { DTOChannel } from "podverse-helpers";
import { SideContent } from "../../../components/SideContent/SideContent";
import { ContentAbout } from "../../../components/Content/About/ContentAbout";
import { ContentPeople } from "../../../components/Content/People/ContentPeople";
import Divider from "../../../components/Divider/Divider";

type PodcastSideContentProps = {
  channel: DTOChannel;
}

export const PodcastSideContent = ({ channel }: PodcastSideContentProps) => {
  return (
    <SideContent>
      <ContentAbout
        defaultOpen={true}
        description={channel.channel_description?.value} />
      <Divider />
      <ContentPeople
        defaultOpen={true}
        channel_persons={channel?.channel_persons}
      />
      <Divider />
    </SideContent>
  )
}
