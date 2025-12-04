import { useTranslations } from "next-intl";
import { Link } from "../Link/Link";
import { ROUTES } from "../../constants/routes";
import { InfoWrapper } from "./InfoWrapper";
import { useAccount } from "../../contexts/Account";

type HowToStartInfoProps = {
  rows: any[];
  totalPages: number;
};

export const HowToStartInfo = ({ rows, totalPages }: HowToStartInfoProps) => {
  const tSubscriptions = useTranslations("subscriptions");
  const { loggedInAccount } = useAccount();

  if (!loggedInAccount || (rows.length === 0 && totalPages === 1)) {
    return (
      <InfoWrapper>
        <p>
          {tSubscriptions.rich("how_to_start_message", {
            searchLink: (chunks) => <Link fullPageLoad href={ROUTES.SEARCH}>{chunks}</Link>,
            podcastsLink: (chunks) => <Link fullPageLoad href={`${ROUTES.PODCASTS}?type=global&sort=recent`}>{chunks}</Link>,
            videosLink: (chunks) => <Link fullPageLoad href={`${ROUTES.VIDEOS}?type=global&sort=recent`}>{chunks}</Link>,
            musicLink: (chunks) => <Link fullPageLoad href={`${ROUTES.ARTISTS}?type=global&sort=recent`}>{chunks}</Link>
          })}
        </p>
      </InfoWrapper>
    )
  }
  
  return null;
}
