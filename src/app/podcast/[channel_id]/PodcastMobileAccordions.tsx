import { DTOChannel } from "podverse-helpers";
import { ContentAbout } from "../../../components/Content/About/ContentAbout"
import { ContentMobileAccordions } from "../../../components/Content/ContentMobileAccordions";
import { ContentPeople } from "../../../components/Content/People/ContentPeople";

type PodcastMobileAccordionsProps = {
  channel: DTOChannel;
}

export const PodcastMobileAccordions = ({ channel }: PodcastMobileAccordionsProps) => {
  const description = channel?.channel_description?.value;

  return (
    <ContentMobileAccordions>
      <ContentAbout
        defaultOpen={false}
        description={description} />
      <ContentPeople
        defaultOpen={false}
        channel_persons={channel?.channel_persons}
      />
    </ContentMobileAccordions>
  )
}
