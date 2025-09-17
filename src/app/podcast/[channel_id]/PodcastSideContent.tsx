import { DTOChannel } from "podverse-helpers";
import { SideContent } from "../../../components/SideContent/SideContent";
import { SideContentAbout } from "../../../components/SideContent/SideContentAbout";

type PodcastSideContentProps = {
  channel: DTOChannel;
}

export const PodcastSideContent = ({ channel }: PodcastSideContentProps) => {
  return (
    <SideContent>
      <SideContentAbout description={channel.channel_description?.value} />
    </SideContent>
  )
}

