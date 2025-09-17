import { DTOChannel } from "podverse-helpers";
import { ContentAbout } from "../../../components/Content/ContentAbout"
import { ContentMobileAccordions } from "../../../components/Content/ContentMobileAccordions";

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
    </ContentMobileAccordions>
  )
}
