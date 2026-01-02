import { useLocale, useTranslations } from "use-intl"
import { DTOChannel } from "podverse-helpers";
import { Button } from "../../../Button/Button";
import { useAccount } from "../../../../contexts/Account";
import { useModals } from "../../../../contexts/Modals";
import { apiRequestService } from "../../../../factories/apiRequestService";
import { handleRateLimitAlert } from "../../../../utils/rateLimit/rateLimitAlert";
import styles from "../../../../styles/components/List/Podcasts/PodcastSettings.module.scss";

type ArtistSettingsProps = {
  channel: DTOChannel;
}

export const ArtistSettings = ({ channel }: ArtistSettingsProps) => {
  const tInfo = useTranslations('info');
  const tSettings = useTranslations('settings');
  const tInstructions = useTranslations('instructions');
  const tMisc = useTranslations('misc');
  const { loggedInAccount } = useAccount();
  const { setModalLoginRequired } = useModals();
  const locale = useLocale();

  const checkFeedForUpdates = async () => {
    if (!loggedInAccount) {
      setModalLoginRequired({
        title: null,
        message: tInstructions("login_to_refresh_feeds")
      })
      return;
    }

    if (channel?.feed) {
      try {
        await apiRequestService.reqMQRSSRefreshOnDemand({
          url: channel.feed.url,
          podcast_index_id: channel.feed.podcast_index_id
        });
        alert(tSettings('feed.check_feed_added_to_queue'));
      } catch (error) {
        const rateLimitErrorHandled = handleRateLimitAlert(error, locale, tMisc);
        if (!rateLimitErrorHandled) {
          console.error(error);
          alert("Error performing action.");
        }
      }
    }
  }

  return (
    <div>
      <h3 className={styles.sectionHeader}>{tInfo('rss_feed')}</h3>
      <Button
        variant="primary"
        onClick={checkFeedForUpdates}
      >
        {tSettings('feed.check_feed_for_updates')}
      </Button>
    </div>
  )
}
