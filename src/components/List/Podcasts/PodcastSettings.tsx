import { useLocale, useTranslations } from "use-intl"
import { Button } from "../../Button/Button";
import styles from "../../../styles/components/List/Podcasts/PodcastSettings.module.scss";
import { useAccount } from "../../../contexts/Account";
import { useModals } from "../../../contexts/Modals";
import { DTOChannel } from "podverse-helpers";
import { apiRequestService } from "../../../factories/apiRequestService";
import { handleRateLimitAlert } from "../../../utils/rateLimit/rateLimitAlert";

type PodcastSettingsProps = {
  channel: DTOChannel;
}

export const PodcastSettings = ({ channel }: PodcastSettingsProps) => {
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
        message: tInstructions("login_to_add_feeds")
      })
      return;
    }

    if (channel?.feed) {
      try {
        await apiRequestService.reqMQRSSRefreshOnDemand({
          url: channel.feed.url,
          podcast_index_id: channel.feed.podcast_index_id
        });
        alert(tSettings('podcast.check_feed_added_to_queue'));
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
        {tSettings('podcast.check_feed_for_updates')}
      </Button>
    </div>
  )
}
