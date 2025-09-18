import { DTOChannel, DTOPodroll } from "podverse-helpers";
import { ContentAbout } from "../../../components/Content/About/ContentAbout"
import { ContentMobileAccordions } from "../../../components/Content/ContentMobileAccordions";
import { ContentPeople } from "../../../components/Content/People/ContentPeople";
import Divider from "../../../components/Divider/Divider";
import { ContentPodroll } from "../../../components/Content/Podroll/ContentPodroll";

type PodcastMobileAccordionsProps = {
  channel: DTOChannel;
  podroll?: DTOPodroll | null;
}

export const PodcastMobileAccordions = ({ channel, podroll }: PodcastMobileAccordionsProps) => {
  const description = channel?.channel_description?.value;

  return (
    <ContentMobileAccordions>
      <ContentAbout
        defaultOpen={false}
        description={description}
      />
      <ContentPodroll 
        defaultOpen={false}
        podroll={podroll}
      />
      <ContentPeople
        defaultOpen={false}
        channel_persons={channel?.channel_persons}
      />
      <Divider />
    </ContentMobileAccordions>
  )
}
