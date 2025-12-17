import { DTOChannel, DTOPodroll } from "podverse-helpers";
import { SideContent } from "../../../components/SideContent/SideContent";
import { ContentAbout } from "../../../components/Content/About/ContentAbout";
import { ContentPodroll } from "../../../components/Content/Podroll/ContentPodroll";

type AlbumSideContentProps = {
  channel: DTOChannel;
  podroll?: DTOPodroll | null;
}

export const AlbumSideContent = ({ channel, podroll }: AlbumSideContentProps) => {
  return (
    <SideContent>
      <ContentAbout
        description={channel.channel_description?.value}
        channel_persons={channel.channel_persons}
        isAccordion={true}
        defaultOpen={true}
      />
      <ContentPodroll
        podroll={podroll}
        isAccordion={true}
        defaultOpen={true}
      />
    </SideContent>
  )
}
