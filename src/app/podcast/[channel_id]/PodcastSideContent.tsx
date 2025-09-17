import { DTOChannel } from "podverse-helpers";
import { SideContent } from "../../../components/SideContent/SideContent";
import { ContentAbout } from "../../../components/Content/ContentAbout";

type PodcastSideContentProps = {
  channel: DTOChannel;
}

export const PodcastSideContent = ({ channel }: PodcastSideContentProps) => {
  return (
    <SideContent>
      <ContentAbout
        defaultOpen={true}
        description={channel.channel_description?.value} />
    </SideContent>
  )
}
